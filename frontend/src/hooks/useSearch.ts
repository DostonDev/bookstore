import { useQuery } from '@tanstack/react-query'
import { searchService } from '@/services/search.service'
import { useDebounce } from './useDebounce'

export const useSearch = (params: { q: string; type?: string; sort?: string; page?: number }) => {
  const debouncedQ = useDebounce(params.q, 400)

  return useQuery({
    queryKey: ['search', debouncedQ, params.type, params.sort, params.page],
    queryFn: async () => {
      const res = await searchService.search({ ...params, q: debouncedQ })
      return res.data
    },
    enabled: debouncedQ.trim().length >= 2,
    staleTime: 30 * 1000,
  })
}

export const useAutocomplete = (q: string) => {
  const debouncedQ = useDebounce(q, 300)

  return useQuery({
    queryKey: ['autocomplete', debouncedQ],
    queryFn: async () => {
      const res = await searchService.autocomplete(debouncedQ)
      return res.data.data ?? []
    },
    enabled: debouncedQ.trim().length >= 2,
    staleTime: 10 * 1000,
  })
}
