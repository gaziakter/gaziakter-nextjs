import type { ButtonData } from '@/lib/types'
import ActionButton from './ActionButton'

interface OptionsListProps {
  options: ButtonData[]
  onSelect: (button: ButtonData) => void
}

export default function OptionsList({ options, onSelect }: OptionsListProps) {
  return (
    <div className="contextual-options">
      {options.map((button, index) => (
        <ActionButton key={`${button.label}-${index}`} button={button} onSelect={onSelect} />
      ))}
    </div>
  )
}
