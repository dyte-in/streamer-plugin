import { Icon } from '..';
import iconPack from '../../icons/iconPack.json'
import './input.css'

interface InputProps {
    placeholder: string;
    icon?: keyof typeof iconPack;
    onChange?: (args: any) => void;
    value?: any;
    disabled?: boolean;
    onKeyDown?: (args: any) => void;
}

const Input = (props: InputProps) => {
    const {
        placeholder,
        icon,
        onChange,
        value,
        disabled,
        onKeyDown,
     } = props;

  return (
    <div className="input-container">
    {icon && <Icon className="input-icon" icon={icon} />}
    {!icon && <span></span>}
    <input
        type='text'
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}/>
  </div>
  )
}

export default Input

Input.defaultProps = {
    icon: undefined,
    disabled: false,
    value: '',
    onChange: () => {},
    onKeyDown: () => {},
}