import type {ColumnFiltersState, PaginationState, SortingState} from '@tanstack/react-table';
import {z, ZodObject} from 'zod';
import {env} from "@/env";

export type PaginationFilterValue = { option: string, included: boolean };


export const getPing = async () => {
    const response = await fetch(env.VITE_PORTFOLIO_API_URL + '/Ping');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.text();
}

export const postPortfolioEntriesPaginated = async (params: PaginationRequestParams) => {

    return await fetchPaginated('/PortfolioEntries/Paginated', params, ApiShortPortfolioEntrySchema);
}

export const getPortfolioEntry = async (id: number) => {
    return await fetchValidated('/PortfolioEntries/' + id, ApiFullPortfolioEntrySchema, "Get");
}

export const createPortfolioEntry = async (entry: ApiFullPortfolioEntry) => {
    return await fetchValidated('/PortfolioEntries/', ApiFullPortfolioEntrySchema, "Post", ApiFullPortfolioEntrySchema, entry);
}

export const updatePortfolioEntry = async (entry: ApiFullPortfolioEntry) => {
    return await fetchValidated('/PortfolioEntries/' + entry.id, ApiFullPortfolioEntrySchema, "Put", ApiFullPortfolioEntrySchema, entry);
}

export const postPortFolioThumbnailCarouselEntry = async (entry: ApiPortfolioThumbnailCarouselEntry) => {
    return await fetchValidated('/PortfolioEntries/' + entry.portfolioEntryId + '/ThumbnailCarouselEntries', ApiPortfolioThumbnailCarouselEntrySchema, "Post", ApiPortfolioThumbnailCarouselEntrySchema, entry);
}

export const updatePortFolioThumbnailCarouselEntry = async (entry: ApiPortfolioThumbnailCarouselEntry) => {
    return await fetchValidated('/PortfolioEntries/ThumbnailCarouselEntries/' + entry.id, ApiPortfolioThumbnailCarouselEntrySchema, "Put", ApiPortfolioThumbnailCarouselEntrySchema, entry);
}

export const deletePortfolioThumbnailCarouselEntry = async (id: number) => {
    return await fetchValidated('/PortfolioEntries/ThumbnailCarouselEntries/' + id, ApiPortfolioThumbnailCarouselEntrySchema, "Delete");
}

const fetchPaginated = async <TResponse extends ZodObject<any>>(path: string, paginationRequest: PaginationRequestParams, responseSchema: TResponse) => {

    if (!PaginationRequestParamsSchema.safeParse(paginationRequest).success) {
        throw new Error('Request validation failed');
    }

    const response = await fetch(env.VITE_PORTFOLIO_API_URL + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paginationRequest),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseBody = await response.json();

    //validate the response
    const result = PaginatedResponseSchema.safeParse(responseBody);

    if (!result.success) {
        throw new Error('Response validation failed 3: ' + result.error.message);
    }

    result.data.items = result.data.items.map((item: any) => {
        const pItem = responseSchema.safeParse(item);

        if (!pItem.success) {
            throw new Error('Response validation failed 2: ' + pItem.error.message);
        }
        return pItem.data;
    });

    return result.data as PaginationResponseParams<z.infer<typeof responseSchema>>;
}

const fetchValidated = async <TRequest extends ZodObject<any>, TResponse extends ZodObject<any>>
(path: string, responseSchema: TResponse, method: RequestMethods = "Get", requestSchema?: TRequest, request?: z.infer<TRequest>) => {
    if (requestSchema === undefined && request !== undefined) {
        throw new Error('Request schema is undefined, but request is defined');
    }

    //validate the request
    if (requestSchema !== undefined && !requestSchema.safeParse(request).success) {
        throw new Error('Request validation failed');
    }

    const response = await fetch(env.VITE_PORTFOLIO_API_URL + path, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseBody = await response.json();

    //validate the response
    const result = responseSchema.safeParse(responseBody);

    if (!result.success) {
        console.error("result.error", result);
        throw new Error('Response validation failed 1' + result.error.message);
    }

    return result.data as z.infer<TResponse>;
}


// Match TanStack's SortingState = Array<{ id: string; desc: boolean }>
const SortingStateSchema = z.array(z.object({
    id: z.string(),
    desc: z.boolean(),
}));

// Match PaginationState = { pageIndex: number; pageSize: number }
const PaginationStateSchema = z.object({
    pageIndex: z.number().int(),
    pageSize: z.number().int(),
});

// Match ColumnFiltersState = Array<{ id: string; value: unknown }>
const ColumnFiltersStateSchema = z.array(z.object({
    id: z.string(),
    value: z.any(), // or `z.unknown()` or `z.string()` if you're expecting a specific type
}));

export const PaginationRequestParamsSchema = z.object({
    sorting: SortingStateSchema,
    globalFilter: z.string(),
    pagination: PaginationStateSchema,
    columnFilters: ColumnFiltersStateSchema,
});

export type PaginationRequestParams = {
    sorting: SortingState,
    globalFilter: string,
    pagination: PaginationState,
    columnFilters: ColumnFiltersState,
}

const PaginatedResponseSchema = z.object({
    items: z.array(z.any()),
    thisPageNumber: z.number().int(),
    thisPageSize: z.number().int(),
    totalPageNumber: z.number().int(),
    filteredTotalRows: z.number().int(),
    unfilteredTotalRows: z.number().int()
});

export type PaginationResponseParams<T> = {
    items: T[],
    thisPageNumber: number,
    thisPageSize: number,
    totalPageNumber: number,
    filteredTotalRows: number,
    unfilteredTotalRows: number
}

type  RequestMethods = "Get" | "Head" | "Post" | "Put" | "Delete" | "Connect" | "Options" | "Trace" | "Patch";

const ApiPortfolioThumbnailCarouselEntrySchema = z.object({
    id: z.number().int().optional(),
    portfolioEntryId: z.number().int(),
    ordinal: z.number().int(),
    imageUrl: z.string(),
    description: z.string().nullable(),
});

export type ApiPortfolioThumbnailCarouselEntry = z.infer<typeof ApiPortfolioThumbnailCarouselEntrySchema>;

export const PortfolioLongDescriptionSchema = z.enum(['Text', 'Markdown', 'Html']);
//export type PortfolioLongDescriptionType = z.infer<typeof PortfolioLongDescriptionSchema>;

export const ApiFullPortfolioEntrySchema = z.object({
    id: z.number().int().optional(),
    ordinal: z.number().int(),
    enabled: z.boolean(),
    shortTitle: z.string(),
    shortDescription: z.string().nullable(),
    thumbnailUrl: z.string().nullable(),
    longTitle: z.string(),
    longDescription: z.string().nullable(),
    longDescriptionType: PortfolioLongDescriptionSchema,
    thumbnailCarouselEntries: z.array(ApiPortfolioThumbnailCarouselEntrySchema),
});


export type ApiFullPortfolioEntry = z.infer<typeof ApiFullPortfolioEntrySchema>;

export const ApiShortPortfolioEntrySchema = z.object({
    id: z.number().int(),
    ordinal: z.number().int(),
    enabled: z.boolean(),
    shortTitle: z.string(),
    shortDescription: z.string().nullable(),
    thumbnailUrl: z.string().nullable(),
});

export type ApiShortPortfolioEntry = z.infer<typeof ApiShortPortfolioEntrySchema>;