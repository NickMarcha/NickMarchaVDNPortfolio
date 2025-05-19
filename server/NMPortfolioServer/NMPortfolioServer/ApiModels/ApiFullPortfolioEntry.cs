using JetBrains.Annotations;
using NMPortfolioServer.Models;

namespace NMPortfolioServer.ApiModels;

[PublicAPI]
public class ApiFullPortfolioEntry
{
    public int? Id { get; set; }
    public int Ordinal { get; set; }

    public bool Enabled { get; set; }

    #region short info for card

    public required string ShortTitle { get; set; }
    public string? ShortDescription { get; set; }
    public string? ThumbnailUrl { get; set; }

    #endregion

    #region long info for full view

    public required string LongTitle { get; set; }
    public string? LongDescription { get; set; }
    public DescriptionType LongDescriptionType { get; set; }

    public ICollection<ApiPortfolioThumbnailCarouselEntry> ThumbnailCarouselEntries { get; set; } =
        new List<ApiPortfolioThumbnailCarouselEntry>();

    #endregion

    public static explicit operator ApiFullPortfolioEntry(PortfolioEntry portfolioEntry)
    {
        return new ApiFullPortfolioEntry
        {
            Id = portfolioEntry.Id,
            Ordinal = portfolioEntry.Ordinal,
            Enabled = portfolioEntry.Enabled,
            ShortTitle = portfolioEntry.ShortTitle,
            ShortDescription = portfolioEntry.ShortDescription,
            ThumbnailUrl = portfolioEntry.ThumbnailUrl,
            LongTitle = portfolioEntry.LongTitle,
            LongDescription = portfolioEntry.LongDescription,
            LongDescriptionType = portfolioEntry.LongDescriptionType,
            ThumbnailCarouselEntries = portfolioEntry.ThumbnailCarouselEntries
                .Select(x => (ApiPortfolioThumbnailCarouselEntry)x)
                .ToList()
        };
    }

    public void UpdateExistingPortfolioEntry(PortfolioEntry portfolioEntry)
    {
        portfolioEntry.Ordinal = Ordinal;
        portfolioEntry.Enabled = Enabled;
        portfolioEntry.ShortTitle = ShortTitle;
        portfolioEntry.ShortDescription = ShortDescription;
        portfolioEntry.ThumbnailUrl = ThumbnailUrl;
        portfolioEntry.LongTitle = LongTitle;
        portfolioEntry.LongDescription = LongDescription;
        portfolioEntry.LongDescriptionType = LongDescriptionType;
    }

    public PortfolioEntry ToPortfolioEntry()
    {
        return new PortfolioEntry
        {
            Id = Id ?? 0,
            Ordinal = Ordinal,
            Enabled = Enabled,
            ShortTitle = ShortTitle,
            ShortDescription = ShortDescription,
            ThumbnailUrl = ThumbnailUrl,
            LongTitle = LongTitle,
            LongDescription = LongDescription,
            LongDescriptionType = LongDescriptionType
        };
    }
}

[PublicAPI]
public class ApiPortfolioThumbnailCarouselEntry
{
    public int? Id { get; set; }
    public int PortfolioEntryId { get; set; }
    public int Ordinal { get; set; }
    public required string ImageUrl { get; set; }
    public string? Description { get; set; }

    public static explicit operator ApiPortfolioThumbnailCarouselEntry(
        PortfolioThumbnailCarouselEntry portfolioThumbnailCarouselEntry)
    {
        return new ApiPortfolioThumbnailCarouselEntry
        {
            Id = portfolioThumbnailCarouselEntry.Id,
            PortfolioEntryId = portfolioThumbnailCarouselEntry.PortfolioEntryId,
            Ordinal = portfolioThumbnailCarouselEntry.Ordinal,
            ImageUrl = portfolioThumbnailCarouselEntry.ImageUrl,
            Description = portfolioThumbnailCarouselEntry.Description,
        };
    }

    public PortfolioThumbnailCarouselEntry ToPortfolioThumbnailCarouselEntry()
    {
        return new PortfolioThumbnailCarouselEntry
        {
            Id = Id ?? 0,
            PortfolioEntryId = PortfolioEntryId,
            Ordinal = Ordinal,
            ImageUrl = ImageUrl,
            Description = Description,
        };
    }
    
    public void UpdateExistingPortfolioThumbnailCarouselEntry(
        PortfolioThumbnailCarouselEntry portfolioThumbnailCarouselEntry)
    {
        portfolioThumbnailCarouselEntry.Ordinal = Ordinal;
        portfolioThumbnailCarouselEntry.ImageUrl = ImageUrl;
        portfolioThumbnailCarouselEntry.Description = Description;
    }
}