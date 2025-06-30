
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

interface LayoutProps {
    selectedId: string;
    cohortMask: number[];
    setCohortMask: (mask: number[]) => void;
}

function Layout({ selectedId, cohortMask, setCohortMask }:LayoutProps) {


    return (
        <>
            <header>
                <NavBar selectedId={selectedId} cohortMask={ cohortMask } setCohortMask = { setCohortMask } />
            </header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </>
    )
}

export default Layout;