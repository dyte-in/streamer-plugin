import React from 'react'
import './header.css';
import logo from '../../assets/logo.png';
import Button from '../button/Button';
import Input from '../input/Input';

const Header = () => {
  return (
    <div className="header">
        <img src={logo} />
        <Input placeholder='Paste a link to your video here' />
        <Button
            onClick={()=>{}}
            icon='search'
            variant='primary'
        />
    </div>
  )
}

export default Header