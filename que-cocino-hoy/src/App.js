import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ingredientes, setIngredientes] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [favoritas, setFavoritas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);

  // Cargar favoritas desde localStorage
  useEffect(() => {
    const guardadas = localStorage.getItem('favoritas');
    if (guardadas) {
      setFavoritas(JSON.parse(guardadas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoritas', JSON.stringify(favoritas));
  }, [favoritas]);

  // Cargar categorías desde la API
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();
        setCategorias(data.meals.map((cat) => cat.strCategory));
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
      setRecetaSeleccionada(null);
      return;
    }

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientes}`
      );
      const data = await response.json();

      if (data.meals) {
        setRecetas(data.meals || []);
        setRecetaSeleccionada(null);
        setError(null);
      } else {
        setRecetas([]);
        setRecetaSeleccionada(null);
        setError('No se encontraron recetas con esos ingredientes.');
      }
    } catch (err) {
      setError('Hubo un problema al buscar recetas.');
      setRecetas([]);
      setRecetaSeleccionada(null);
    }
  };

  const buscarPorCategoria = async (categoria) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
      );
      const data = await response.json();
      setRecetas(data.meals || []);
      setRecetaSeleccionada(null);
      setError(null);
    } catch (err) {
      setError('Hubo un problema al buscar por categoría.');
      setRecetas([]);
      setRecetaSeleccionada(null);
    }
  };

  const verDetalles = async (id) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      setRecetaSeleccionada(data.meals[0]);
    } catch (err) {
      setError('No se pudo cargar la receta.');
    }
  };

  const buscarAleatoria = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
      const data = await response.json();
      setRecetas([data.meals[0]]);
      setRecetaSeleccionada(null);
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


    
    <div className="App">

      <div className="hero">
        <h1>¿Qué cocino hoy?</h1>
        <p>Descubre recetas deliciosas según lo que tienes en casa</p>
        <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Chef icon" />
      </div>


      <h1>¿Qué cocino hoy?</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Ej: pollo, arroz"
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
        />
        <button onClick={buscarRecetas}>Buscar recetas</button>
        <button onClick={buscarAleatoria}>¡Sorpréndeme!</button>
      </div>

      <div className="filtros">
        <label htmlFor="categoria">Filtrar por categoría:</label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            buscarPorCategoria(e.target.value);
          }}
        >
          <option value="">-- Selecciona una categoría --</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="recetas">
        {recetas.map((receta) => (
          <div
            key={receta.idMeal}
            className="receta"
            onClick={() => verDetalles(receta.idMeal)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{receta.strMeal}</h3>
            <img src={receta.strMealThumb} alt={receta.strMeal} />
            <button onClick={(e) => {
              e.stopPropagation();
              agregarFavorita(receta);
            }}>
              ⭐ Guardar favorita
            </button>
          </div>
        ))}
      </div>

      {recetaSeleccionada && (
        <div className="detalle-receta">
          <h2>{recetaSeleccionada.strMeal}</h2>
          <img src={recetaSeleccionada.strMealThumb} alt={recetaSeleccionada.strMeal} />
          <p><strong>Categoría:</strong> {recetaSeleccionada.strCategory}</p>
          <p><strong>Área:</strong> {recetaSeleccionada.strArea}</p>
          <p><strong>Instrucciones:</strong></p>
          <p>{recetaSeleccionada.strInstructions}</p>
        </div>
      )}

      <h2>⭐ Mis recetas favoritas</h2>
      <div className="recetas">
        {favoritas.map((receta) => (
          <div key={receta.idMeal} className="receta">
            <h3>{receta.strMeal}</h3>
            <img src={receta.strMealThumb} alt={receta.strMeal} />
            <button onClick={() => eliminarFavorita(receta.idMeal)}>❌ Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
