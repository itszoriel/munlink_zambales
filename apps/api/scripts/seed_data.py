"""
Seed script to populate database with initial data.
Run this after creating the database tables.
"""
import sys
import os
# Ensure project root is importable so `apps.api.*` works
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from apps.api.app import create_app
from apps.api import db
from apps.api.models.municipality import Municipality, Barangay
from apps.api.models.document import DocumentType
from apps.api.models.issue import IssueCategory
from apps.api.models.benefit import BenefitProgram
from datetime import datetime

# Municipality data for Zambales (EXACTLY 13)
ZAMBALES_MUNICIPALITIES = [
    {
        'name': 'Botolan',
        'slug': 'botolan',
        'psgc_code': '037103000',
        'description': 'Home of Mount Pinatubo',
        'barangays': ['Bangan', 'Batonlapoc', 'Beneg', 'Binuclutan', 'Burgos', 'Cabatuan', 'Capayawan', 'Carael', 'Dampay', 'Maguisguis', 'Malomboy', 'Moraza', 'Nacolcol', 'Paco (Pob.)', 'Palis', 'Pangolingan', 'Paudpod', 'Porac', 'Poonbato', 'Salaza', 'San Isidro', 'San Juan', 'San Miguel', 'Santiago (Pob.)', 'Tampo (Pob.)', 'Taugtog', 'Villar', 'Balaybay', 'Bancal', 'Barangay I (Pob.)', 'Barangay II (Pob.)', 'Barangay III (Pob.)']
    },
    {
        'name': 'Cabangan',
        'slug': 'cabangan',
        'psgc_code': '037104000',
        'description': 'A coastal municipality in Zambales',
        'barangays': ['Anonang', 'Banuambayo', 'Cadmang-Reserva', 'Camiling', 'Casabaan', 'Conacon', 'Felmida-Diaz', 'Gomoil', 'Laoag', 'Lomboy', 'Longos', 'New San Juan', 'Pinalusan', 'San Rafael', 'Siminublan', 'Tondo', 'Felmida-Diaz (Del Pilar)', 'Camiling (New San Andres)']
    },
    {
        'name': 'Candelaria',
        'slug': 'candelaria',
        'psgc_code': '037105000',
        'description': 'A progressive municipality',
        'barangays': ['Bacundao', 'Baloguen', 'Binabalian', 'Bulawen', 'Catol', 'Dampay', 'Libertador', 'Looc', 'Malabon', 'Malacampa', 'Palacpalac', 'Poblacion', 'Sinabacan', 'Tapuac', 'Uacon']
    },
    {
        'name': 'Castillejos',
        'slug': 'castillejos',
        'psgc_code': '037106000',
        'description': 'Home of Ramon Magsaysay Ancestral House',
        'barangays': ['Balaybay', 'Del Pilar', 'Looc', 'Magsaysay', 'Nagbayan', 'Nagbunga', 'Poblacion', 'San Agustin', 'San Jose', 'San Juan', 'San Nicolas', 'San Roque', 'Santa Maria', 'Talisay']
    },
    {
        'name': 'Iba',
        'slug': 'iba',
        'psgc_code': '037107000',
        'description': 'Capital of Zambales Province',
        'barangays': ['Amungan', 'Aglao', 'Bangantalinga', 'Dirita-Baloguen', 'Lipay-Dingin-Panibuatan', 'Palanginan (Palanguinan)', 'San Agustin', 'Santa Barbara', 'Santo Rosario (Pob.)', 'Bano', 'Lipay', 'Zone 1 (Pob.)', 'Zone 2 (Pob.)', 'Zone 3 (Pob.)', 'Zone 4 (Pob.)', 'Zone 5 (Pob.)', 'Zone 6 (Pob.)']
    },
    {
        'name': 'Masinloc',
        'slug': 'masinloc',
        'psgc_code': '037108000',
        'description': 'Home of historic Masinloc Church',
        'barangays': ['Baloganon', 'Bamban', 'Bani', 'Collat', 'Inhobol', 'North Poblacion', 'San Lorenzo', 'San Salvador', 'Santa Rita', 'Santo Rosario (Culibasa)', 'South Poblacion', 'Taltal', 'Taposo']
    },
    {
        'name': 'Palauig',
        'slug': 'palauig',
        'psgc_code': '037109000',
        'description': 'A coastal municipality',
        'barangays': ['Alwa', 'Bato', 'Bulawen', 'Garreta', 'Liozon', 'Lipay', 'Locloc', 'Pangolingan', 'Poblacion', 'Salaza', 'San Juan', 'Santa Cruz', 'Tition', 'Taugtog']
    },
    {
        'name': 'San Antonio',
        'slug': 'san-antonio',
        'psgc_code': '037111000',
        'description': 'Home to Pundaquit Beach',
        'barangays': ['Beddeng', 'Burgos', 'Estansa', 'San Gregorio', 'Pundaquit', 'Rizal', 'San Pablo']
    },
    {
        'name': 'San Felipe',
        'slug': 'san-felipe',
        'psgc_code': '037112000',
        'description': 'Famous for Arko Entrance',
        'barangays': ['Amagna', 'Apostol', 'Balincaguing', 'Farañal', 'Maloma', 'Manglicmot', 'Poblacion', 'Rosete', 'San Rafael']
    },
    {
        'name': 'San Marcelino',
        'slug': 'san-marcelino',
        'psgc_code': '037113000',
        'description': 'A progressive municipality',
        'barangays': ['Aglao', 'Buyon', 'Central', 'Consuelo Norte', 'Consuelo Sur', 'Linasin', 'Luan', 'Lucero', 'Nagbunga', 'Poblacion', 'Porac', 'San Guillermo', 'San Isidro', 'San Rafael', 'Santa Fe', 'Tabalong']
    },
    {
        'name': 'San Narciso',
        'slug': 'san-narciso',
        'psgc_code': '037114000',
        'description': 'A coastal municipality with beautiful beaches',
        'barangays': ['Alusiis', 'Beddeng', 'Grullo', 'La Paz', 'Libertad', 'Namatacan', 'Nangatngatan', 'Omaya', 'Paite Norte', 'Paite Sur', 'Patrocinio', 'Poblacion', 'San Jose', 'San Juan', 'San Pascual', 'Santa Rosa', 'Siminublan', 'Tampunan']
    },
    {
        'name': 'Santa Cruz',
        'slug': 'santa-cruz',
        'psgc_code': '037115000',
        'description': 'A municipality in Zambales',
        'barangays': ['Biay', 'Bolitoc', 'Candelaria', 'Lambingan', 'Lipay', 'Lucapon North', 'Lucapon South', 'Malabago', 'Naulo', 'Poblacion Zone I', 'Poblacion Zone II', 'Poblacion Zone III', 'Santa Cruz']
    },
    {
        'name': 'Subic',
        'slug': 'subic',
        'psgc_code': '037116000',
        'description': 'A coastal municipality',
        'barangays': ['Aningway Sacatihan', 'Asinan Poblacion', 'Asinan Proper', 'Baraca-Camachile (Pob.)', 'Batiawan', 'Calapacuan', 'Calapandayan (Pob.)', 'Cawag', 'Ilwas (Pob.)', 'Mangan-Vaca', 'Matain', 'Naugsol', 'Pamatawan', 'San Isidro', 'Santo Tomas', 'Wawandue (Pob.)']
    }
]

