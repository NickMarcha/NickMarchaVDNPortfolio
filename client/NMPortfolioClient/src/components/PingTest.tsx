import {useQuery} from "@tanstack/react-query";
import {getPing} from "@/portfolioApi.ts";

export function TestPing() {
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