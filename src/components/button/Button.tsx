import './button.css'
import iconPack from '../../icons/iconPack.json'
import { Icon } from '..';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    label?: string;
    onClick?: (...args: any) => void;
    disabled?: boolean;
    icon?: keyof typeof iconPack;
}

const Button = (props: ButtonProps) => {
    const {
        variant,
        label,
        onClick,
        disabled,
        icon,
    } = props;

  return (
    <button
        className={`button ${variant} ${disabled ? 'button-disabled': ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        {
            icon &&  <Icon className="button-icon" icon={icon} />
        }
        {
            label &&  <span>{label}</span>
        }
        
  </button>
  )
}

export default Button

Button.defaultProps = {
    icon: undefined,
    onClick: () => {},
    label: undefined,
    disabled: false,
    variant: 'primary'
}