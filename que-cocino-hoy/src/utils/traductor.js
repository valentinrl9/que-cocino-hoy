export const traducirTexto = async (texto, sourceLang = 'en', targetLang = 'es') => {
  if (!texto || texto.trim() === '') return '';

  const encodedText = encodeURIComponent(texto);
  const url = `https://lingva.lunar.icu/api/v1/${sourceLang}/${targetLang}/${encodedText}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.translation || texto; // Traducción o texto original como fallback

  } catch (error) {
    console.error('Error al traducir con Lingva:', error.message || error);
    return texto;
  }
};
