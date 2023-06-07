import './dashboard.css';
import { useContext, useEffect, useState } from 'react';
import { FileInput, Header, File, ErrorModal } from '../../components'
import { MainContext } from '../../context';
import { fetchUrl, getFormData } from '../../utils/helpers';
import axios from 'axios';
import { controller, dashboardMessages, errorMessages } from '../../utils/contants';

const Dashboard = () => {
    const { plugin, base, setDocument } = useContext(MainContext);
    const [search, setSearch] = useState<string>('');
    const [files, setFiles] = useState<string[]>([]);
    const [status, setStatus] = useState<string>(dashboardMessages.success);
    const [loadingVal, setLoadingVal] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchFiles();
    }, [])
    
    // Load remote documents
    const fetchFiles = async () => {
        try {
            const files = await axios.get(`${import.meta.env.VITE_API_BASE}/files/${base}`);
            setFiles(files.data.files);
        } catch (e) {
            setStatus(dashboardMessages.error);
        }
    };

    // Load document
    const onUpload = async () => {
        try {
            setDisabled(true);
            let blob = await axios.get(search).then(r => new Blob([r.data]));
            const formData = getFormData(blob, base);
            const url = await fetchUrl(formData, plugin.authToken, setLoadingVal);
            nextPage(url)
        } catch (e: any) {
            if (e.code === 'ERR_NETWORK') setError(errorMessages.cors)
            else setError(errorMessages.upload)
            setSearch('');
            setLoadingVal(0);
            setDisabled(false);
        }
    }
    const onClick = () => {
        setDisabled(true);
        const file = document.createElement('input')
        file.type = 'file';
        file.accept = '.doc,.docx,.ppt,.pptx,.txt,.pdf';
        file.click();
        file.onchange = async ({ target}: { target: any }) => {
            const formData = getFormData(target.files[0], base);
            try {
                const url = await fetchUrl(formData, plugin.authToken, setLoadingVal);
                nextPage(url)
            } catch (e) {
                setSearch('');
                setDisabled(false);
                setLoadingVal(0);
                setError(errorMessages.upload)
            }
        }
    }
    const onDrop = async (e: any) => {
        setDisabled(true);
        e.preventDefault();
        let file;
        file = e.dataTransfer.files[0];
        const formData = getFormData(file, base);
        try {
            const url = await fetchUrl(formData, plugin.authToken);
            nextPage(url)
        } catch (e) {
            setSearch('');
            setLoadingVal(0);
            setError(errorMessages.upload)
            setDisabled(false);
        }
    }

    // Navigate
    const nextPage = async (url: string | undefined) => {
        if (!url) return;
        setSearch(url);
        setDocument(url);
        setDisabled(false);
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

    // Delete
    const onDelete = async (fileName: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE}/file/${fileName}`, {
                headers: {"Authorization": `Bearer ${plugin.authToken}`},
            });
            setFiles([...files.filter(x => x !== fileName)])
        } catch (e: any) {
            setError(e.message ?? errorMessages.delete);
        }
    }
    const onDismiss = () => {
       controller.abort();
    }

    return (
        <div className="dashboard-container">
            {
                error && (
                <ErrorModal
                    onClose={() => {setError('')}}
                    message={error}
                />
                )
            }
            <Header
                search={search}
                updateSearch={updateSearch}
                onUpload={onUpload}
                disabled={disabled}
            />
            <FileInput
                disabled={disabled}
                onDrop={onDrop} 
                onClick={onClick}
            />
            <div className="file-container">
                <h3>Recent Uploads</h3>
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
                       {status}
                    </div>
                }
                {
                    files.map((f, index) => (
                        <File
                        key={index}
                        label={f.replace(`${base}-`, '')}
                        onDelete={() => onDelete(f)}
                        onClick={() => nextPage(`${import.meta.env.VITE_API_BASE}/file/${f}`)}
                        size={getFileSize(`${import.meta.env.VITE_API_BASE}/file/${f}`) ?? 0.0} 
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Dashboard
