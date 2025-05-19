import {Outlet, createRootRoute} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {Toaster} from "@/components/ui/sonner"

import Header from '../components/Header'

export const Route = createRootRoute({
    component: () => (
        <div className={"flex flex-col h-screen"}>
            <Header/>
            <Outlet/>
            <Toaster/>
            <TanStackRouterDevtools/>
        </div>
    ),
})