# Document types (legally-safe defaults)
DOCUMENT_TYPES = [
    {
        'name': 'Barangay Clearance',
        'code': 'BRGY_CLEARANCE',
        'description': 'Certificate of good standing from barangay',
        'authority_level': 'barangay',
        'requirements': ['Valid ID', 'Purpose of request'],
        'fee': 50.00,
        'processing_days': 1,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Certificate of Indigency',
        'code': 'BRGY_INDIGENCY',
        'description': 'Proof of indigency for assistance',
        'authority_level': 'barangay',
        'requirements': ['Valid ID', 'Purpose of request'],
        'fee': 0.00,
        'processing_days': 1,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Certificate of Residency',
        'code': 'CERT_RESIDENCY',
        'description': 'Proof of residency in the municipality',
        'authority_level': 'municipal',
        'requirements': ['Valid ID'],
        'fee': 100.00,
        'processing_days': 3,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Community Tax Certificate (Cedula)',
        'code': 'CEDULA',
        'description': 'Community Tax Certificate (application only)',
        'authority_level': 'municipal',
        'requirements': ['Valid ID'],
        'fee': 30.00,
        'processing_days': 1,
        'supports_physical': True,
        'supports_digital': False,
    },
    {
        'name': 'Business Permit (New/Renewal)',
        'code': 'BUSINESS_PERMIT',
        'description': 'Permit to operate a business',
        'authority_level': 'municipal',
        'requirements': ['DTI/SEC Registration', 'Barangay Clearance', 'Lease/Proof of address'],
        'fee': 500.00,
        'processing_days': 7,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Sanitary Permit',
        'code': 'SANITARY_PERMIT',
        'description': 'Sanitary clearance for establishments',
        'authority_level': 'municipal',
        'requirements': ['Health Certificate(s)', 'Inspection schedule'],
        'fee': 200.00,
        'processing_days': 3,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Zoning/Locational Clearance',
        'code': 'ZONING_CLEARANCE',
        'description': 'Clearance for land use/structure siting',
        'authority_level': 'municipal',
        'requirements': ['Site plan/sketch', 'Lot documents'],
        'fee': 300.00,
        'processing_days': 5,
        'supports_physical': True,
        'supports_digital': True,
    },
    {
        'name': 'Building Permit',
        'code': 'BUILDING_PERMIT',
        'description': 'Permit to construct/renovate structures (application only)',
        'authority_level': 'municipal',
        'requirements': ['Signed plans', 'Zoning clearance', 'Lot documents'],
        'fee': 1000.00,
        'processing_days': 10,
        'supports_physical': True,
        'supports_digital': False,
    },
]

