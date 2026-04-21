# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy all csproj files and restore as distinct layers
COPY ["CertificateVerification.API/CertificateVerification.API.csproj", "CertificateVerification.API/"]
COPY ["CertificateVerification.Application/CertificateVerification.Application.csproj", "CertificateVerification.Application/"]
COPY ["CertificateVerification.Domain/CertificateVerification.Domain.csproj", "CertificateVerification.Domain/"]
COPY ["CertificateVerification.Infrastructure/CertificateVerification.Infrastructure.csproj", "CertificateVerification.Infrastructure/"]

RUN dotnet restore "./CertificateVerification.API/CertificateVerification.API.csproj"

# Copy remaining source code
COPY . .

WORKDIR "/src/CertificateVerification.API"
RUN dotnet build "./CertificateVerification.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CertificateVerification.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CertificateVerification.API.dll"]
