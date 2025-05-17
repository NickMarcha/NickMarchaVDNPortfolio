import {createFileRoute, Link} from '@tanstack/react-router'
import logo from '../logo.svg'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {getPing, type PaginationRequestParams, postPortfolioEntriesPaginated} from "@/portfolioApi.ts";
import * as React from "react";

export const Route = createFileRoute('/')({
    component: App,
})

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="text-center">
                <TestPing/>
                <PortfolioEntries/>

                <Link to={'/test'} search={{
                    name: 'World',
                }} className="text-[#61dafb] hover:underline">
                    Go to /test
                </Link>

            </div>
        </QueryClientProvider>
    )
}

function PortfolioEntries() {
    const [requestParams, setRequestParams] = React.useState<PaginationRequestParams>({
        sorting: [],
        globalFilter: '',
        pagination: {
            pageIndex: 0,
            pageSize: 10,
        },
        columnFilters: [],
    });

    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['portfolioEntries'],
        queryFn: () => postPortfolioEntriesPaginated(requestParams),
    });

    return (
        <div>
            <p>
                Portfolio Entries:
            </p>
            {isPending && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <div>
                <p> count: {data.unfilteredTotalRows}</p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.shortTitle}</td>
                            <td>{item.shortDescription}</td>
                            <td><img src={item.thumbnailUrl??undefined} alt={item.shortTitle} width={50}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>}
            {isFetching && <p>Fetching...</p>}
        </div>
    )


}

function TestPing() {
    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['portfolioPing'],
        queryFn: getPing
    })
    return (<div>
        <p>
            Test Ping:
        </p>
        {isPending && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <p>Data: {data}</p>}
        {isFetching && <p>Fetching...</p>}
    </div>)
}