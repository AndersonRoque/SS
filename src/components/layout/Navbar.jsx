import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const cls = `navbar ${isHome && !scrolled ? "navbar--transparent" : "navbar--solid"}`;
  return (
    <header className={cls}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-ss">SS</span>
          <span className="navbar__logo-text">Real Estate</span>
        </Link>
        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          <Link to="/" className="navbar__link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/imoveis" className="navbar__link" onClick={() => setMenuOpen(false)}>Comprar</Link>
          <Link to="/imoveis?type=rent" className="navbar__link" onClick={() => setMenuOpen(false)}>Alugar</Link>
          <Link to="/imoveis" className="navbar__link" onClick={() => setMenuOpen(false)}>Vender</Link>
        </nav>
        <div className="navbar__actions">
          <button className="navbar__btn-outline">Entrar</button>
          <button className="navbar__btn-fill">Anunciar</button>
        </div>
        <button className="navbar__hamburger" onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
