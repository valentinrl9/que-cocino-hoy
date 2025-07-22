import React, { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import RecetaCard from '../components/RecetaCard';
import Favoritas from '../components/Favoritas';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [ingredientes, setIngredientes] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categoriasEspañol = [
    { label: 'Acompañamiento', value: 'Side' },
    { label: 'Cabra', value: 'Goat' },
    { label: 'Cerdo', value: 'Pork' },
    { label: 'Cordero', value: 'Lamb' },
    { label: 'Desayuno', value: 'Breakfast' },
    { label: 'Entrante', value: 'Starter' },
    { label: 'Pasta', value: 'Pasta' },
    { label: 'Pollo', value: 'Chicken' },
    { label: 'Postre', value: 'Dessert' },
    { label: 'Mariscos', value: 'Seafood' },
    { label: 'Ternera', value: 'Beef' },
    { label: 'Vegano', value: 'Vegan' },
    { label: 'Vegetariano', value: 'Vegetarian' },
    { label: 'Miscelánea', value: 'Miscellaneous' }
  ];

  // ✅ Restaurar estado desde sessionStorage
  useEffect(() => {
    const busquedaGuardada = sessionStorage.getItem('busquedaActual');
    if (busquedaGuardada) {
      const { ingredientes, categoriaSeleccionada, recetas } = JSON.parse(busquedaGuardada);
      setIngredientes(ingredientes || '');
      setCategoriaSeleccionada(categoriaSeleccionada || '');
      setRecetas(recetas || []);
    }
  }, []);

  useEffect(() => {
    const guardadas = localStorage.getItem('favoritas');
    if (guardadas) setFavoritas(JSON.parse(guardadas));
  }, []);

  useEffect(() => {
    localStorage.setItem('favoritas', JSON.stringify(favoritas));
  }, [favoritas]);

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
      const receta = data.meals[0];
      setError(null);

      // 🚀 Guardar búsqueda actual antes de navegar
      sessionStorage.setItem('busquedaActual', JSON.stringify({
        ingredientes,
        categoriaSeleccionada,
        recetas
      }));

      navigate(`/receta/${receta.idMeal}`);
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

      {/* 🎯 Select con categorías en español */}
      <div className="filtros">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setCategoriaSeleccionada(selectedValue);
            buscarPorCategoria(selectedValue);
          }}
        >
          <option value="">-- Selecciona una categoría --</option>
          {categoriasEspañol.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="recetas">
        {recetas.map((receta) => (
          <RecetaCard
            key={receta.idMeal}
            receta={receta}
            agregarFavorita={agregarFavorita}
            ingredientes={ingredientes}
            categoriaSeleccionada={categoriaSeleccionada}
            recetas={recetas}
          />
        ))}
      </div>

      {/* <Favoritas favoritas={favoritas} eliminarFavorita={eliminarFavorita} /> */}
    </>
  );
}

export default Home;
