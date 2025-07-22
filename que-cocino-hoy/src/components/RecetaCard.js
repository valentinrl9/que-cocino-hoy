import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RecetaCard({ receta, agregarFavorita, ingredientes, categoriaSeleccionada, recetas }) {
  const navigate = useNavigate();
  const location = useLocation();

const irADetalle = () => {
  sessionStorage.setItem('busquedaActual', JSON.stringify({
    ingredientes,
    categoriaSeleccionada,
    recetas
  }));

  navigate(`/receta/${receta.idMeal}`);
};

  return (
    <div className="receta" onClick={irADetalle} style={{ cursor: 'pointer' }}>
      <h3>{receta.strMeal}</h3>
      <img src={receta.strMealThumb} alt={receta.strMeal} />
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          agregarFavorita(receta);
        }}
      >
        ⭐ Guardar favorita
      </button> */}
    </div>
  );
}

export default RecetaCard;
