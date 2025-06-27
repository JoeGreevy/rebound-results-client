
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

interface LayoutProps {
    selectedId?: string;
}

function Layout({ selectedId }:LayoutProps) {


    return (
        <>
            <header>
                <NavBar selectedId={selectedId} />
            </header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </>
    )
}

export default Layout;