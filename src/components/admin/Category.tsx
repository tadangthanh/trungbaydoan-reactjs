import { useEffect, useRef, useState } from "react";
import { Category } from "../../model/Category";
import { toast, ToastContainer } from "react-toastify";
import { createCategory, deleteCategory, getAllCategory } from "../../api/categoryAPI/CategoryAPI";
import 'reactjs-popup/dist/index.css';
import { Loading } from "../common/LoadingSpinner";
export const CategoryAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAllCategory().then(res => {
            if (res.status === 200) {
                setCategories(res.data);
            } else {
                toast.error(res.message, { containerId: 'category' })
            }
            setLoading(false);
        });
    }, []);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleAddCategory = () => {
        setLoading(true);
        const category = { id: 0, name: name, createdDate: new Date(), lastModifiedDate: new Date(), createdBy: '', lastModifiedBy: '' }
        createCategory(category).then(res => {
            if (res.status === 201) {
                toast.success(res.message, { containerId: 'category' });
                setCategories([...categories, res.data]);
            } else {
                toast.error(res.message, { containerId: 'category' });
            }
            setLoading(false);
            setName('');
            inputRef.current?.focus();
        })
    }
    const handleDeleteCategory = (id: number) => {
        const result = window.confirm("Bạn có chắc chắn muốn xóa ?");
        if (result) {
            setLoading(true);
            deleteCategory(id).then(res => {
                if (res.status === 204) {
                    toast.success(res.message, { containerId: 'category' });
                    const newCategories = categories.filter(c => c.id !== id);
                    setCategories(newCategories);
                } else {
                    toast.error(res.message, { containerId: 'category' })
                }
                setLoading(false)
            }
            )
        }
    }
    return (
        <div className="content container">
            <Loading loading={loading} />
            <ToastContainer containerId='category' />
            <h2>Thể loại</h2>
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