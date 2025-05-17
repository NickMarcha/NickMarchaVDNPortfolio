using System.ComponentModel.DataAnnotations;

namespace NMPortfolioServer.Models;

public class PortfolioEntry
{
    public int Id { get; set; }
    public int Ordinal { get; set; }

    public bool Enabled { get; set; } = false;

    #region short info for card

    [StringLength(200)] public required string ShortTitle { get; set; }
    [StringLength(500)] public string? ShortDescription { get; set; }
    [StringLength(500)] public string? ThumbnailUrl { get; set; }

    #endregion

    #region long info for full view

    [StringLength(500)] public required string LongTitle { get; set; }
    [StringLength(5000)] public string? LongDescription { get; set; }
    public DescriptionType LongDescriptionType { get; set; }

    public ICollection<PortfolioThumbnailCarouselEntry> ThumbnailCarouselEntries { get; set; } =
        new List<PortfolioThumbnailCarouselEntry>();

    #endregion
}

public class PortfolioThumbnailCarouselEntry
{
    public int Id { get; set; }
    public int PortfolioEntryId { get; set; }
    public int Ordinal { get; set; }
    [StringLength(500)] public required string ImageUrl { get; set; }
    [StringLength(500)] public string? Description { get; set; }
}

public enum DescriptionType
{
    Text,
    Markdown,
    Html // The Idea is to use TinyMCE or similar for this
}