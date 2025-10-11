"use client";
import useSWR from 'swr';

interface FilterValues {
  [key: string]: string | string[] | [string, string] | null | undefined;
}

interface UseDynamicDataProps {
  endpoint: string;
  filters?: FilterValues;
  page?: number;
  limit?: number;
}

interface ApiResponse {
  success: boolean;
  data: any[];
  message?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  // Alternative pagination formats
  meta?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
  };
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useDynamicData = ({ endpoint, filters = {}, page = 1, limit = 10 }: UseDynamicDataProps) => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  // Handle search filters
  const searchTerms: string[] = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'name' || key === 'description') {
      if (value && typeof value === 'string') {
        searchTerms.push(value);
      }
    } else if (key === 'dateRange' && Array.isArray(value)) {
      // Handle dateRange as separate dateFrom and dateTo parameters
      if (value.length >= 2 && typeof value[0] === 'string' && typeof value[1] === 'string') {
        const [dateFrom, dateTo] = value;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
      }
    } else if (value !== null && value !== undefined && value !== '') {
      params[key] = String(value);
    }
  });

  if (searchTerms.length > 0) {
    params.search = searchTerms.join(' ');
  }

  const searchParams = new URLSearchParams(params);
  const swrKey = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${searchParams}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Debug logging
  if (data) {

  }

  // Extract pagination data from different possible formats
  const extractPagination = (apiData: ApiResponse) => {
    if (apiData.pagination) {
      // Standard format
      return {
        currentPage: apiData.pagination.page,
        totalPages: apiData.pagination.pages,
        totalItems: apiData.pagination.total,
        itemsPerPage: apiData.pagination.limit,
        hasNextPage: apiData.pagination.page < apiData.pagination.pages,
        hasPrevPage: apiData.pagination.page > 1,
      };
    } else if (apiData.meta) {
      // Meta format
      return {
        currentPage: apiData.meta.currentPage,
        totalPages: apiData.meta.totalPages,
        totalItems: apiData.meta.totalCount,
        itemsPerPage: apiData.meta.perPage,
        hasNextPage: apiData.meta.currentPage < apiData.meta.totalPages,
        hasPrevPage: apiData.meta.currentPage > 1,
      };
    } else if (apiData.totalPages !== undefined) {
      // Direct properties format
      return {
        currentPage: apiData.currentPage || 1,
        totalPages: apiData.totalPages,
        totalItems: apiData.totalItems || 0,
        itemsPerPage: apiData.itemsPerPage || 10,
        hasNextPage: (apiData.currentPage || 1) < apiData.totalPages,
        hasPrevPage: (apiData.currentPage || 1) > 1,
      };
    }
    return null;
  };

  return {
    data: data?.data || [],
    pagination: data ? extractPagination(data) : null,
    loading: isLoading,
    error,
    mutate,
  };
};