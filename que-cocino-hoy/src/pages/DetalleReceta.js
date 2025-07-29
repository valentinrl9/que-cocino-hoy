import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { traducirTexto } from '../utils/traductor';
import { Player } from '@lottiefiles/react-lottie-player';

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
        const recetaOriginal = data.meals?.[0];

        if (!recetaOriginal) {
          setError('No se encontró la receta.');
          return;
        }

        const textos = [
          recetaOriginal.strMeal,
          recetaOriginal.strCategory,
          recetaOriginal.strArea,
          recetaOriginal.strInstructions,
        ];

        const traducciones = await Promise.all(textos.map(t => traducirTexto(t)));

        const recetaTraducida = {
          ...recetaOriginal,
          strMeal: traducciones[0] || recetaOriginal.strMeal,
          strCategory: traducciones[1] || recetaOriginal.strCategory,
          strArea: traducciones[2] || recetaOriginal.strArea,
          strInstructions: traducciones[3] || recetaOriginal.strInstructions,
        };

        setReceta(recetaTraducida);
      } catch (err) {
        console.error('Error cargando receta:', err);
        setError('No se pudo cargar la receta.');
      }
    };

    cargarReceta();
  }, [id]);

  if (error) return <p className="error">{error}</p>;

  if (!receta) {
    return (
      <div className="spinner-carga">
        <Player
          autoplay
          loop
          src="/img/Kitchen.json" // ✅ No uses process.env.PUBLIC_URL con Lottie
          style={{ height: '250px', width: '250px' }}
        />
        <p className="mensaje-carga">👨‍🍳 Oído cocina</p>
      </div>
    );
  }

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
