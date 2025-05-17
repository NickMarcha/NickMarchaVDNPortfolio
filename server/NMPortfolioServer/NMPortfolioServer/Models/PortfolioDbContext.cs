using Microsoft.EntityFrameworkCore;

namespace NMPortfolioServer.Models;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
        : base(options)
    {
    }

    public DbSet <PortfolioEntry> PortfolioEntries { get; set; }
    public DbSet <PortfolioThumbnailCarouselEntry> PortfolioThumbnailCarouselEntries { get; set; }
}