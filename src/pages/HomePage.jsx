import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROPERTIES, CITY_STATS } from "../data/properties";
import PropertyCard from "../components/ui/PropertyCard";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("sale");
  const featured = PROPERTIES.filter(p => p.isFeatured).slice(0, 3);
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/imoveis?type=${tab}&q=${encodeURIComponent(query)}`);
  };
  return (
    <div className="home page-enter">
      <section className="hero">
        <div className="hero__bg">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80" alt="Cidade" className="hero__bg-img" />
          <div className="hero__bg-overlay" />
        </div>
        <div className="hero__content container">
          <p className="hero__eyebrow">Inteligencia de mercado + tecnologia</p>
          <h1 className="hero__headline">Encontre<br/>seu proximo<br/><em>imovel ideal</em></h1>
          <div className="search-box">
            <div className="search-box__tabs">
              {["sale","rent"].map(t => (
                <button key={t} className={`search-box__tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                  {t==="sale"?"Comprar":"Alugar"}
                </button>
              ))}
            </div>
            <form className="search-box__form" onSubmit={handleSearch}>
              <input type="text" placeholder="Bairro, cidade ou CEP..." value={query} onChange={e=>setQuery(e.target.value)} className="search-box__input" />
              <button type="submit" className="search-box__btn">Buscar</button>
            </form>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><strong>48.5k+</strong><span>Imoveis</span></div>
            <div className="hero__stat-div" />
            <div className="hero__stat"><strong>12k+</strong><span>Vendas/ano</span></div>
            <div className="hero__stat-div" />
            <div className="hero__stat"><strong>98%</strong><span>Satisfacao</span></div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section__header">
          <div><p className="section__eyebrow">Selecao Exclusiva</p><h2 className="section__title">Imoveis em Destaque</h2></div>
          <button className="section__link" onClick={()=>navigate("/imoveis")}>Ver todos</button>
        </div>
        <div className="grid-3">{featured.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
      </section>
      <section className="market-section">
        <div className="container">
          <div className="section__header"><div><p className="section__eyebrow">Dados de Mercado</p><h2 className="section__title">Mercado por Cidade</h2></div></div>
          <div className="market-cards">
            {Object.entries(CITY_STATS).map(([city,stats])=>(
              <div key={city} className="market-card">
                <h3 className="market-card__city">{city}</h3>
                <div className="market-card__metrics">
                  <div className="market-card__metric"><span className="market-card__value">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(stats.avgPriceM2Sale)}/m2</span><span className="market-card__label">Preco medio venda</span></div>
                  <div className="market-card__metric"><span className="market-card__value">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(stats.avgPriceM2Rent)}/m2</span><span className="market-card__label">Aluguel medio</span></div>
                  <div className="market-card__metric"><span className="market-card__value market-card__value--up">+{stats.appreciation12m}%</span><span className="market-card__label">Valorizacao 12m</span></div>
                  <div className="market-card__metric"><span className="market-card__value">{stats.totalListings.toLocaleString("pt-BR")}</span><span className="market-card__label">Imoveis listados</span></div>
                </div>
                <button className="market-card__btn" onClick={()=>navigate("/imoveis")}>Ver imoveis em {city}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
