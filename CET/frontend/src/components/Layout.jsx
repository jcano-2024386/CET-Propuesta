import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
