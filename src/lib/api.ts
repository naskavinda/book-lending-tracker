// Utility functions for making authenticated API requests

// Utility functions for making authenticated API requests

const waitForAuth = () => {
  return new Promise<string | null>((resolve) => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      resolve(token);
      return;
    }
    
    // If no token, wait a bit and check again (in case auth is still loading)
    setTimeout(() => {
      const retryToken = localStorage.getItem('token');
      resolve(retryToken);
    }, 100);
  });
};

const getAuthHeaders = async () => {
  const token = await waitForAuth();
  console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const { headers, ...restOptions } = options;
  
  const authHeaders = await getAuthHeaders();
  console.log('Making API request to:', url, 'with headers:', authHeaders);
  
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...authHeaders,
      ...headers,
    },
  });

  console.log('API response status:', response.status);
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
