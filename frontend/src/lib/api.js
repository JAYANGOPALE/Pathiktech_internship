import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 20000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for unified error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

/**
 * Upload a pronunciation dictionary JSON file.
 * @param {File} file - The JSON file to upload
 * @returns {Promise<{ dictionary_id: string }>}
 */
export async function uploadDictionary(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/dictionary', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export default api;
