import React from 'react';
import '../css/LoadingSpinner.css';
import { ClipLoader } from 'react-spinners';

interface LoadingProps {
    loading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className="loading-overlay">
            <div className="loading-spinner">
                <ClipLoader size={150} color={"#123abc"} loading={loading} />
            </div>
        </div>
    );
};
