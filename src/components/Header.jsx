import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="header">
        <nav className="nav">
          <img
            src="../src/assets/petness-logo-icon.png"
            alt="Petness"
            className="logo"
          />
          <div className="nav--name">
            <Link to="/" className="m-10">
              Home
            </Link>
            <NavLink to="/about" className="m-10">
              About Us
            </NavLink>
            <NavLink to="/contact" className="m-10">
              Contact Us
            </NavLink>
          </div>
        </nav>
      </header>
    </>
  );
}
