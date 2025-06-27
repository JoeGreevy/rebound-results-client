import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router'

interface NavProps {
    selectedId?: string;
}

function NavBar({selectedId}: NavProps) {

    const location = useLocation();
    const root = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
    const end = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
    

    return (
        <>
        <nav>
            <NavLink className={root === "/subjects" ? "active" : " "} to="/subjects/graph">All Subjects</NavLink> |{' '}
            <NavLink className={root !== "/subjects" ? "active" : " "} to={`/subjects/${selectedId}/table`}>Individual Subjects</NavLink>
        </nav>
        <nav>
            <NavLink className={end === "graph" ? "active" : " "} to={`${root}/graph`}>Graph</NavLink> |{' '}
            <NavLink className={end === "table" ? "active" : " "} to={`${root}/table`}>Table</NavLink>
        </nav>
        </>
    )
}

export default NavBar;