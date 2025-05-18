import {createFileRoute, Link} from '@tanstack/react-router'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {SelectedPortfolioEntry} from "@/components/SelectedPortfolioEntry.tsx";
/*import {TestPing} from "@/components/PingTest.tsx";*/
import {PortfolioEntries} from "@/components/PortfolioEntriesListing.tsx";


export const Route = createFileRoute('/')({
    component: App,
})

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="text-center">
                {/*<TestPing/>*/}
                <PortfolioEntries/>
                <SelectedPortfolioEntry/>

                <Link to={'/test'} search={{
                    name: 'World',
                }} className="text-[#61dafb] hover:underline">
                    Go to /test
                </Link>

            </div>
        </QueryClientProvider>
    )
}



