import './toolbar.css';
import { Icon } from '..';
import { ToolbarState } from '../../utils/types';
import { colors, tools } from '../../utils/contants';
import { useEffect, useRef } from 'react';


interface ToolbarRightProps {
  scale: number;
  activeColor: string;
  activeTool: ToolbarState;
  onNewFile: () => void;
  setActiveColor: (col: string) => void;
  selectActiveTool: (state: ToolbarState) => void;
}

interface ToolbarLeftProps {
  onNext: () => void;
  onPrev: () => void;
  pageCount: number;
  currentPage: number;
}

const ToolbarRight = (props: ToolbarRightProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    scale,
    activeTool,
    activeColor,
    onNewFile,
    setActiveColor,
    selectActiveTool,
  } = props;

  const updateTool = (e: ToolbarState) => {
    selectActiveTool(e)
  };

  useEffect(() => {
    window.onclick = (e: any) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        const color = document.getElementById('color');
        if (color?.contains(e.target)) {
          if (ref.current.style.display === 'flex') 
            ref.current.style.display = 'none'
          else
            ref.current.style.display = 'flex';
          return; 
        }
        ref.current.style.display = 'none'; 
      }
    }
  }, [])

  return (
    <div className="toolbar-right">
      <div className="row">
        <Icon icon="add_file" className="new-file-tool" onClick={onNewFile} />
        <div className="toolbar-page">
          <Icon onClick={() => updateTool('zoom-in-tool')} className="toolbar-icon" icon='zoomIn' />
          <span>{Math.round(scale * 100)}%</span>
          <Icon onClick={() => updateTool('zoom-out-tool')} className="toolbar-icon" icon='zoomOut' />
        </div>
      </div>
      <div className="toolbar-tools">
        {
          tools.map(({icon, tool}) => (
            <Icon key={tool} icon={icon} onClick={() => selectActiveTool(tool)} className={`toolbar-drawing-icon ${activeTool === tool ? 'active' : ''}`}/>
          ))
        }
        <div id="color" className={`color ${activeColor}`}></div>
        <div ref={ref} className="color-selector">
          {colors.map((color, index) => (
              <div
                onClick={() => setActiveColor(color)}
                key={index}
                className={`color ${color} ${color === activeColor ? 'active-color' : ''}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ToolbarLeft = (props: ToolbarLeftProps) => {
  const { onNext, onPrev, pageCount, currentPage } = props;

  return (
    <div className="toolbar-left">
      <div className="toolbar-page">
        <Icon onClick={onPrev} className="toolbar-icon" icon='previous' />
        Page {currentPage}/{pageCount}
        <Icon onClick={onNext} className="toolbar-icon" icon='next' />
      </div>
    </div>
  )
}

export {
  ToolbarRight,
  ToolbarLeft,
}
