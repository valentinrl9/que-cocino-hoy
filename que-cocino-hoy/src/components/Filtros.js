function Filtros({ categorias, categoriaSeleccionada, setCategoriaSeleccionada, buscarPorCategoria }) {
  return (
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
  );
}

export default Filtros;
