import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/test')({
  validateSearch : z.object({
    name: z.string(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useSearch();

  return <div>Hello {data.name}!</div>
}
