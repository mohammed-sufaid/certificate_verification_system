# Backend Setup Instructions

Before running the backend, please execute the following from the root of `CertificateVerification.API`:

1. Add Nuget packages (if not already handled by IDE or automated restore):
```bash
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore
```

2. Make sure your local SQL Server instance matches the `appsettings.json` connection string.
3. Run the SQL script from Phase 1 (`Database/database_schema.sql`) inside SQL Server Management Studio or Azure Data Studio.
4. Start the application:
```bash
dotnet run
```
