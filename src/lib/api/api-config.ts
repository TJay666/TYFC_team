// src/lib/api/api-config.ts

export const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Generic function for making API requests
export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getAuthHeaders(token);

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    // 處理 JSON 響應
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      
      return {
        data: response.ok ? responseData : undefined,
        error: response.ok ? undefined : responseData.detail || '請求失敗',
        status: response.status,
      };
    } 
    
    // 處理非 JSON 響應
    return {
      data: undefined,
      error: response.ok ? undefined : '請求失敗',
      status: response.status,
    };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error.message : '網絡錯誤',
      status: 0, // 0 表示網絡錯誤或請求未完成
    };
  }
}
