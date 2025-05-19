import {useQuery} from "@tanstack/react-query";
import {
    type ApiFullPortfolioEntry,
    type ApiPortfolioThumbnailCarouselEntry, deletePortfolioThumbnailCarouselEntry,
    getPortfolioEntry,
    PortfolioLongDescriptionSchema,
    postPortFolioThumbnailCarouselEntry,
    updatePortfolioEntry,
    updatePortFolioThumbnailCarouselEntry
} from "@/portfolioApi.ts";
import {useAtom, atom, useAtomValue} from "jotai";
import {AdminModeAtom} from "@/components/Header.tsx";
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import {RichTextEditor} from "@/components/RichTextEditor.tsx";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {Button} from "@/components/ui/button.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {toast} from "sonner"
import {Textarea} from "@/components/ui/textarea"
import {Progress} from "@/components/ui/progress.tsx";
import YoutubeEmbed from "@/components/YoutubeEmbed.tsx";
import "./TinyMCEStyles.css";

export const SelectedPortfolioIdAtom = atom<null | number>(null);

export function SelectedPortfolioEntry() {
    const [selectedPortfolioId, setSelectedPortfolioId] = useAtom(SelectedPortfolioIdAtom);
    const adminMode = useAtomValue(AdminModeAtom);

    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['selectedPortfolioEntry', selectedPortfolioId],
        queryFn: async () => {
            if (selectedPortfolioId === null) {
                return null;
            }

            return await getPortfolioEntry(selectedPortfolioId)
        },
        enabled: selectedPortfolioId !== null,
    });

    if (selectedPortfolioId === null) {
        return <></>
    }


    const handleClose = () => setSelectedPortfolioId(null);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"

            onClick={handleClose}
        >
            {isFetching && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <Progress className="h-4 w-4"/>
                </div>
            )}
            <div
                className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {isPending ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : error || data == undefined ? (
                    <div className="text-center text-red-500">Error loading entry.</div>
                ) : (
                    <>
                        {adminMode ? <EditFullContent data={data}/> :
                            <RenderFullContent apiFullPortfolioEntry={data}/>}
                    </>
                )}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

