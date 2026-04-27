/*
 Navicat Premium Dump SQL

 Source Server         : CertificateVerificationDB
 Source Server Type    : SQL Server
 Source Server Version : 15002000 (15.00.2000)
 Source Host           : localhost:1433
 Source Catalog        : CertificateVerificationDB
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 15002000 (15.00.2000)
 File Encoding         : 65001

 Date: 27/04/2026 11:42:04
*/


-- ----------------------------
-- Table structure for __EFMigrationsHistory
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]') AND type IN ('U'))
	DROP TABLE [dbo].[__EFMigrationsHistory]
GO

CREATE TABLE [dbo].[__EFMigrationsHistory] (
  [MigrationId] nvarchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [ProductVersion] nvarchar(32) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[__EFMigrationsHistory] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of __EFMigrationsHistory
-- ----------------------------
BEGIN TRANSACTION
GO

COMMIT
GO


-- ----------------------------
-- Table structure for AuditLogs
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLogs]') AND type IN ('U'))
	DROP TABLE [dbo].[AuditLogs]
GO

CREATE TABLE [dbo].[AuditLogs] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Action] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [UserId] int  NOT NULL,
  [TableName] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [RecordId] int  NOT NULL,
  [CreatedDate] datetime2(7) DEFAULT getutcdate() NULL
)
GO

ALTER TABLE [dbo].[AuditLogs] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of AuditLogs
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[AuditLogs] ON
GO

INSERT INTO [dbo].[AuditLogs] ([Id], [Action], [UserId], [TableName], [RecordId], [CreatedDate]) VALUES (N'2', N'Create Certificate', N'4', N'Certificates', N'0', N'2026-04-25 06:05:46.7974650')
GO

INSERT INTO [dbo].[AuditLogs] ([Id], [Action], [UserId], [TableName], [RecordId], [CreatedDate]) VALUES (N'3', N'Create Certificate', N'4', N'Certificates', N'0', N'2026-04-25 07:27:22.6402195')
GO

SET IDENTITY_INSERT [dbo].[AuditLogs] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Certificates
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Certificates]') AND type IN ('U'))
	DROP TABLE [dbo].[Certificates]
GO

CREATE TABLE [dbo].[Certificates] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [CertificateNumber] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [CandidateName] nvarchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [CourseName] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [Grade] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [IssueDate] datetime2(7)  NOT NULL,
  [ExpiryDate] datetime2(7)  NULL,
  [OrganizationId] int  NOT NULL,
  [FilePath] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [PreviousHash] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [CurrentHash] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [QRCodePath] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [Status] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS DEFAULT 'Active' NULL,
  [CreatedBy] int  NOT NULL,
  [CreatedDate] datetime2(7) DEFAULT getutcdate() NULL
)
GO

ALTER TABLE [dbo].[Certificates] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Certificates
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Certificates] ON
GO

INSERT INTO [dbo].[Certificates] ([Id], [CertificateNumber], [CandidateName], [CourseName], [Grade], [IssueDate], [ExpiryDate], [OrganizationId], [FilePath], [PreviousHash], [CurrentHash], [QRCodePath], [Status], [CreatedBy], [CreatedDate]) VALUES (N'2', N'CERT-00001', N'Sufaaid', N'tech -ENGG', N'A+', N'2026-05-02 00:00:00.0000000', N'2026-10-10 00:00:00.0000000', N'2', NULL, N'GENESIS', N'dbdd0da86b53235c1ef0762b73965257fab59d4aa6b827e7645cfaad00681a20', NULL, N'Active', N'4', N'2026-04-25 06:05:46.7947968')
GO

INSERT INTO [dbo].[Certificates] ([Id], [CertificateNumber], [CandidateName], [CourseName], [Grade], [IssueDate], [ExpiryDate], [OrganizationId], [FilePath], [PreviousHash], [CurrentHash], [QRCodePath], [Status], [CreatedBy], [CreatedDate]) VALUES (N'3', N'AA-000001', N'sufaid', N'ss', N'A+', N'2026-04-25 00:00:00.0000000', NULL, N'2', NULL, N'dbdd0da86b53235c1ef0762b73965257fab59d4aa6b827e7645cfaad00681a20', N'367786df3ae40bea23e2d45bcffa0fd864e943429fa0ab1b69cc42b93eb36224', NULL, N'Active', N'4', N'2026-04-25 07:27:22.6385663')
GO

SET IDENTITY_INSERT [dbo].[Certificates] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Organizations
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Organizations]') AND type IN ('U'))
	DROP TABLE [dbo].[Organizations]
GO

CREATE TABLE [dbo].[Organizations] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [Name] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [Address] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [Email] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [Phone] nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [LogoPath] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS  NULL,
  [IsActive] bit DEFAULT 1 NULL
)
GO

ALTER TABLE [dbo].[Organizations] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Organizations
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Organizations] ON
GO

INSERT INTO [dbo].[Organizations] ([Id], [Name], [Address], [Email], [Phone], [LogoPath], [IsActive]) VALUES (N'2', N'3D Solutions', N'58, Arumuganagar , KNG Pudur , G N Mills (Po)', N'info@elcodamics.com', N'+919856412524', NULL, N'1')
GO

SET IDENTITY_INSERT [dbo].[Organizations] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Roles
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type IN ('U'))
	DROP TABLE [dbo].[Roles]
