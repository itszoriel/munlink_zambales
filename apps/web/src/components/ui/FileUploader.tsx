import { useRef, useState } from 'react'

type Props = {
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  onFiles: (files: File[]) => void
  label?: string
}

export default function FileUploader({ accept = 'image/*,.pdf', multiple = true, maxSizeMb = 10, onFiles, label = 'Upload files' }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>('')

  const handle = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    const tooBig = arr.find(f => f.size > maxSizeMb * 1024 * 1024)
    if (tooBig) { setError(`File ${tooBig.name} exceeds ${maxSizeMb}MB`); return }
    setError('')
    onFiles(arr)
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button type="button" className="btn btn-secondary" onClick={() => ref.current?.click()}>{label}</button>
        <input ref={ref} type="file" className="hidden" accept={accept} multiple={multiple} onChange={(e) => handle(e.target.files)} />
      </div>
      {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
    </div>
  )
}


