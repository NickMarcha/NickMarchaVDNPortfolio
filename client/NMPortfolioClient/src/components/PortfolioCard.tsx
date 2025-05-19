import {type ApiShortPortfolioEntry, createPortfolioEntry} from "@/portfolioApi.ts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {AspectRatio} from "@/components/ui/aspect-ratio"
import {SelectedPortfolioIdAtom} from "@/components/SelectedPortfolioEntry.tsx";
import {useAtomValue, useSetAtom} from "jotai";
import {AdminModeAtom} from "@/components/Header.tsx";
import {useQueryClient} from "@tanstack/react-query";

export function PortfolioCard({shortPortfolio}: { shortPortfolio: ApiShortPortfolioEntry }) {

    const setSelectedPortfolioEntry = useSetAtom(SelectedPortfolioIdAtom);

    return (
        <Card
            className="w-[350px] m-2 transition-all duration-100 hover:outline-2 hover:outline-black hover:bg-gray-200 bg-cyan-100 min-w-xs"
            onClick={() => setSelectedPortfolioEntry(shortPortfolio.id)}>
            <CardHeader>
                <CardTitle className={"text-2xl"}>{shortPortfolio.shortTitle}</CardTitle>

            </CardHeader>
            <CardContent>
                <AspectRatio ratio={4 / 3} className="">
                    <img
                        className="w-full h-full"
                        src={shortPortfolio.thumbnailUrl ?? undefined}
                        alt="Thumbnail"
                    />
                </AspectRatio>
            </CardContent>
            <CardFooter className="flex justify-between">
                <CardDescription>{shortPortfolio.shortDescription}</CardDescription>
            </CardFooter>
        </Card>
    )
}

export function CreatePortfolioCard() {
    const adminMode = useAtomValue(AdminModeAtom);
    const queryClient = useQueryClient()

    function handleCreateNewPortfolioEntry() {
        createPortfolioEntry({
            enabled: false,
            ordinal: 0,
            shortTitle: "New Portfolio Entry",
            shortDescription: null,
            thumbnailUrl: null,
            longTitle: "New Portfolio Entry",
            longDescription: null,
            longDescriptionType: "Text",
            thumbnailCarouselEntries: [],
        }).then((response) => {
            console.log(response);
            queryClient.invalidateQueries({
                queryKey: ['portfolioEntries'],
            });
        }).catch(console.error);
    }

    if (!adminMode) {
        return null;
    }
    return (
        <Card
            className="w-[350px] m-2 transition-all duration-100 hover:outline-2 hover:outline-black hover:bg-green-300-200"
            onClick={handleCreateNewPortfolioEntry}
        >
            <CardHeader>
                <CardTitle>Create new entry</CardTitle>
            </CardHeader>
            <CardContent>
                <AspectRatio ratio={4 / 3} className="bg-muted">
                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                         xmlnsXlink="http://www.w3.org/1999/xlink"
                         width="100%" height="100%" viewBox="0 0 45.402 45.402"
                         xmlSpace="preserve">
                        <g>
                            <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                        </g>
                    </svg>
                </AspectRatio>
            </CardContent>
            <CardFooter className="flex justify-between">

            </CardFooter>
        </Card>
    )
}

export function PortfolioCardSkeleton() {
    return (
        <Card
            className="w-[350px] m-2 transition-all duration-100 hover:outline-2 hover:outline-black hover:bg-gray-200">
            <CardHeader>
                <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
                <AspectRatio ratio={4 / 3}
                             className="bg-muted animate-pulse">
                    <div className="w-full h-full bg-gray-300"/>
                </AspectRatio>
            </CardContent>
            <CardFooter className="flex justify-between">
                <CardDescription>Loading...</CardDescription>
            </CardFooter>
        </Card>
    )
}