// Utility functions for making authenticated API requests

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const { headers, ...restOptions } = options;
  
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...getAuthHeaders(),
      ...headers,
    },
  });

  return response;
};

// Convenience methods for common HTTP verbs
export const apiGet = (url: string, options: RequestInit = {}) => {
  return apiRequest(url, { ...options, method: 'GET' });
};

export const apiPost = (url: string, body: unknown, options: RequestInit = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const apiPut = (url: string, body: unknown, options: RequestInit = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const apiDelete = (url: string, options: RequestInit = {}) => {
  return apiRequest(url, { ...options, method: 'DELETE' });
};
