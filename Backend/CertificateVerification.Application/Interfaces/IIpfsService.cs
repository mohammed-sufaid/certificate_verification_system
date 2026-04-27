using System.Threading.Tasks;

namespace CertificateVerification.Application.Interfaces;

public interface IIpfsService
{
    Task<string> UploadFileAsync(byte[] fileData);
    Task<byte[]> GetFileAsync(string cid);
}
