function Buscador({ ingredientes, setIngredientes, buscarRecetas, buscarAleatoria }) {
  return (
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
  );
}

export default Buscador;
