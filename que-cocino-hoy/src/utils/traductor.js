// src/utils/traductor.js
export const traducirTexto = async (texto, targetLang = 'es') => {
  try {
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: texto,
        source: 'en',
        target: targetLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
      
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error al traducir:', error);
    return texto;
  }


};
