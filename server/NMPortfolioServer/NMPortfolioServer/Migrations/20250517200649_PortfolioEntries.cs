using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NMPortfolioServer.Migrations
{
    /// <inheritdoc />
    public partial class PortfolioEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.CreateTable(
                name: "PortfolioEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ordinal = table.Column<int>(type: "int", nullable: false),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    ShortTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ShortDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    LongTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    LongDescription = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: true),
                    LongDescriptionType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioEntries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioThumbnailCarouselEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PortfolioEntryId = table.Column<int>(type: "int", nullable: false),
                    Ordinal = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioThumbnailCarouselEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PortfolioThumbnailCarouselEntries_PortfolioEntries_PortfolioEntryId",
                        column: x => x.PortfolioEntryId,
                        principalTable: "PortfolioEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioThumbnailCarouselEntries_PortfolioEntryId",
                table: "PortfolioThumbnailCarouselEntries",
                column: "PortfolioEntryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortfolioThumbnailCarouselEntries");

            migrationBuilder.DropTable(
                name: "PortfolioEntries");

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                });
        }
    }
}
