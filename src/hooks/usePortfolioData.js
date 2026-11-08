import useSWR from 'swr'
import { apiRequest } from '../services/api'

export function usePortfolioData(path, fallbackData) {
  const { data, error, isLoading, mutate } = useSWR(path, apiRequest, {
    fallbackData,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 20_000,
  })

  return {
    data,
    error,
    isLoading,
    isPreviewData: Boolean(error) || isLoading,
    mutate,
  }
}
