import React, { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import RecetaCard from '../components/RecetaCard';
import { useNavigate } from 'react-router-dom';
import ingredientesTraducidos from '../utils/ingredientesTraducidos.json';
import { distance } from 'fastest-levenshtein';
import '../App.css';
import { traducirTexto } from '../utils/traductor';

function Home() {
  const [ingredientes, setIngredientes] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
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

  const traducirNombresRecetas = async (recetasOriginales) => {
    // Renderiza nombres originales primero
    setRecetas(recetasOriginales);

    // Traduce en segundo plano y actualiza
    try {
      const recetasTraducidas = await Promise.all(
        recetasOriginales.map(async (receta) => {
          try {
            const nombreTraducido = await traducirTexto(receta.strMeal);
            return {
              ...receta,
              strMeal: nombreTraducido || receta.strMeal
            };
          } catch {
            return receta;
          }
        })
      );
      setRecetas(recetasTraducidas);
    } catch (error) {
      console.warn('Error al traducir recetas:', error);
    }
  };

  const quitarAcentos = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const traducirIngredienteLocal = (texto) => {
    const normalizado = quitarAcentos(texto.toLowerCase().trim());
    const entrada = ingredientesTraducidos.find(i =>
      quitarAcentos(i.es.toLowerCase()) === normalizado
    );
    return entrada ? entrada.en : normalizado;
  };

  const sugerirIngredientes = (texto) => {
    const normalizado = quitarAcentos(texto.toLowerCase().trim());

    const similares = ingredientesTraducidos
      .map(i => ({
        es: i.es,
        en: i.en,
        score: distance(normalizado, quitarAcentos(i.es.toLowerCase()))
      }))
      .sort((a, b) => a.score - b.score)
      .filter(i => i.score <= 3);

    return similares.slice(0, 5);
  };

  const buscarRecetas = async () => {
    if (!ingredientes.trim()) {
      setError('Por favor, introduce al menos un ingrediente.');
      setRecetas([]);
      return;
    }

    try {
      const ingredienteEs = ingredientes.split(',')[0].trim();
      const traducido = traducirIngredienteLocal(ingredienteEs);

      if (!traducido || traducido === ingredienteEs) {
        const sugerencias = sugerirIngredientes(ingredienteEs);
        setError(sugerencias.length > 0 ? 'Ingrediente no encontrado.' : `No se encontró el ingrediente "${ingredienteEs}".`);
        setSugerencias(sugerencias.map(s => s.es));
        setRecetas([]);
        return;
      }

      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(traducido)}`);
      const data = await response.json();

      if (data.meals) {
        await traducirNombresRecetas(data.meals);
        setError(null);
      } else {
        setRecetas([]);
        setError('No se encontraron recetas con ese ingrediente.');
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
      await traducirNombresRecetas(data.meals || []);
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
    if (!favoritas.some(fav => fav.idMeal === receta.idMeal)) {
      setFavoritas([...favoritas, receta]);
    }
  };

  const eliminarFavorita = (id) => {
    setFavoritas(favoritas.filter(receta => receta.idMeal !== id));
  };

  
  return (
    <div className="home-container">
      
      <section className="hero">
        <img src="/img/hero.png" alt="¿Qué cocino hoy?" className="hero-img" />
      </section>


      <section className="busqueda-section">
        <Buscador
          ingredientes={ingredientes}
          setIngredientes={setIngredientes}
          buscarRecetas={buscarRecetas}
          buscarAleatoria={buscarAleatoria}
        />
        <div className="filtros">
          <label htmlFor="categoria-select" className="filtros-label">
             Buscar por categoría:
          </label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setCategoriaSeleccionada(selectedValue);
              buscarPorCategoria(selectedValue);
            }}
          >
            <option value="">-- Categoría --</option>
            {categoriasEspañol.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error">{error}</p>}

{sugerencias.length > 0 && (
  <div className="sugerencias">
    <p>
      <strong>¿Querías decir:</strong>{' '}
      {sugerencias
        .map((sugerida) => (
          <a
            key={sugerida}
            className="sugerencia-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIngredientes(sugerida);
              setSugerencias([]);     // 👈 Limpia las sugerencias
              setError(null);         // (Opcional) Limpia el mensaje de error
              buscarRecetas(sugerida); // Ejecuta búsqueda directa
            }}
          >
            {sugerida}
          </a>
        ))
        .reduce((prev, curr) => [prev, ', ', curr])}
      ?
    </p>
  </div>
)}




      </section>

      <section className="recetas-section">
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
      </section>
    </div>
  );
}

export default Home;
