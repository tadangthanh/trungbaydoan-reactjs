export const AdminNavbar: React.FC = () => {
    return (
        <nav>
            <div className="navbar">
                <div className="logo">
                    <img src="/pic/logo.jpg" alt="" />
                    <h1>jobs</h1>
                </div>
                <ul>
                    <li><a href="#">
                        <i className="fas fa-user"></i>
                        <span className="nav-item">Dashboard</span>
                    </a>
                    </li>
                    <li><a href="#">
                        <i className="fas fa-chart-bar"></i>
                        <span className="nav-item">Analytics</span>
                    </a>
                    </li>
                    <li><a href="#">
                        <i className="fas fa-tasks"></i>
                        <span className="nav-item">Jobs Board</span>
                    </a>
                    </li>
                    <li><a href="#">
                        <i className="fab fa-dochub"></i>
                        <span className="nav-item">Documnents</span>
                    </a>
                    </li>
                    <li><a href="#">
                        <i className="fas fa-cog"></i>
                        <span className="nav-item">Setting</span>
                    </a>
                    </li>
                    <li><a href="#">
                        <i className="fas fa-question-circle"></i>
                        <span className="nav-item">Help</span>
                    </a>
                    </li>
                    <li><a href="#" className="logout">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="nav-item">Logout</span>
                    </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}