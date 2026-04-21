using System.Security.Cryptography;
using System.Text;

namespace CertificateVerification.Application.Helpers;

public static class BlockchainHashHelper
{
    public static string GenerateHash(string certificateNumber, string candidateName, string courseName, DateTime issueDate, string previousHash)
    {
        string rawData = $"{certificateNumber}{candidateName}{courseName}{issueDate.ToString("o")}{previousHash}";
        
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
