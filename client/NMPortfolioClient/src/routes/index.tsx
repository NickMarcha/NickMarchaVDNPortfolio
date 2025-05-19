import {createFileRoute} from '@tanstack/react-router'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {SelectedPortfolioEntry} from "@/components/SelectedPortfolioEntry.tsx";
/*import {TestPing} from "@/components/PingTest.tsx";*/
import {PortfolioEntries} from "@/components/PortfolioEntriesListing.tsx";
import {attachDebugMode} from "@/DebugStore.ts";


export const Route = createFileRoute('/')({
    component: App,
})

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-teal-700 flex-1">
                {/*<TestPing/>*/}
                <PortfolioEntries/>
                <SelectedPortfolioEntry/>
            </div>
        </QueryClientProvider>
    )
}



attachDebugMode(window);
