import { useEffect, useRef, useState } from "react";
import { ProjectDTO } from "../../model/ProjectDTO";
import { getAllProject } from "../../api/projectAPI/ProjectAPI";
import { PageResponse } from "../../model/PageResponse";
import { toast, ToastContainer } from "react-toastify";
import { ProjectHomePage } from "./ProjectHomePage";
import { Category } from "../../model/Category";
import { AcademyYearDTO } from "../../model/AcademyYearDTO";
import { getAllAcademyYear } from "../../api/AcademyAPI/AcademyYearAPI";
import { getAllCategory } from "../../api/categoryAPI/CategoryAPI";
export const HomePage: React.FC = () => {
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [page, setPage] = useState(1);
    const [direction, setDirection] = useState("DESC")
    const [size, setSize] = useState(10);
    const [categories, setCategories] = useState([] as Category[]);
    const [pageResponse, setPageResponse] = useState({} as PageResponse);
    const [categorySelected, setCategorySelected] = useState("");
    const [academyYears, setAcademyYears] = useState([] as AcademyYearDTO[]);
    const [academyYearSelected, setAcademyYearSelected] = useState("");
    const [mapParams, setMapParams] = useState(new Map<string, string>());
    useEffect(() => {
        handleGetAllProject();
        getAllCategory().then(res => {
            if (res.status === 200) {
                setCategories(res.data)
            }
        })
        getAllAcademyYear().then(res => {
            if (res.status === 200) {
                setAcademyYears(res.data)
            }
        })
        document.title = "Trang chủ";
    }, []);

    const handleGetAllProject = () => {
        getAllProject(page, size, "id", direction, mapParams).then(res => {
            if (res.status === 200) {
                setProjects(res.data.items);
                setPageResponse(res);
            }
        });
    }
    const handleChangeCategoryIdSelected = (categoryName: string) => {
        if (categoryName === "") {
            setCategorySelected("");
            handleRemoveKey("category");
        } else {
            setCategorySelected(categoryName);
            setMapParams(new Map(mapParams.set("category", categoryName)));
        }

    }
    useEffect(() => {
        handleGetAllProject();
    }, [mapParams, direction, size, page]);

    const handleSort = (direction: string) => {
        setDirection(direction);
    }
    const handleChangeAcademyYear = (e: any) => {
        if (e.target.value === "") {
            setAcademyYearSelected("");
            handleRemoveKey("academyYear");
        } else {
            setAcademyYearSelected(e.target.value);
            setMapParams(new Map(mapParams.set("academyYear", e.target.value)));
        }
    }
    const handleRemoveKey = (key: string) => {
        const newMap = new Map(mapParams);
        newMap.delete(key);
        setMapParams(newMap);
    }
    const searchRef = useRef<HTMLInputElement>(null);
    const handleSearch = (e: any) => {
        e.preventDefault();
        const search = searchRef.current?.value;
        if (search) {
            setMapParams(new Map(mapParams.set("search", search)));
        } else {
            handleRemoveKey("search");
        }
    }
    const handleChangeSearch = (e: any) => {
        const search = e.target.value;
        if (search?.trim() === "") {
            handleRemoveKey("search");
        }
    }
    return (
        <div>
            <ToastContainer containerId='home-page' />
            <header className="bg-dark py-5">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="text-center text-white">
                        <h1 className="display-4 fw-bolder">Shop in style</h1>
                        <p className="lead fw-normal text-white-50 mb-0">With this shop hompeage template</p>
                    </div>
                </div>
            </header>
            <div className="container">

                <nav className="navbar navbar-expand-lg navbar-light mt-2 ">
                    <div className="container-fluid">
                        <span className="navbar-brand">Chức năng</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarScroll">
                            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" >
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sắp xếp
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li ><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleSort("DESC") }} href="#">Mới nhất{direction === "DESC" && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>
                                            <li><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleSort("ASC") }} href="#">Cũ nhất{direction === "ASC" && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Khoá
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleChangeAcademyYear({ target: { value: "" } }) }} href="#">Tất cả{academyYearSelected === "" && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>
                                            {
                                                academyYears.map((academyYear, index) => <li key={index}><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleChangeAcademyYear({ target: { value: academyYear.number } }) }} href="#">{academyYear.number}{academyYearSelected === academyYear.number && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>)
                                            }
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Thể loại
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleChangeCategoryIdSelected("") }} href="#">Tất cả{categorySelected === "" && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>
                                            {
                                                categories.map((category, index) => <li key={index}><a className="dropdown-item" onClick={(e) => { e.preventDefault(); handleChangeCategoryIdSelected(category.name) }} href="#">{category.name}{categorySelected === category.name && <i className="text-success ms-5 fa-solid fa-check"></i>}</a></li>)
                                            }
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                            <form className="d-flex">
                                <input ref={searchRef} onChange={handleChangeSearch} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button onClick={handleSearch} className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
                <section className="py-5">
                    <div className="container px-4 px-lg-5 mt-5">
                        {
                            projects.map((project, index) => <ProjectHomePage handleChangeCategoryIdSelected={handleChangeCategoryIdSelected} key={index} project={project} />)
                        }
                    </div>
                    <nav aria-label="Page navigation example d-flex flex-column align-items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ul className="pagination">
                            {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(1)}>First</a></li>}
                            {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 1)}>Previous</a></li>}
                            {pageResponse?.data?.currentPage - 3 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 3)}>{pageResponse?.data?.currentPage - 3}</a></li>}
                            {pageResponse?.data?.currentPage - 2 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 2)}>{pageResponse?.data?.currentPage - 2}</a></li>}
                            {pageResponse?.data?.currentPage - 1 > 0 && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page - 1)}>{pageResponse?.data?.currentPage - 1}</a></li>}
                            <li className="page-item active"><a className="page-link" href="#">{pageResponse?.data?.currentPage}</a></li>
                            {pageResponse?.data?.hasNext && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 1)}>{pageResponse?.data?.currentPage + 1}</a></li>}
                            {pageResponse?.data?.currentPage + 2 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 2)}>{pageResponse?.data?.currentPage + 2}</a></li>}
                            {pageResponse?.data?.currentPage + 3 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 3)}>{pageResponse?.data?.currentPage + 3}</a></li>}
                            {pageResponse?.data?.currentPage + 1 <= pageResponse?.data?.totalPages && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(page + 1)}>Next</a></li>}
                            {pageResponse?.data?.hasNext && <li className="page-item"><a className="page-link" href="#" onClick={() => setPage(pageResponse?.data?.totalPages)}>Last</a></li>}
                        </ul>
                    </nav>
                </section>
            </div>
        </div>
    )
}