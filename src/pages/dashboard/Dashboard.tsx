import './dashboard.css';
import { useContext, useEffect, useState } from 'react';
import { FileInput, Header, File } from '../../components'
import { MainContext } from '../../context';
import { fetchUrl, getFormData } from '../../utils/helpers';
import axios from 'axios';
import { controller } from '../../utils/contants';


const Dashboard = () => {
    const { setDocument } = useContext(MainContext);
    const [search, setSearch] = useState<string>('');
    const [files, setFiles] = useState<string[]>([]);
    const [loadingVal, setLoadingVal] = useState<number>(0);

    useEffect(() => {
        fetchFiles();
    }, [])
    
    // Load remote documents
    const fetchFiles = async () => {
        try {
            const files = await axios.get('http://localhost:3001/files/xscdv');
            setFiles(files.data.files);
        } catch (e) {
            console.log(e);
        }
    };

    // Load document
    const onUpload = () => {
        nextPage(search);
    }
    const onClick = () => {
        const file = document.createElement('input')
        file.type = 'file';
        file.accept = '.doc,.docx,.ppt,.pptx,.txt,.pdf';
        file.click();
        file.onchange = async ({ target}: { target: any }) => {
            const formData = getFormData(target.files[0]);
            const url = await fetchUrl(formData, setLoadingVal);
            nextPage(url)
        }
    }
    const onDrop = async (e: any) => {
        e.preventDefault();
        let file;
        file = e.dataTransfer.files[0];
        const formData = getFormData(file);
        const url = await fetchUrl(formData);
        nextPage(url);
    }

    // Navigate
    const nextPage = (url: string | undefined) => {
        if (!url) return;
        setSearch(url);
        setDocument(url);
    }

    // Helper functions
    const updateSearch = ({ target }: { target: { value: any} }) => {
        setSearch(target?.value);
    }
    const getFileSize = (url: string) => {
        let fileSize: string | null;
        const http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send(null); 
        if (http.status === 200) {
            fileSize = http.getResponseHeader('content-length');
            if (!fileSize) return 0;
            return parseFloat(fileSize);
        }
        return 0;
    }

    // Delte
    const onDelete = async (fileName: string) => {
        try {
            await axios.delete(`http://localhost:3001/file/xscdv${fileName}`);
            setFiles([...files.filter(x => x !== fileName)])
        } catch (e) {
            console.log(e);
        }
    }
    const onDismiss = () => {
       controller.abort();
    }

    return (
        <div className="dashboard-container">
            <Header
                search={search}
                updateSearch={updateSearch}
                onUpload={onUpload}
            />
            <FileInput
                onDrop={onDrop} 
                onClick={onClick}
            />
            <div className="file-container">
                <h3>Recent Files</h3>
                {
                    loadingVal !== 0 &&
                    <File
                    onDismiss={onDismiss}
                    label='React India Quiz'
                    size={getFileSize(search) ?? 0.0}
                    state={loadingVal === 100 ? 'loaded' : 'loading'}
                    loadingVal={loadingVal} />
                }
                {
                    ((!loadingVal || loadingVal === 0) && files.length < 1)
                    && <div className="empty">
                        No Recent Files. Files are retained only for the duration of this session.
                    </div>
                }
                {
                    files.map((f, index) => (
                        <File
                        label={f}
                        onClick={() => nextPage(`http://localhost:3001/file/xscdv${f}`)}
                        key={index}
                        onDelete={() => onDelete(f)}
                        size={getFileSize(`http://localhost:3001/file/xscdv${f}`) ?? 0.0} 
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Dashboard
