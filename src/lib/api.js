import axios from 'axios';

// Instância axios partilhada que envia automaticamente o header x-api-key.
// A variável VITE_API_KEY é definida nas env vars do Vercel e no .env local.
const api = axios.create({
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY || '',
  },
});

export default api;
