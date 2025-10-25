"""DOCX to PDF conversion utilities.

Prefers LibreOffice headless conversion; falls back to docx2pdf on Windows.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path


def _has_soffice() -> bool:
    return shutil.which('soffice') is not None or shutil.which('libreoffice') is not None


def _convert_with_soffice(input_docx: Path, output_pdf: Path) -> bool:
    # Convert in the output directory to avoid temp scatter
    out_dir = output_pdf.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        shutil.which('soffice') or shutil.which('libreoffice'),
        '--headless',
        '--convert-to', 'pdf',
        '--outdir', str(out_dir),
        str(input_docx),
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc.returncode == 0 and output_pdf.exists()


def _convert_with_docx2pdf(input_docx: Path, output_pdf: Path) -> bool:
    try:
        from docx2pdf import convert  # type: ignore
    except Exception:
        return False
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    convert(str(input_docx), str(output_pdf))
    return output_pdf.exists()


def convert_docx_to_pdf(input_docx_path: Path, pdf_target_path: Path) -> Path:
    """Convert DOCX to PDF and return the PDF path. Raises on failure."""
    input_docx = Path(input_docx_path)
    output_pdf = Path(pdf_target_path)

    if not input_docx.exists():
        raise FileNotFoundError(f"Input DOCX not found: {input_docx}")

    # Prefer LibreOffice if available
    if _has_soffice():
        if _convert_with_soffice(input_docx, output_pdf):
            return output_pdf

    # Fallback to docx2pdf (Windows/Office)
    if _convert_with_docx2pdf(input_docx, output_pdf):
        return output_pdf

    raise RuntimeError("Failed to convert DOCX to PDF (no converter available or conversion failed)")


