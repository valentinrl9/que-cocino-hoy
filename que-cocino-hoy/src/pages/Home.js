import React, { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';
import RecetaCard from '../components/RecetaCard';
import Favoritas from '../components/Favoritas';

function Home() {
  const [ingredientes, setIngredientes] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const guardadas = localStorage.getItem('favoritas');
    if (guardadas) setFavoritas(JSON.parse(guardadas));
  }, []);

  useEffect(() => {
    localStorage.setItem('favoritas', JSON.stringify(favoritas));
  }, [favoritas]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();
        const categoriasExtraidas = data.meals.map((cat) => cat.strCategory);
        setCategorias(categoriasExtraidas);
      } catch (err) {
        console.error('Error al cargar categorías');
      }
    };
    cargarCategorias();
  }, []);

  const buscarRecetas = async () => {
    if (!ingredientes.trim()) {
      setError('Por favor, introduce al menos un ingrediente.');
      setRecetas([]);
      return;
    }

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredientes)}`);
      const data = await response.json();
      if (data.meals) {
        setRecetas(data.meals);
        setError(null);
      } else {
        setRecetas([]);
        setError('No se encontraron recetas con esos ingredientes.');
      }
    } catch (err) {
      setError('Hubo un problema al buscar recetas.');
      setRecetas([]);
    }
  };

  const buscarPorCategoria = async (categoria) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
      const data = await response.json();
      setRecetas(data.meals || []);
      setError(null);
    } catch (err) {
      setError('Hubo un problema al buscar por categoría.');
      setRecetas([]);
    }
  };

  const buscarAleatoria = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
      const data = await response.json();
      setRecetas(data.meals);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar la receta aleatoria.');
    }
  };

  const agregarFavorita = (receta) => {
    if (!favoritas.some((fav) => fav.idMeal === receta.idMeal)) {
      setFavoritas([...favoritas, receta]);
    }
  };

  const eliminarFavorita = (id) => {
    setFavoritas(favoritas.filter((receta) => receta.idMeal !== id));
  };

  return (
    <>
      <div className="hero">
        <div className="hero-texto">
          <h1>¿Qué cocino hoy?</h1>
          <p>Descubre recetas deliciosas según lo que tienes en casa</p>
        </div>
        <div className="buscador">
          <Buscador
            ingredientes={ingredientes}
            setIngredientes={setIngredientes}
            buscarRecetas={buscarRecetas}
            buscarAleatoria={buscarAleatoria}
          />
        </div>
      </div>

      <Filtros
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        buscarPorCategoria={buscarPorCategoria}
      />

      {error && <p className="error">{error}</p>}

      <div className="recetas">
        {recetas.map((receta) => (
          <RecetaCard
            key={receta.idMeal}
            receta={receta}
            agregarFavorita={agregarFavorita}
          />
        ))}
      </div>

      <Favoritas favoritas={favoritas} eliminarFavorita={eliminarFavorita} />
    </>
  );
}

export default Home;
