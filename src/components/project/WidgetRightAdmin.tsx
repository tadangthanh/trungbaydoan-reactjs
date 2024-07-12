import React from "react";

interface WidgetRightAdminProps {
    setIsEditContent: (isEditContent: boolean) => void;
    isEditContent: boolean;
    handleCancelUpdate: () => void;
}
export const WidgetRightAdmin: React.FC<WidgetRightAdminProps> = ({ handleCancelUpdate, setIsEditContent, isEditContent }) => {
    return (
        <div className="card mb-4">
            <div className="card-header"><i className="me-1 fa-solid fa-gear"></i>Chức năng</div>
            <div className="card-body">
                <button className="me-1 mt-1 btn btn-outline-success"><i className="me-1 fa-solid fa-check"></i>Phê duyệt</button>
                <button className="me-1 mt-1 btn btn-outline-warning"><i className="me-1 fa-regular fa-face-sad-tear"></i>Từ chối</button>
                <button className="me-1 mt-1 btn btn-outline-danger"><i className="me-1 fa-solid fa-trash"></i>Xóa</button>
                {!isEditContent && <button className="mt-1 btn btn-outline-secondary" onClick={() => setIsEditContent(!isEditContent)}><i className="me-1 fa-regular fa-pen-to-square"></i>Edit</button>}
                {isEditContent && <button className="mt-1 btn btn-danger" onClick={handleCancelUpdate}>Hủy<i className="ms-1 fa-regular fa-circle-xmark"></i></button>}

            </div>

        </div>
    )
}