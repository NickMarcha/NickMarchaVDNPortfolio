using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using NMPortfolioServer.ApiModels;
using NMPortfolioServer.common;
using NMPortfolioServer.Models;

var builder = WebApplication.CreateBuilder();

builder.Services.AddOpenApi();

String connection;
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddEnvironmentVariables().AddJsonFile("appsettings.Development.json");
    connection = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING") ??
                 throw new InvalidOperationException();
}
else
{
    connection = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING") ??
                 throw new InvalidOperationException();
}

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlServer(connection));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()  // Or use .WithOrigins("http://localhost:3000") for more control
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => { options.SwaggerEndpoint("/openapi/v1.json", "v1"); });
}

app.MapGet("/Ping", () => Results.Ok("Pong!"));

app.MapPost("/PortfolioEntries/Paginated", async (PaginationTypes.PaginationRequest pR, PortfolioDbContext context) =>
{
    IQueryable<PortfolioEntry> query = context.PortfolioEntries;
    if (!string.IsNullOrEmpty(pR.GlobalFilter))
    {
        var canParseToInt = int.TryParse(pR.GlobalFilter, out var idInt);

        query = query.Where(x =>
            x.ShortTitle.Contains(pR.GlobalFilter) ||
            (x.ShortDescription != null && x.ShortDescription.Contains(pR.GlobalFilter)) ||
            x.Ordinal.ToString().Contains(pR.GlobalFilter) ||
            (canParseToInt && x.Id == idInt));
    }

    foreach (var columnFilter in pR.ColumnFilters)
    {
        switch (columnFilter.Id)
        {
            case "shortTitle":
            {
                var filterValue = columnFilter.Value.ToString();

                if (!string.IsNullOrEmpty(filterValue))
                {
                    query = query.Where(x => x.ShortTitle.Contains(filterValue));
                }

                break;
            }
            case "shortDescription":
            {
                var filterValue = columnFilter.Value.ToString();

                if (!string.IsNullOrEmpty(filterValue))
                {
                    query = query.Where(x =>
                        x.ShortDescription != null && x.ShortDescription.Contains(filterValue));
                }

                break;
            }
        }
    }

    query = query.OrderBy(x => x.Ordinal);


    foreach (var sortingItem in pR.Sorting)
    {
        switch (sortingItem.Id)
        {
            case "ordinal":
            {
                query = sortingItem.Desc
                    ? query.OrderByDescending(x => x.Ordinal)
                    : query.OrderBy(x => x.Ordinal);
                break;
            }
            case "shortTitle":
            {
                query = sortingItem.Desc
                    ? query.OrderByDescending(x => x.ShortTitle)
                    : query.OrderBy(x => x.ShortTitle);
                break;
            }
            case "shortDescription":
            {
                query = sortingItem.Desc
                    ? query.OrderByDescending(x => x.ShortDescription)
                    : query.OrderBy(x => x.ShortDescription);
                break;
            }
        }
    }

    var filteredTotalRows = query.Count();
    var unfilteredTotalRows = context.PortfolioEntries.Count();

    var portfolioEntries = await query
        .Skip(pR.Pagination.PageIndex * pR.Pagination.PageSize)
        .Take(pR.Pagination.PageSize)
        .ToListAsync();

    var apiPortEntries = portfolioEntries.Select(x => (ApiShortPortfolioEntry)x).ToList();

    var response = new PaginationTypes.PaginationResponse<ApiShortPortfolioEntry>
    {
        Items = apiPortEntries.ToArray(),
        ThisPageNumber = pR.Pagination.PageIndex,
        ThisPageSize = pR.Pagination.PageSize,
        TotalPageNumber = (int)Math.Ceiling((double)filteredTotalRows / pR.Pagination.PageSize),
        FilteredTotalRows = filteredTotalRows,
        UnfilteredTotalRows = unfilteredTotalRows
    };
    return Results.Ok(response);
});

app.MapGet("/PortfolioEntries/{id:int}", async (int id, PortfolioDbContext context) =>
    await context.PortfolioEntries
            .Include(x => x.ThumbnailCarouselEntries)
            .FirstOrDefaultAsync(x => x.Id == id)
        is { } portfolioEntry
        ? Results.Ok((ApiFullPortfolioEntry)portfolioEntry)
        : Results.NotFound());

