import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RecetaCard({ receta, agregarFavorita }) {
  const navigate = useNavigate();
  const location = useLocation();

  const irADetalle = () => {
    navigate(`/receta/${receta.idMeal}`, {
      state: {
        from: location.pathname,
      },
    });
  };

  return (
    <div className="receta" onClick={irADetalle} style={{ cursor: 'pointer' }}>
      <h3>{receta.strMeal}</h3>
      <img src={receta.strMealThumb} alt={receta.strMeal} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          agregarFavorita(receta);
        }}
      >
        ⭐ Guardar favorita
      </button>
    </div>
  );
}

export default RecetaCard;
