import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PROPERTIES, HISTORICAL_DATA, formatPrice } from "../data/properties";
import "./PropertyPage.css";

function PropertyMap({ lat, lng, title, address }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15);
    instanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div class="map-marker"><div class="map-marker__pin"></div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br/>${address}`)
      .openPopup();

    return () => {
      map.remove();
      instanceRef.current = null;
    };
  }, [lat, lng, title, address]);

  return <div ref={mapRef} className="property-map" />;
}

export default function PropertyPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const property = PROPERTIES.find(p => p.id === Number(id));
  const [imgIdx, setImgIdx] = useState(0);
  const [chartTab, setChartTab] = useState("priceM2");

  if (!property) return (
    <div className="prop-notfound">
      <h2>Imovel nao encontrado</h2>
      <button onClick={() => navigate("/imoveis")}>Voltar</button>
    </div>
  );

  const hist = HISTORICAL_DATA[property.neighborhood] || null;
  const {title,type,price,address,neighborhood,city,state,bedrooms,bathrooms,parkingSpots,area,floor,yearBuilt,description,highlights,images,pricePerM2,isNew,agent,lat,lng} = property;
  const fmt = v => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(v);
  const chartData = hist ? hist[chartTab].map(d => ({year:d.year, value:d.value, ref:Math.round(d.value*0.88)})) : [];

  return (
    <div className="prop-page page-enter">
      <div className="prop-page__breadcrumb container">
        <button onClick={() => navigate(-1)}>Voltar</button>
        <span> / </span><span>{neighborhood}</span><span> / </span>
        <span className="prop-page__breadcrumb-title">{title}</span>
      </div>
      <div className="container prop-page__layout">
        <div className="prop-page__left">

          {/* Galeria */}
          <div className="gallery">
            <div className="gallery__main">
              <img src={images[imgIdx]} alt={title} className="gallery__main-img" />
              <div className="gallery__badges">
                <span className={`badge badge-${type==="sale"?"sale":"rent"}`}>{type==="sale"?"Venda":"Aluguel"}</span>
                {isNew && <span className="badge badge-new">Novo</span>}
              </div>
            </div>
            {images.length > 1 && (
              <div className="gallery__thumbs">
                {images.map((img,i) => (
                  <button key={i} className={`gallery__thumb ${i===imgIdx?"active":""}`} onClick={() => setImgIdx(i)}>
                    <img src={img} alt={`Foto ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Descricao */}
          <div className="prop-section">
            <h2 className="prop-section__title">Sobre o imovel</h2>
            <p className="prop-section__text">{description}</p>
          </div>

          {/* Diferenciais */}
          <div className="prop-section">
            <h2 className="prop-section__title">Diferenciais</h2>
            <div className="highlights">
              {highlights.map(h => <span key={h} className="highlight-tag">{h}</span>)}
            </div>
          </div>

          {/* MAPA */}
          <div className="prop-section">
            <h2 className="prop-section__title">Localizacao</h2>
            <p className="prop-section__sub">{address} — {neighborhood}, {city}, {state}</p>
            <PropertyMap lat={lat} lng={lng} title={title} address={address} />
          </div>

          {/* Historico de Mercado */}
          {hist && (
            <div className="prop-section market-stats">
              <h2 className="prop-section__title">Historico de Mercado - {neighborhood}</h2>
              <p className="prop-section__sub">Serie historica dos ultimos 6 anos.</p>
              <div className="stat-kpis">
                <div className="stat-kpi"><span className="stat-kpi__value">{fmt(hist.priceM2[hist.priceM2.length-1].value)}/m2</span><span className="stat-kpi__label">Preco medio/m2</span></div>
                <div className="stat-kpi"><span className="stat-kpi__value stat-kpi__value--up">+{hist.appreciation}%</span><span className="stat-kpi__label">Valorizacao 6 anos</span></div>
                <div className="stat-kpi"><span className="stat-kpi__value">{hist.avgDaysOnMarket} dias</span><span className="stat-kpi__label">Tempo no mercado</span></div>
                <div className="stat-kpi"><span className="stat-kpi__value">{hist.soldLast12Months}</span><span className="stat-kpi__label">Vendas 12 meses</span></div>
              </div>
              <div className="chart-tabs">
                <button className={`chart-tab ${chartTab==="priceM2"?"active":""}`} onClick={() => setChartTab("priceM2")}>Preco Venda /m2</button>
                <button className={`chart-tab ${chartTab==="rentM2"?"active":""}`} onClick={() => setChartTab("rentM2")}>Aluguel /m2</button>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{top:8,right:16,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eeecea"/>
                    <XAxis dataKey="year" tick={{fontSize:12}}/>
                    <YAxis tickFormatter={v => new Intl.NumberFormat("pt-BR",{notation:"compact"}).format(v)} tick={{fontSize:12}} width={60}/>
                    <Tooltip formatter={(v,n) => [fmt(v), n==="value"?neighborhood:"Media Cidade"]}/>
                    <Legend formatter={v => v==="value"?neighborhood:"Media da Cidade"}/>
                    <Line type="monotone" dataKey="value" stroke="#c9973a" strokeWidth={2.5} dot={{r:4}} activeDot={{r:6}}/>
                    <Line type="monotone" dataKey="ref" stroke="#9e9a90" strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <h3 className="chart-subtitle">Anuncios vs Vendas</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[2019,2020,2021,2022,2023,2024].map((y,i) => ({
                      year: String(y),
                      anuncios: Math.round(hist.totalListings*(0.75+i*0.05)),
                      vendas: Math.round(hist.soldLast12Months*(0.75+i*0.05))
                    }))}
                    margin={{top:8,right:16,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eeecea"/>
                    <XAxis dataKey="year" tick={{fontSize:12}}/>
                    <YAxis tick={{fontSize:12}} width={40}/>
                    <Tooltip/><Legend/>
                    <Bar dataKey="anuncios" fill="#1a3558" radius={[4,4,0,0]}/>
                    <Bar dataKey="vendas" fill="#c9973a" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="prop-page__right">
          <div className="prop-sidebar-card">
            <p className="prop-sidebar__price">{formatPrice(price,type)}</p>
            <p className="prop-sidebar__addr">{address}</p>
            <p className="prop-sidebar__location">{neighborhood} - {city}, {state}</p>
            <p className="prop-sidebar__m2">{fmt(pricePerM2)}/m2</p>
            <div className="prop-sidebar__specs">
              <div className="prop-sidebar__spec"><span>Quartos</span><span>{bedrooms}</span></div>
              <div className="prop-sidebar__spec"><span>Banheiros</span><span>{bathrooms}</span></div>
              <div className="prop-sidebar__spec"><span>Vagas</span><span>{parkingSpots}</span></div>
              <div className="prop-sidebar__spec"><span>Area util</span><span>{area} m2</span></div>
              <div className="prop-sidebar__spec"><span>Andar</span><span>{floor>0?`${floor}o`:"Terreo"}</span></div>
              <div className="prop-sidebar__spec"><span>Ano</span><span>{yearBuilt}</span></div>
            </div>
            <button className="prop-sidebar__cta">Agendar Visita</button>
            <button className="prop-sidebar__cta prop-sidebar__cta--outline">Simular Financiamento</button>
          </div>
          <div className="prop-sidebar-card prop-agent">
            <img src={agent.photo} alt={agent.name} className="prop-agent__photo"/>
            <div>
              <p className="prop-agent__name">{agent.name}</p>
              <p className="prop-agent__label">Corretor Responsavel</p>
              <p className="prop-agent__phone">{agent.phone}</p>
            </div>
            <button className="prop-agent__btn">Contatar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
