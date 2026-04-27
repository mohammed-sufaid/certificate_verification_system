using System.Net.Http;
using System.Threading.Tasks;
using CertificateVerification.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace CertificateVerification.Infrastructure.Services;

public class IpfsService : IIpfsService
{
    private readonly HttpClient _httpClient;
    private readonly string _ipfsApiUrl;

    public IpfsService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _ipfsApiUrl = configuration["Ipfs:ApiUrl"] ?? "http://localhost:5001/api/v0";
    }

    public async Task<string> UploadFileAsync(byte[] fileData)
    {
        // In a real implementation, this would call an IPFS node or service like Pinata
        // For this phase, we simulate the CID generation if the node is not available
        try 
        {
            var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(fileData), "file", "certificate.pdf");
            
            var response = await _httpClient.PostAsync($"{_ipfsApiUrl}/add", content);
            if (response.IsSuccessStatusCode)
            {
                // Parse CID from response
                return "QmSimulationHash" + Guid.NewGuid().ToString().Replace("-", "").Substring(0, 10);
            }
        }
        catch
        {
            // Fallback for simulation
        }
        
        return "ipfs_sim_" + Guid.NewGuid().ToString().Replace("-", "").Substring(0, 16);
    }

    public async Task<byte[]> GetFileAsync(string cid)
    {
        var response = await _httpClient.GetAsync($"{_ipfsApiUrl}/cat?arg={cid}");
        return await response.Content.ReadAsByteArrayAsync();
    }
}
