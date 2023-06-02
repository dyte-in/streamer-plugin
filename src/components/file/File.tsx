import { Icon, Loader } from '..'
import logo from '../../assets/doc.png';
import './file.css'

interface FileProps {
    label: string;
    size: number;
    state?: 'loading' | 'loaded';
    loadingVal?: number,
    onClick?: () => void;
    onDelete?: () => void;
    onDismiss?: () => void;
}

const File = (props: FileProps) => {
   
   const { label, size, state, loadingVal, onClick, onDelete, onDismiss } = props;

   const formatSize = () => {
    let ext = 'KB';
    let s = size / 1000;
    if (s > 100) {
        s = s / 1000;
        ext = 'MB'
    }
    return `${s.toFixed(2)} ${ext}`
   }

  return (
    <div className="file">
        <div className={`row ${state}`} onClick={onClick}>
            <img src={logo} className="file-logo" />
            <div className="col">{label}<span>{formatSize()}</span></div>
        </div>
        <div className="file-actions">
            {state === 'loading' && <Loader val={loadingVal ?? 0} />}
            {
                state === 'loading' ? <Icon onClick={onDismiss} className="file-icon" icon="dismiss" /> : <Icon  onClick={onDelete} className="file-icon" icon="delete" />
            }
        </div>
    </div>
  )
}

export default File

File.defaultProps = {
    loadingVal: 0,
    state: 'loaded',
    onDelete: () => {},
    onClick: () => {},
    onDismiss: () => {},
}