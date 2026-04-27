using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CertificateVerification.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBlockchainAndIpfsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IpfsCid",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DigitalSignature",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BlockchainTxHash",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BlockchainStatus",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IpfsCid",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "DigitalSignature",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "BlockchainTxHash",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "BlockchainStatus",
                table: "Certificates");
        }
    }
}
