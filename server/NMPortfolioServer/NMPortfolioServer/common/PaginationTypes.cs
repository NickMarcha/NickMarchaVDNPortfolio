using JetBrains.Annotations;

namespace NMPortfolioServer.common;


public class PaginationTypes
{
    [PublicAPI]
    public class SortingItem
    {
        public string Id { get; set; }
        public bool Desc { get; set; }
    }

    [PublicAPI]
    public class Pagination
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }

    [PublicAPI]
    public class ColumnFilter
    {
        public string Id { get; set; }
        public object Value { get; set; }
    }

    [PublicAPI]
    public class PaginationRequest
    {
        public List<SortingItem> Sorting { get; set; }
        public string GlobalFilter { get; set; }
        public Pagination Pagination { get; set; }
        public List<ColumnFilter> ColumnFilters { get; set; }
    }

    [PublicAPI]
    public class PaginationResponse<T>
    {
        public T[] Items { get; set; }
        public int ThisPageNumber { get; set; }
        public int ThisPageSize { get; set; }
        public int TotalPageNumber { get; set; }
        public int FilteredTotalRows { get; set; }
        public int UnfilteredTotalRows { get; set; }
    }

    [PublicAPI]
    public class OptionFilter
    {
        public string Option { get; set; }
        public bool Included { get; set; }
    }
}