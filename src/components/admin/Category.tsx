import { useEffect, useRef, useState } from "react";
import { Category } from "../../model/Category";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { createCategory, deleteCategory, getAllCategory } from "../../api/categoryAPI/CategoryAPI";
import 'reactjs-popup/dist/index.css';
export const CategoryAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>('');
    useEffect(() => {
        getAllCategory().then(res => {
            if (res.status === 200) {
                setCategories(res.data);
            } else {
                toast.error("Lỗi khi lấy category từ server");
            }
        });
    }, []);
    const notify = (message: string) => toast(
        message,
        {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
        }
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const handleAddCategory = () => {
        const category = { id: 0, name: name, createdDate: new Date(), lastModifiedDate: new Date(), createdBy: '', lastModifiedBy: '' }
        createCategory(category).then(res => {
            if (res.status === 201) {
                notify("Thêm category thành công");
                setCategories([...categories, res.data]);
            } else {
                toast.error("Lỗi khi thêm category");
            }
            setName('');
            inputRef.current?.focus();
        })
    }
    const handleDeleteCategory = (id: number) => {
        const result = window.confirm("Bạn có chắc chắn muốn xóa ?");
        if (result) {
            deleteCategory(id).then(res => {
                if (res.status === 204) {
                    notify("Xóa category thành công");
                    const newCategories = categories.filter(c => c.id !== id);
                    setCategories(newCategories);
                } else {
                    toast.error("Lỗi khi xóa category");
                }
            }
            )
        }
    }
    return (
        <div className="content container">
            <ToastContainer />
            <h2>Category</h2>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Danh sách thể loại
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                    {
                        categories.map((c, i) => {
                            return (
                                <li className="dropdown-item" key={c.id}>
                                    {c.name}
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteCategory(c.id)
                                    }} title="delete" className="text-danger" style={{ float: 'right', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-delete-left"></i>
                                    </span>
                                </li>)
                        })
                    }
                </ul>
            </div>
            <div className="input-group mb-3">
                <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="nhập tên thể loại thêm" aria-describedby="basic-addon2" />
                <button onClick={handleAddCategory} className="input-group-text" id="basic-addon2">Thêm</button>
            </div>
        </div>
    )
}