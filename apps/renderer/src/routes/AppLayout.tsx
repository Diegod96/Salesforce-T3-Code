import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link active" : "nav-link";

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Salesforce T3 Code</div>
        <nav className="nav">
          <NavLink to="/projects" className={navClass} end={false}>
            Projects
          </NavLink>
          <NavLink to="/orgs" className={navClass}>
            Orgs
          </NavLink>
          <NavLink to="/tasks" className={navClass}>
            Tasks
          </NavLink>
          <NavLink to="/review" className={navClass}>
            Review
          </NavLink>
          <NavLink to="/logs" className={navClass}>
            Logs
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
