function Favoritas({ favoritas, eliminarFavorita }) {
  return (
    <>
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
    </>
  );
}

export default Favoritas;
