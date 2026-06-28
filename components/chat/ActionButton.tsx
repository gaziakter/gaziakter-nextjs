import type { ButtonData } from '@/lib/types'

interface ActionButtonProps {
  button: ButtonData
  onSelect: (button: ButtonData) => void
}

export default function ActionButton({ button, onSelect }: ActionButtonProps) {
  return (
    <button
      className={`btn btn-primary${button.variant === 'secondary' ? ' btn-secondary' : ''}`}
      onClick={() => onSelect(button)}
    >
      <span className="button-content">
        <span>{button.label}</span>
        <span>{button.label}</span>
      </span>
    </button>
  )
}