# Issue categories
ISSUE_CATEGORIES = [
    {'name': 'Infrastructure', 'slug': 'infrastructure', 'description': 'Road damage, bridges, public facilities', 'icon': 'road'},
    {'name': 'Public Safety', 'slug': 'public-safety', 'description': 'Crime, accidents, hazards', 'icon': 'shield'},
    {'name': 'Environment', 'slug': 'environment', 'description': 'Pollution, waste management, flooding', 'icon': 'tree'},
    {'name': 'Public Health', 'slug': 'public-health', 'description': 'Health concerns, sanitation', 'icon': 'heart'},
    {'name': 'Utilities', 'slug': 'utilities', 'description': 'Water, electricity, internet issues', 'icon': 'zap'},
    {'name': 'Others', 'slug': 'others', 'description': 'Other municipal concerns', 'icon': 'alert-circle'},
]


def seed_municipalities():
    """Seed municipalities and barangays."""
    print("Seeding municipalities...")
    
    for mun_data in ZAMBALES_MUNICIPALITIES:
        # Check if municipality already exists
        existing = Municipality.query.filter_by(slug=mun_data['slug']).first()
        
        if existing:
            print(f"  - {mun_data['name']} already exists, skipping...")
            continue
        
        # Create municipality
        municipality = Municipality(
            name=mun_data['name'],
            slug=mun_data['slug'],
            psgc_code=mun_data['psgc_code'],
            description=mun_data.get('description'),
            is_active=True
        )
        
        db.session.add(municipality)
        db.session.flush()  # Flush to get municipality ID
        
        # Create barangays
        for idx, brgy_name in enumerate(mun_data.get('barangays', [])):
            brgy_slug = brgy_name.lower().replace(' ', '-').replace('(', '').replace(')', '').replace('.', '')
            psgc_code = f"{mun_data['psgc_code']}{str(idx + 1).zfill(3)}"
            
            barangay = Barangay(
                name=brgy_name,
                slug=brgy_slug,
                municipality_id=municipality.id,
                psgc_code=psgc_code,
                is_active=True
            )
            
            db.session.add(barangay)
        
        print(f"  - Created {mun_data['name']} with {len(mun_data.get('barangays', []))} barangays")
    
    db.session.commit()
    print("Municipalities seeded successfully\n")


