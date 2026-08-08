import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
    loader: () => {
        throw redirect({
            href: import.meta.env.VITE_DIRECTUS_URL
        })
    },
    component: RouteComponent,
})

function RouteComponent() {
    return null;
}
