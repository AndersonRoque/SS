import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PROPERTIES } from "../data/properties";
import PropertyCard from "../components/ui/PropertyCard";
import "./ListingsPage.css";

const PRICE_SALE=[{label:"Qualquer preco",min:0,max:Infinity},{label:"Ate R$ 500k",min:0,max:500000},{label:"R$ 500k-1M",min:500000,max:1000000},{label:"R$ 1M-3M",min:1000000,max:3000000},{label:"Acima R$ 3M",min:3000000,max:Infinity}];
const PRICE_RENT=[{label:"Qualquer preco",min:0,max:Infinity},{label:"Ate R$ 2.000",min:0,max:2000},{label:"R$ 2k-5k",min:2000,max:5000},{label:"R$ 5k-10k",min:5000,max:10000},{label:"Acima R$ 10k",min:10000,max:Infinity}];

export default function ListingsPage() {
  const [sp] = useSearchParams();
  const [type,setType] = useState(sp.get("type") || "sale");
  const [query,setQuery] = useState(sp.get("q") || "");
  const [beds,setBeds] = useState("0");
  const [pi,setPi] = useState(0);
  const [sort,setSort] = useState("recent");

  // Correcao: atualiza os filtros quando a URL muda (ex: clicar Comprar/Alugar no menu)
  useEffect(() => {
    setType(sp.get("type") || "sale");
    setQuery(sp.get("q") || "");
    setPi(0);
  }, [sp]);

  const ranges = type === "sale" ? PRICE_SALE : PRICE_RENT;
  const {min:pMin, max:pMax} = ranges[pi] || ranges[0];

  const filtered = useMemo(() => {
    let list = PROPERTIES.filter(p => p.type === type);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.neighborhood.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
    }
    if (beds !== "0") list = list.filter(p => p.bedrooms >= parseInt(beds));
    list = list.filter(p => p.price >= pMin && p.price <= pMax);
    if (sort === "price-asc") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "area-desc") list = [...list].sort((a,b) => b.area - a.area);
    return list;
  }, [type, query, beds, pMin, pMax, sort]);

  return (
    <div className="listings-page page-enter">
      <div className="filter-bar">
        <div className="filter-bar__inner container">
          <div className="filter-tabs">
            {["sale","rent"].map(t => (
              <button key={t} className={`filter-tab ${type===t?"active":""}`} onClick={()=>{setType(t);setPi(0);}}>
                {t==="sale"?"Comprar":"Alugar"}
              </button>
            ))}
          </div>
          <div className="filter-search">
            <input type="text" placeholder="Bairro ou cidade..." value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <select value={beds} onChange={e=>setBeds(e.target.value)} className="filter-select">
            <option value="0">Quartos</option>
            <option value="1">1+ quartos</option>
            <option value="2">2+ quartos</option>
            <option value="3">3+ quartos</option>
            <option value="4">4+ quartos</option>
          </select>
          <select value={pi} onChange={e=>setPi(Number(e.target.value))} className="filter-select">
            {ranges.map((r,i)=><option key={i} value={i}>{r.label}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="filter-select">
            <option value="recent">Mais recentes</option>
            <option value="price-asc">Menor preco</option>
            <option value="price-desc">Maior preco</option>
            <option value="area-desc">Maior area</option>
          </select>
        </div>
      </div>
      <div className="container listings-results">
        <p className="listings-count"><strong>{filtered.length}</strong> imovel{filtered.length!==1?"is":""} encontrado{filtered.length!==1?"s":""}</p>
        {filtered.length === 0
          ? <div className="listings-empty"><p>Nenhum imovel encontrado. Ajuste os filtros.</p></div>
          : <div className="listings-grid">{filtered.map(p=><PropertyCard key={p.id} property={p}/>)}</div>
        }
      </div>
    </div>
  );
}
