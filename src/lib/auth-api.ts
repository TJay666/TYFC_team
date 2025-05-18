// src/lib/auth-api.ts

const API_BASE_URL = 'https://8000-firebase-studio-1747234445739.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev'; // Your Django backend URL

// Defines the structure for the response from the token obtain API
interface TokenObtainPairResponse {
  access: string;
  refresh: string;
}

// Defines the structure for user registration data
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Defines the structure for the response from the registration API
interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  role: string; // Assuming the backend returns the role as a string
}

// Calls the backend registration API
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Handle non-2xx responses, including validation errors
    const errorData = await response.json();
    throw new Error(errorData.detail || response.statusText);
  }

  return response.json();
};

// Calls the backend token obtain API (login)
export const loginUser = async (username: string, password: string): Promise<TokenObtainPairResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    // Handle non-2xx responses, e.g., invalid credentials
     const errorData = await response.json();
    throw new Error(errorData.detail || response.statusText);
  }

  return response.json();
};

// You might add other auth-related API calls here, like token refresh, logout, etc.

// Example of a protected API call function (requires access token)
export const fetchProtectedData = async (accessToken: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/some/protected/api/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`, // Include the access token
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle non-2xx responses, e.g., 401 Unauthorized if token is invalid/expired
     const errorData = await response.json();
    throw new Error(errorData.detail || response.statusText);
  }

  return response.json();
};
