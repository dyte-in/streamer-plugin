import React from 'react'
import './errorModal.css';

interface ErrorProps {
    message: string;
    onClose: () => void;
}

const ErrorModal = (props: ErrorProps) => {
    const { message, onClose } = props;

    return (
        <div className="error-modal-container">
            <div className="error-modal">
                <h3>Error</h3>
                <p>{message}</p>
                <button onClick={onClose}>Try Again</button>
            </div>
        </div>
    )
}

export default ErrorModal