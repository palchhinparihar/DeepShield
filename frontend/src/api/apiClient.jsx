// src/api/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";

export const apiClient = async (endpoint, form) => {
  try {
    const isForm = form instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: isForm ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json',
      },
      body: isForm ? form : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'API Error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
