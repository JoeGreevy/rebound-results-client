import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router'
import { cohorts } from '../assets/cohorts';

interface NavProps {
    selectedId: string;
    cohortMask: number[];
    setCohortMask: (mask: number[]) => void;
}

function NavBar({selectedId, cohortMask, setCohortMask}: NavProps) {

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
        {/* Cohort Filtering */}
        <form className="radio-group">
        {cohorts.labels.map((label, index) => (
            <label key={index}>
                <input type="checkbox" value = {cohorts["labels"][index]} checked={cohortMask[index] === 1}
                onChange={() => {
                    const newMask = [...cohortMask];
                    newMask[index] = 1 - cohortMask[index];
                    setCohortMask(newMask);
                    console.log("Cohort Mask: ", newMask);
                }} />{label}
            </label>
        ))}
        </form>
        </>
    )
}

export default NavBar;