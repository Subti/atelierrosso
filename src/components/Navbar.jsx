import "../css/Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        <img src="/images/Atelier_Rosso_SignBoard-cropped.svg" alt="" />
      </a>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a href="/about" className="nav-link">
            About
          </a>
        </li>
        <li className="nav-item">
          <a href="/contact" className="nav-link">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}