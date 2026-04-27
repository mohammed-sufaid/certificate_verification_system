using System.Threading.Tasks;

namespace CertificateVerification.Application.Interfaces;

public interface IBlockchainService
{
    Task<string> AnchorHashAsync(string certificateHash);
    Task<string> GetTransactionStatusAsync(string txHash);
}
