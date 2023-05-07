import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function NavBar() {
  return (
    // <header>
    //   <Link style={{ marginRight: '1.25rem' }} to='/'>
    //     boards
    //   </Link>
    // </header>
    <div>
      <Link style={{ marginRight: '1.25rem' }} to='/'>
        boards
      </Link>
    </div>
  )
}

export function NavBarLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
