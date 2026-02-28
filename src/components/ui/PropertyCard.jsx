import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../data/properties";
import "./PropertyCard.css";
export default function PropertyCard({ property }) {
  const { id, title, type, price, neighborhood, city, state, bedrooms, bathrooms, parkingSpots, area, images, isNew } = property;
  return (
    <Link to={`/imovel/${id}`} className="prop-card">
      <div className="prop-card__image-wrap">
        <img src={images[0]} alt={title} className="prop-card__image" loading="lazy" />
        <div className="prop-card__badges">
          <span className={`badge badge-${type === "sale" ? "sale" : "rent"}`}>{type === "sale" ? "Venda" : "Aluguel"}</span>
          {isNew && <span className="badge badge-new">Novo</span>}
        </div>
        <div className="prop-card__overlay" />
      </div>
      <div className="prop-card__body">
        <p className="prop-card__price">{formatPrice(price, type)}</p>
        <h3 className="prop-card__title">{title}</h3>
        <p className="prop-card__address">{neighborhood} - {city}, {state}</p>
        <div className="prop-card__meta">
          <span>Quartos: {bedrooms}</span>
          <span>Banheiros: {bathrooms}</span>
          <span>Vagas: {parkingSpots}</span>
          <span>{area} m2</span>
        </div>
      </div>
    </Link>
  );
}