GO

CREATE TABLE [dbo].[Roles] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [RoleName] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL
)
GO

ALTER TABLE [dbo].[Roles] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Roles
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Roles] ON
GO

INSERT INTO [dbo].[Roles] ([Id], [RoleName]) VALUES (N'1', N'Admin')
GO

INSERT INTO [dbo].[Roles] ([Id], [RoleName]) VALUES (N'2', N'Organization')
GO

SET IDENTITY_INSERT [dbo].[Roles] OFF
GO

COMMIT
GO


-- ----------------------------
-- Table structure for Users
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type IN ('U'))
	DROP TABLE [dbo].[Users]
GO

CREATE TABLE [dbo].[Users] (
  [Id] int  IDENTITY(1,1) NOT NULL,
  [FullName] nvarchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [Email] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [PasswordHash] nvarchar(max) COLLATE SQL_Latin1_General_CP1_CI_AS  NOT NULL,
  [RoleId] int  NOT NULL,
  [OrganizationId] int  NULL,
  [IsActive] bit DEFAULT 1 NULL,
  [CreatedDate] datetime2(7) DEFAULT getutcdate() NULL
)
GO

ALTER TABLE [dbo].[Users] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN TRANSACTION
GO

SET IDENTITY_INSERT [dbo].[Users] ON
GO

INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [RoleId], [OrganizationId], [IsActive], [CreatedDate]) VALUES (N'4', N'Test User', N'sample@gmail.com', N'$2a$11$kH9X25eqGLMZ7XroTFsqlOxcHUPGvM3krQmhMWKe0UhwA1gbZpXg.', N'1', NULL, N'1', N'2026-04-21 08:45:11.8370255')
GO

SET IDENTITY_INSERT [dbo].[Users] OFF
GO

COMMIT
GO


-- ----------------------------
-- Primary Key structure for table __EFMigrationsHistory
-- ----------------------------
ALTER TABLE [dbo].[__EFMigrationsHistory] ADD CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for AuditLogs
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[AuditLogs]', RESEED, 3)
GO


-- ----------------------------
-- Primary Key structure for table AuditLogs
-- ----------------------------
ALTER TABLE [dbo].[AuditLogs] ADD CONSTRAINT [PK__AuditLog__3214EC0788F6D40C] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Certificates
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Certificates]', RESEED, 3)
GO


-- ----------------------------
-- Indexes structure for table Certificates
-- ----------------------------
CREATE NONCLUSTERED INDEX [IX_Certificates_CertificateNumber]
ON [dbo].[Certificates] (
  [CertificateNumber] ASC
)
GO


-- ----------------------------
-- Uniques structure for table Certificates
-- ----------------------------
ALTER TABLE [dbo].[Certificates] ADD CONSTRAINT [UQ__Certific__E384CE0F6CD7BC15] UNIQUE NONCLUSTERED ([CertificateNumber] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Certificates
-- ----------------------------
ALTER TABLE [dbo].[Certificates] ADD CONSTRAINT [PK__Certific__3214EC075DC37EB2] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Organizations
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Organizations]', RESEED, 2)
GO


-- ----------------------------
-- Primary Key structure for table Organizations
-- ----------------------------
ALTER TABLE [dbo].[Organizations] ADD CONSTRAINT [PK__Organiza__3214EC07BBCC77BD] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Roles
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Roles]', RESEED, 1001)
GO


-- ----------------------------
-- Uniques structure for table Roles
-- ----------------------------
ALTER TABLE [dbo].[Roles] ADD CONSTRAINT [UQ__Roles__8A2B61601B0287F5] UNIQUE NONCLUSTERED ([RoleName] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Roles
-- ----------------------------
ALTER TABLE [dbo].[Roles] ADD CONSTRAINT [PK__Roles__3214EC07C6025E7E] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Auto increment value for Users
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[Users]', RESEED, 1001)
GO


-- ----------------------------
-- Indexes structure for table Users
-- ----------------------------
CREATE NONCLUSTERED INDEX [IX_Users_Email]
ON [dbo].[Users] (
  [Email] ASC
)
GO


-- ----------------------------
-- Uniques structure for table Users
-- ----------------------------
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [UQ__Users__A9D10534634419AC] UNIQUE NONCLUSTERED ([Email] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK__Users__3214EC07F3E46DCC] PRIMARY KEY CLUSTERED ([Id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Foreign Keys structure for table AuditLogs
-- ----------------------------
ALTER TABLE [dbo].[AuditLogs] ADD CONSTRAINT [FK__AuditLogs__UserI__4AB81AF0] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO


-- ----------------------------
-- Foreign Keys structure for table Certificates
-- ----------------------------
ALTER TABLE [dbo].[Certificates] ADD CONSTRAINT [FK__Certifica__Organ__44FF419A] FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[Organizations] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

ALTER TABLE [dbo].[Certificates] ADD CONSTRAINT [FK__Certifica__Creat__46E78A0C] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Users] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO


-- ----------------------------
-- Foreign Keys structure for table Users
-- ----------------------------
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [FK__Users__RoleId__3E52440B] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

ALTER TABLE [dbo].[Users] ADD CONSTRAINT [FK__Users__Organizat__3F466844] FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[Organizations] ([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

