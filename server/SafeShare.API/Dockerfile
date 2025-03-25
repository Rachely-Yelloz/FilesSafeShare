# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 80
EXPOSE 443
# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SafeShare.API/SafeShare.API.csproj", "SafeShare.API/"]
COPY ["SafeShare.Core/SafeShare.CORE.csproj", "SafeShare.CORE/"]
COPY ["SafeShare.DATA/SafeShare.DATA.csproj", "SafeShare.DATA/"]
COPY ["SafeShare.SERVICE/SafeShare.SERVICE.csproj", "SafeShare.SERVICE/"]

RUN dotnet restore "./SafeShare.API/SafeShare.API.csproj"
COPY . .
WORKDIR "/src/SafeShare.API"
RUN dotnet build "./SafeShare.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SafeShare.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SafeShare.API.dll"]