function EditFullContent({data}: { data: ApiFullPortfolioEntry }) {

    const [apiFullPortfolioEntry, setApiFullPortfolioEntry] = useState(data);

    const [newThumbnailCarouselEntry, setNewThumbnailCarouselEntry] = useState<ApiPortfolioThumbnailCarouselEntry>({
        ordinal: apiFullPortfolioEntry.thumbnailCarouselEntries.length,
        imageUrl: "",
        description: "",
        portfolioEntryId: apiFullPortfolioEntry.id ?? -1, //should think of better type inference here
    });

    function renderLongDescription() {
        switch (apiFullPortfolioEntry.longDescriptionType) {
            case "Markdown":
                return <div>Markdown Not suppoerted</div>
            case "Html":
                return <>
                    <RichTextEditor
                        initialValue={apiFullPortfolioEntry.longDescription ?? ""}
                        onEditorChange={
                            (content) => {
                                setApiFullPortfolioEntry((prev) => ({
                                    ...prev,
                                    longDescription: content
                                }))
                            }
                        }
                    />
                </>
            case "Text":
                return <>
                    <Label htmlFor={"longDescription"}>Long Description</Label>
                    <Textarea
                        id={"longDescription"}
                        value={apiFullPortfolioEntry.longDescription ?? ""}
                        onChange={
                            (event) => {
                                setApiFullPortfolioEntry((prev) => ({
                                    ...prev,
                                    longDescription: event.target.value
                                }))
                            }
                        }
                    />
                </>
            default:
                return <div>Unknown</div>
        }
    }

    function handleAddThumbnail() {
        postPortFolioThumbnailCarouselEntry(newThumbnailCarouselEntry).then((res) => {
                console.log("Thumbnail added successfully", res);
                toast("Thumbnail added successfully");
                setApiFullPortfolioEntry((prev) => ({
                    ...prev,
                    thumbnailCarouselEntries: [...prev.thumbnailCarouselEntries, newThumbnailCarouselEntry].sort((a, b) => a.ordinal - b.ordinal),
                }))
            }
        ).catch(console.error)
    }

    function handleUpdateThumbnail(ut: ApiPortfolioThumbnailCarouselEntry) {
        updatePortFolioThumbnailCarouselEntry(ut).then((res) => {
                console.log("Thumbnail updated successfully", res);
                toast("Thumbnail updated successfully");
                setApiFullPortfolioEntry((prev) => ({
                    ...prev,
                    thumbnailCarouselEntries: prev.thumbnailCarouselEntries.map((entry) => {
                        if (entry.id === ut.id) {
                            return res;
                        }
                        return entry;
                    }).sort((a, b) => a.ordinal - b.ordinal),
                }))
            }
        ).catch(console.error)
    }

    function handleSave() {
        updatePortfolioEntry(apiFullPortfolioEntry).then((res) => {
            console.log("Portfolio entry updated successfully", res);
            toast("Portfolio entry updated successfully");
            setApiFullPortfolioEntry(res);
        }).catch(console.error);
    }

    function handleDeleteThumbnail(id: number) {
        deletePortfolioThumbnailCarouselEntry(id).then((res) => {
            console.log("Thumbnail deleted successfully", res);
            toast("Thumbnail deleted successfully");
            setApiFullPortfolioEntry((prev) => ({
                ...prev,
                thumbnailCarouselEntries: prev.thumbnailCarouselEntries.filter((entry) => entry.id !== id)
            }))
        }).catch(console.error);
    }


    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Editing {apiFullPortfolioEntry.id}</h2>
            <Label htmlFor={"longTitle"}>Long Title</Label>
            <Input
                id={"longTitle"}
                value={apiFullPortfolioEntry.longTitle}
                onChange={
                    (event) => {
                        setApiFullPortfolioEntry((prev) => ({
                            ...prev,
                            longTitle: event.target.value
                        }))
                    }
                }
            />

            <Label htmlFor={"shortTitle"}>Short Title</Label>
            <Input
                id={"shortTitle"}
                value={apiFullPortfolioEntry.shortTitle}
                onChange={
                    (event) => {
                        setApiFullPortfolioEntry((prev) => ({
                            ...prev,
                            shortTitle: event.target.value
                        }))
                    }
                }
            />

            <Label htmlFor={"thumbnailUrl"}>Thumbnail URL</Label>
            <Input
                id={"thumbnailUrl"}
                value={apiFullPortfolioEntry.thumbnailUrl ?? ""}
                onChange={
                    (event) => {
                        setApiFullPortfolioEntry((prev) => ({
                            ...prev,
                            thumbnailUrl: event.target.value
                        }))
                    }
                }
            />

            <Label htmlFor={"shortDescription"}>Short Description</Label>
            <Input
                id={"shortDescription"}
                value={apiFullPortfolioEntry.shortDescription ?? ""}
                onChange={
                    (event) => {
                        setApiFullPortfolioEntry((prev) => ({
                            ...prev,
                            shortDescription: event.target.value
                        }))
                    }
                }
            />

            <Label htmlFor={"longDescriptionType"}>Description Type</Label>
            <Select
                value={apiFullPortfolioEntry.longDescriptionType}
                onValueChange={
                    (value) => {
                        setApiFullPortfolioEntry((prev) => ({
                            ...prev,
                            longDescriptionType: value as any
                        }))
                    }
                }>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="type"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Description Type</SelectLabel>
                        {PortfolioLongDescriptionSchema.options.map((v) => (
                            <SelectItem key={v} value={v}>
                                {v}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>


            {renderLongDescription()}

            <Label htmlFor={"thumbnailCarouselEntries"}>Thumbnail Carousel Entries</Label>

            {apiFullPortfolioEntry.thumbnailCarouselEntries.map((v, index) => (
                <div key={index} className={"outline-1 flex flex-row"}>
                    {/* <Label htmlFor={`thumbnailCarouselEntries[${index}].imageUrl`}>Thumbnail URL</Label>*/}
                    <Input
                        id={`thumbnailCarouselEntries[${index}].imageUrl`}
                        value={v.imageUrl}
                        onChange={
                            (event) => {
                                setApiFullPortfolioEntry((prev) => ({
                                    ...prev,
                                    thumbnailCarouselEntries: prev.thumbnailCarouselEntries.map((entry, i) => {
                                        if (i === index) {
                                            return {
                                                ...entry,
                                                imageUrl: event.target.value
                                            }
                                        }
                                        return entry;
                                    })
                                }))
                            }
                        }
                    />
                    <Button
                        disabled={index === 0}
                        onClick={() => {
                            const entries = [...apiFullPortfolioEntry.thumbnailCarouselEntries];

                            entries[index].ordinal = index - 1;

                            entries[index - 1].ordinal = index;

                            handleUpdateThumbnail(entries[index]);
                            handleUpdateThumbnail(entries[index - 1]);

                        }}
                    >↑</Button>
                    <Button
                        disabled={index === apiFullPortfolioEntry.thumbnailCarouselEntries.length - 1}
                        onClick={() => {

                            const entries = [...apiFullPortfolioEntry.thumbnailCarouselEntries];

                            entries[index].ordinal = index + 1;

                            entries[index + 1].ordinal = index;

                            handleUpdateThumbnail(entries[index]);
                            handleUpdateThumbnail(entries[index + 1]);

                        }}
                    >↓</Button>
                    <Button
                        className={"bg-green-700"}
                        onClick={() => {
                            handleUpdateThumbnail(v);
                        }}
                    >
                        S
                    </Button>
                    <Button
                        className={"bg-red-700"}
                        onClick={() => {
                            handleDeleteThumbnail(v.id ?? -1);
                        }}
                    >
                        D
                    </Button>
                </div>
            ))}

            <div
                className={"bg-gray-400 p-2 rounded-2xl text-white"}
            >
                <p>New Carousel Thumbnail Entry</p>

                <Label htmlFor={"newThumbnailCarouselEntry.imageUrl"}>Thumbnail URL</Label>
                <Input
                    id={"newThumbnailCarouselEntry.imageUrl"}
                    value={newThumbnailCarouselEntry.imageUrl}
                    onChange={
                        (event) => {
                            setNewThumbnailCarouselEntry((prev) => ({
                                ...prev,
                                imageUrl: event.target.value
                            }))
                        }
                    }
                />
                <Label htmlFor={"newThumbnailCarouselEntry.description"}>Description</Label>
                <Input
                    id={"newThumbnailCarouselEntry.description"}
                    value={newThumbnailCarouselEntry.description ?? ""}
                    onChange={
                        (event) => {
                            setNewThumbnailCarouselEntry((prev) => ({
                                ...prev,
                                description: event.target.value
                            }))
                        }
                    }
                />
                <Button
                    onClick={() => handleAddThumbnail()}
                >
                    Add Thumbnail
                </Button>
            </div>

            <div className={"flex flex-row justify-between mt-10"}>
                <div className="flex flex-col">
                    <Label htmlFor={"enabled"}>Enabled</Label>
                    <Switch id={"enabled"}
                            checked={apiFullPortfolioEntry.enabled}
                            onCheckedChange={
                                (checked) => {
                                    setApiFullPortfolioEntry((prev) => ({
                                        ...prev,
                                        enabled: checked
                                    }))
                                }
                            }
                    />
                </div>
                <Button
                    onClick={() => handleSave()}
                >
                    Save
                </Button>
            </div>

        </div>
    );
}

function RenderFullContent({apiFullPortfolioEntry}: { apiFullPortfolioEntry: ApiFullPortfolioEntry }) {

    function renderLongDescription() {
        switch (apiFullPortfolioEntry.longDescriptionType) {
            case "Markdown":
                return <div>Markdown Not suppoerted</div>
            case "Html":
                return <div className={"tinymce-content"} dangerouslySetInnerHTML={{__html: apiFullPortfolioEntry.longDescription ?? ""}}/>
            case "Text":
                return <p>{apiFullPortfolioEntry.longDescription}</p>
            default:
                return <div>Unknown</div>
        }
    }

    function renderThumbnailOrEmbed(url: string) {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = url.split(/(?:v=|\/)([0-9A-Za-z_-]{11})/)[
                1
                ];
            if (videoId) {
                return (
                    <div className="w-full">
                        <YoutubeEmbed embedId={videoId}/>
                    </div>
                );
            }
        }


        return (
            <img
                src={url}
                alt={"Thumbnail"}
                className="w-full h-auto object-contain"
            />
        )
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">
                {apiFullPortfolioEntry.longTitle}
            </h2>

            {apiFullPortfolioEntry.thumbnailCarouselEntries.length > 0 && (
                <div className="flex justify-center">
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                        className="w-full max-w-3xl relative">
                        <CarouselContent className="flex w-full">
                            {apiFullPortfolioEntry.thumbnailCarouselEntries.map((v, index) => (
                                <CarouselItem key={index} className="w-full flex justify-center">
                                    <div className="w-full">
                                        {renderThumbnailOrEmbed(v.imageUrl)}
                                        <p className="text-center mt-2 bg-gray-200 text-gray-700 w-fit mx-auto p-1 rounded-lg italic">
                                            {v.description}
                                        </p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {apiFullPortfolioEntry.thumbnailCarouselEntries.length > 1 &&
                            <>
                                <CarouselPrevious
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full"/>
                                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"/>
                            </>
                        }
                    </Carousel>
                </div>
            )}

            {renderLongDescription()}
        </div>

    );
}