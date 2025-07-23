import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleReceta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarReceta = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        setReceta(data.meals[0]);
      } catch (err) {
        setError('No se pudo cargar la receta.');
      }
    };
    cargarReceta();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!receta) return <p className="cargando">Cargando receta...</p>;

  return (
    <div className="detalle-receta">
      <button
        className="cerrar-detalle"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        title="Cerrar"
      >
        ✖
      </button>

      <h2>{receta.strMeal}</h2>
      <img src={receta.strMealThumb} alt={receta.strMeal} />
      <p><strong>Categoría:</strong> {receta.strCategory}</p>
      <p><strong>Área:</strong> {receta.strArea}</p>
      <p><strong>Instrucciones:</strong></p>
      <p>{receta.strInstructions}</p>
    </div>
  );
}

export default DetalleReceta;
