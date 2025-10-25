type Props = {
  steps: string[]
  current: number
}

export default function Stepper({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${current >= idx + 1 ? 'bg-ocean-gradient text-white shadow-card' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</div>
          {idx < steps.length - 1 && (
            <div className={`w-20 h-1 mx-2 ${current > idx + 1 ? 'bg-ocean-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}