app.MapPost("/PortfolioEntries", async (ApiFullPortfolioEntry portfolioEntry, PortfolioDbContext context) =>
{
    if (portfolioEntry.Id != null)
    {
        return Results.BadRequest("PortfolioEntry Id must be null");
    }

    var newPortfolioEntry = portfolioEntry.ToPortfolioEntry();

    context.PortfolioEntries.Add(newPortfolioEntry);
    await context.SaveChangesAsync();

    return Results.Created($"/PortfolioEntries/{newPortfolioEntry.Id}", (ApiFullPortfolioEntry)newPortfolioEntry);
});

app.MapPut("/PortfolioEntries/{id:int}", async (int id, ApiFullPortfolioEntry apiFullPortfolioEntry,
    PortfolioDbContext context) =>
{
    if (apiFullPortfolioEntry.Id != id)
    {
        return Results.BadRequest("PortfolioEntry Id must be the same as the id in the URL");
    }

    var existingPortfolioEntry = await context.PortfolioEntries
        .Include(x => x.ThumbnailCarouselEntries)
        .FirstOrDefaultAsync(x => x.Id == id);

    if (existingPortfolioEntry == null)
    {
        return Results.NotFound();
    }

    apiFullPortfolioEntry.UpdateExistingPortfolioEntry(existingPortfolioEntry);

    await context.SaveChangesAsync();

    return Results.NoContent();
});

app.MapPost("/PortfolioEntries/{id:int}/ThumbnailCarouselEntries",
    async (int id, ApiPortfolioThumbnailCarouselEntry apiPortfolioThumbnailCarouselEntry,
        PortfolioDbContext context) =>
    {
        if (apiPortfolioThumbnailCarouselEntry.Id != null)
        {
            return Results.BadRequest("ThumbnailCarouselEntry Id must be null");
        }

        var portfolioEntry = await context.PortfolioEntries
            .Include(x => x.ThumbnailCarouselEntries)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (portfolioEntry == null)
        {
            return Results.NotFound();
        }

        var newThumbnailCarouselEntry = apiPortfolioThumbnailCarouselEntry.ToPortfolioThumbnailCarouselEntry();

        portfolioEntry.ThumbnailCarouselEntries.Add(newThumbnailCarouselEntry);
        await context.SaveChangesAsync();

        return Results.Created($"/PortfolioEntries/{id}/ThumbnailCarouselEntries/{newThumbnailCarouselEntry.Id}",
            (ApiPortfolioThumbnailCarouselEntry)newThumbnailCarouselEntry);
    });

app.MapPut("/PortfolioEntries/{id:int}/ThumbnailCarouselEntries/{thumbnailId:int}",
    async (int id, int thumbnailId,
        ApiPortfolioThumbnailCarouselEntry apiPortfolioThumbnailCarouselEntry, PortfolioDbContext context) =>
    {
        if (apiPortfolioThumbnailCarouselEntry.Id != thumbnailId)
        {
            return Results.BadRequest("ThumbnailCarouselEntry Id must be the same as the id in the URL");
        }

        var portfolioEntry = await context.PortfolioEntries
            .Include(x => x.ThumbnailCarouselEntries)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (portfolioEntry == null)
        {
            return Results.NotFound();
        }

        var existingThumbnailCarouselEntry = portfolioEntry.ThumbnailCarouselEntries
            .FirstOrDefault(x => x.Id == thumbnailId);

        if (existingThumbnailCarouselEntry == null)
        {
            return Results.NotFound();
        }

        apiPortfolioThumbnailCarouselEntry.UpdateExistingPortfolioThumbnailCarouselEntry(
            existingThumbnailCarouselEntry);

        await context.SaveChangesAsync();

        return Results.NoContent();
    });

app.MapDelete("/PortfolioEntries/ThumbnailCarouselEntries/{thumbnailId:int}",
    async (int thumbnailId, PortfolioDbContext context) =>
    {
        
        var existingThumbnailCarouselEntry = await context.PortfolioThumbnailCarouselEntries
            .FirstOrDefaultAsync(x => x.Id == thumbnailId);
        
        if (existingThumbnailCarouselEntry == null)
        {
            return Results.NotFound();
        }

        context.PortfolioThumbnailCarouselEntries.Remove(existingThumbnailCarouselEntry);
        await context.SaveChangesAsync();

        return Results.NoContent();
    });

app.Run();