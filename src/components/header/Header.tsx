import './header.css';
import Button from '../button/Button';
import Input from '../input/Input';
import logo from '../../assets/document.png';

interface HeaderProps {
  search: string;
  updateSearch: ({ target }: { target: any }) => void;
  onUpload: () => void;
}

const Header = (props: HeaderProps) => {
  const { search, updateSearch, onUpload } = props;

  return (
    <div className="header-container">
    <img src={logo} className="header-logo" />
    <Input
      placeholder='Paste a link to your PDF document'
      icon='search'
      value={search}
      onChange={updateSearch}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter') onUpload();
      }}/>
    <Button onClick={onUpload} label='Upload' variant='secondary' />
    </div>
  )
}

export default Header