def seed_document_types():
    """Seed document types."""
    print("Seeding document types...")
    
    for doc_data in DOCUMENT_TYPES:
        # Check if document type already exists
        existing = DocumentType.query.filter_by(code=doc_data['code']).first()
        
        if existing:
            print(f"  - {doc_data['name']} already exists, skipping...")
            continue
        
        doc_type = DocumentType(
            name=doc_data['name'],
            code=doc_data['code'],
            description=doc_data.get('description'),
            authority_level=doc_data['authority_level'],
            requirements=doc_data.get('requirements'),
            fee=doc_data.get('fee', 0.00),
            processing_days=doc_data.get('processing_days', 3),
            supports_physical=doc_data.get('supports_physical', True),
            supports_digital=doc_data.get('supports_digital', True),
            is_active=True
        )
        
        db.session.add(doc_type)
        print(f"  - Created {doc_data['name']}")
    
    db.session.commit()
    print("Document types seeded successfully\n")


def seed_issue_categories():
    """Seed issue categories."""
    print("Seeding issue categories...")
    
    for cat_data in ISSUE_CATEGORIES:
        # Check if category already exists
        existing = IssueCategory.query.filter_by(slug=cat_data['slug']).first()
        
        if existing:
            print(f"  - {cat_data['name']} already exists, skipping...")
            continue
        
        category = IssueCategory(
            name=cat_data['name'],
            slug=cat_data['slug'],
            description=cat_data['description'],
            icon=cat_data['icon'],
            is_active=True
        )
        
        db.session.add(category)
        print(f"  - Created {cat_data['name']}")
    
    db.session.commit()
    print("Issue categories seeded successfully\n")


def main():
    """Run all seed functions."""
    app = create_app()
    
    with app.app_context():
        print("\n" + "="*50)
        print("MUNLINK ZAMBALES - DATABASE SEEDING")
        print("="*50 + "\n")
        
        try:
            seed_municipalities()
            seed_document_types()
            seed_issue_categories()
            # Seed a few benefit programs if none exist
            print("Seeding benefit programs...")
            if BenefitProgram.query.count() == 0:
                samples = [
                    BenefitProgram(name='Educational Assistance', code='EDU_ASSIST', description='Financial aid for qualified students', program_type='educational', municipality_id=None, eligibility_criteria={'resident': True}, required_documents=['Valid ID','Enrollment certificate'], is_active=True, is_accepting_applications=True),
                    BenefitProgram(name='Senior Citizen Subsidy', code='SENIOR_SUBSIDY', description='Monthly subsidy for seniors', program_type='financial', municipality_id=None, eligibility_criteria={'age': '>=60'}, required_documents=['Senior citizen ID'], is_active=True, is_accepting_applications=True),
                    BenefitProgram(name='Livelihood Starter Kit', code='LIVELIHOOD_KIT', description='Starter kits and training', program_type='livelihood', municipality_id=None, eligibility_criteria={'training': True}, required_documents=['Valid ID','Intent letter'], is_active=True, is_accepting_applications=True),
                ]
                for p in samples:
                    db.session.add(p)
                db.session.commit()
                print("Benefit programs seeded")
            else:
                print("Benefit programs already exist, skipping...")
            
            print("="*50)
            print("ALL DATA SEEDED SUCCESSFULLY!")
            print("="*50 + "\n")
            
        except Exception as e:
            print(f"\nERROR: {str(e)}\n")
            db.session.rollback()
            raise


if __name__ == '__main__':
    main()

