using JetBrains.Annotations;
using NMPortfolioServer.Models;

namespace NMPortfolioServer.ApiModels;

[PublicAPI]
public class ApiShortPortfolioEntry
{
    public int? Id { get; set; }
    public int Ordinal { get; set; }

    public bool Enabled { get; set; }
    public required string ShortTitle { get; set; }
    public string? ShortDescription { get; set; }
    public string? ThumbnailUrl { get; set; }

    public static explicit operator ApiShortPortfolioEntry(PortfolioEntry portfolioEntry)
    {
        return new ApiShortPortfolioEntry
        {
            Id = portfolioEntry.Id,
            Ordinal = portfolioEntry.Ordinal,
            Enabled = portfolioEntry.Enabled,
            ShortTitle = portfolioEntry.ShortTitle,
            ShortDescription = portfolioEntry.ShortDescription,
            ThumbnailUrl = portfolioEntry.ThumbnailUrl
        };
    }
}