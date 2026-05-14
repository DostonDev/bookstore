import api from './api'
import type { PaginatedApiResponse, ApiResponse, SearchResult } from '@/types'

export const searchService = {
  search: (params: { q: string; type?: string; sort?: string; page?: number; limit?: number }) =>
    api.get<PaginatedApiResponse<SearchResult>>('/search', { params }),
  autocomplete: (q: string) =>
    api.get<ApiResponse<SearchResult[]>>('/search/autocomplete', { params: { q } }),
}
