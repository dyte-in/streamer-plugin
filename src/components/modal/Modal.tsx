import React, { useContext, useEffect } from 'react'
import './modal.css'
import { MainContext } from '../../context';
import ReactPlayer from 'react-player';

interface ModalProps {
  label: string;
  description: string;
  cta: string;
  onClick: any;
  playerEl: React.RefObject<ReactPlayer>,
}

const Modal = (props: ModalProps) => {
  const { label, description, cta, onClick, playerEl } = props;
  const { activePlayer } = useContext(MainContext);

  const detectInitalClick = () => {
    const internalPlayer = playerEl?.current?.getInternalPlayer();
    if (!internalPlayer) return;
    const win = internalPlayer._window;
    var monitor = setInterval(function(){
      var elem = win.document?.activeElement;
      if(elem && elem.tagName == 'IFRAME'){
        onClick();
        clearInterval(monitor);
      }
    }, 100);
}

useEffect(() => {
  if (!playerEl?.current) return;
  if (activePlayer === 'vimeo') detectInitalClick();
}, [playerEl])

  return (
    <div className={`modal ${activePlayer}`} onClick={onClick}>
      {label}
      <p>{description}</p>
      <button className={activePlayer}>{cta}</button>
    </div>
  )
}

export default Modal