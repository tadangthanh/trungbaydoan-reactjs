import React from 'react';
import '../css/LoadingSpinner.css';
interface LoadingSpinnerProps {
    isSuccess: boolean;
    successMessage: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isSuccess, successMessage }) => {
    return (
        <div className="overlay">
            {isSuccess ? (
                <div className="success-message">{successMessage}</div>
            ) : (
                <div className="spinner"></div>
            )}
        </div>
    );
}

export default LoadingSpinner;
