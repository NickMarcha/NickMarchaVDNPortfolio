import * as React from "react";
import {type PaginationRequestParams, postPortfolioEntriesPaginated} from "@/portfolioApi.ts";
import {useQuery} from "@tanstack/react-query";
import {CreatePortfolioCard, PortfolioCard, PortfolioCardSkeleton} from "@/components/PortfolioCard.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import {Label} from "@/components/ui/label"


type sortingOptions = "ordinal" | "shortTitle" | "shortDescription"
type sortingDirection = "asc" | "desc"

export function PortfolioEntries() {
    const [requestParams, setRequestParams] = React.useState<PaginationRequestParams>({
        sorting: [{id: "ordinal", desc: false}],
        globalFilter: '',
        pagination: {
            pageIndex: 0,
            pageSize: 10,
        },
        columnFilters: [],
    });

    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['portfolioEntries', requestParams],
        queryFn: () => postPortfolioEntriesPaginated(requestParams),

    });

    const handleSortingChange = (newSorting: sortingOptions, newDirection: sortingDirection) => {
        setRequestParams((prev) => ({
            ...prev,
            sorting: [{id: newSorting, desc: newDirection === "desc"}],
        }));
    };

    return (
        <div>
            <div className={"flex flex-row justify-center p-2"}>
                <Label
                    className="pr-2 bg-white rounded-l-md rounded-r-none border border-r-0 border-gray-300 flex items-center">
                    Sorted By
                </Label>
                <Select
                    value={requestParams.sorting[0]?.id as sortingOptions}
                    onValueChange={(value) => {
                        handleSortingChange(value as sortingOptions, "asc");
                    }}
                >
                    <SelectTrigger
                        className="w-[180px] bg-white rounded-r-md rounded-l-none border border-l-0 border-gray-300">
                        <SelectValue id={'sorting'} placeholder="Sort Order"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sorting</SelectLabel>
                            <SelectItem value="ordinal">ordinal</SelectItem>
                            <SelectItem value="shortTitle">Title</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {isPending && <PortfolioCardSkeleton/>}
                {error && <p>Error: {error.message}</p>}
                {data && <>
                    {data.items.map((item, index) => (
                        <PortfolioCard key={index} shortPortfolio={item}/>
                    ))
                    }
                    <CreatePortfolioCard/>
                </>
                }
            </div>
            {isFetching && <Progress value={50} className="w-[60%]"/>}
        </div>
    )
}