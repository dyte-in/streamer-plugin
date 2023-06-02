import './fileInput.css'
import { Icon } from '..'

interface FileInputProps {
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const FileInput = (props: FileInputProps) => {
    const { onDrop, onClick } = props;

    return (
        <div className="file-input" onDragOver={(e) => {e.preventDefault()}} onDrop={onDrop}>
            <h3>
                Share Docs & <br/> Collaborate with Ease
            </h3>
            <Icon className='file-input-icon' icon='upload'/>
            <p>Drop your files here or <span onClick={onClick}>Browse</span></p>
            <div className="file-helper-text">Max. file size 50 MB. Upload formats supported:  PPTX, PPT, DOC, PDF</div>
        </div>
    )
}

export default FileInput