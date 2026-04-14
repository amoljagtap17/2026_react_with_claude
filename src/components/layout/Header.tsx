import { NavLink } from "react-router";

export function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
}
