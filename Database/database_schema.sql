-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'CertificateVerificationDB')
BEGIN
    CREATE DATABASE CertificateVerificationDB;
END
GO

USE CertificateVerificationDB;
GO

-- Roles Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        RoleName NVARCHAR(50) NOT NULL UNIQUE
    );
END
GO

-- Organizations Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Organizations' AND xtype='U')
BEGIN
    CREATE TABLE Organizations (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Address NVARCHAR(500),
        Email NVARCHAR(100),
        Phone NVARCHAR(20),
        LogoPath NVARCHAR(500),
        IsActive BIT DEFAULT 1
    );
END
GO

-- Users Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        RoleId INT NOT NULL FOREIGN KEY REFERENCES Roles(Id),
        OrganizationId INT NULL FOREIGN KEY REFERENCES Organizations(Id),
        IsActive BIT DEFAULT 1,
        CreatedDate DATETIME2 DEFAULT GETUTCDATE()
    );
END
GO

-- Certificates Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Certificates' AND xtype='U')
BEGIN
    CREATE TABLE Certificates (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CertificateNumber NVARCHAR(100) NOT NULL UNIQUE,
        CandidateName NVARCHAR(150) NOT NULL,
        CourseName NVARCHAR(200) NOT NULL,
        Grade NVARCHAR(50),
        IssueDate DATETIME2 NOT NULL,
        ExpiryDate DATETIME2 NULL,
        OrganizationId INT NOT NULL FOREIGN KEY REFERENCES Organizations(Id),
        FilePath NVARCHAR(500),
        PreviousHash NVARCHAR(100) NOT NULL,
        CurrentHash NVARCHAR(100) NOT NULL,
        QRCodePath NVARCHAR(500),
        Status NVARCHAR(50) DEFAULT 'Active', -- Active / Revoked
        CreatedBy INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
        CreatedDate DATETIME2 DEFAULT GETUTCDATE()
    );
END
GO

-- Audit Logs Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AuditLogs' AND xtype='U')
BEGIN
    CREATE TABLE AuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Action NVARCHAR(100) NOT NULL,
        UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
        TableName NVARCHAR(100) NOT NULL,
        RecordId INT NOT NULL,
        CreatedDate DATETIME2 DEFAULT GETUTCDATE()
    );
END
GO

-- Insert Seed Data (Roles)
IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'Admin')
BEGIN
    INSERT INTO Roles (RoleName) VALUES ('Admin');
END

IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'Organization')
BEGIN
    INSERT INTO Roles (RoleName) VALUES ('Organization');
END
GO

-- Insert Seed Admin User (Password is 'Admin@123' hashed using BCrypt: $2a$11$D7.o.e6Bv5l8L6JbH4u/yOW2Lq0lIEYnI2wGgOvxm4UeR/e.Q2G8W)
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@certificateapi.com')
BEGIN
    DECLARE @AdminRoleId INT = (SELECT Id FROM Roles WHERE RoleName = 'Admin');
    INSERT INTO Users (FullName, Email, PasswordHash, RoleId, IsActive, CreatedDate) 
    VALUES ('Super Admin', 'admin@certificateapi.com', '$2a$11$D7.o.e6Bv5l8L6JbH4u/yOW2Lq0lIEYnI2wGgOvxm4UeR/e.Q2G8W', @AdminRoleId, 1, GETUTCDATE());
END
GO

-- Indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Certificates_CertificateNumber' AND object_id = OBJECT_ID('Certificates'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Certificates_CertificateNumber ON Certificates(CertificateNumber);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
END
GO
