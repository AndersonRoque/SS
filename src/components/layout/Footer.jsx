import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-ss">SS</span>
            <span className="footer__logo-text">Real Estate</span>
          </div>
          <p className="footer__tagline">Encontre o imovel dos seus sonhos com dados e inteligencia de mercado.</p>
        </div>
        <div className="footer__links">
          <div className="footer__col"><h4>Explorar</h4><Link to="/imoveis">Comprar</Link><Link to="/imoveis?type=rent">Alugar</Link><Link to="/imoveis">Lancamentos</Link></div>
          <div className="footer__col"><h4>Mercado</h4><Link to="/imoveis">Estatisticas por Bairro</Link><Link to="/imoveis">Valorizacao</Link></div>
          <div className="footer__col"><h4>Empresa</h4><Link to="/">Sobre nos</Link><Link to="/">Contato</Link></div>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>2025 SS Real Estate. Projeto de estudo.</p>
      </div>
    </footer>
  );
}
