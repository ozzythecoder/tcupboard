import {QueryClient} from '@tanstack/react-query'
import ky from 'ky'

export const queryClient = new QueryClient();

export const api = ky.extend({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`
})

export const useProtectedApi = (token: string) => {
    return api.extend({
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
} 