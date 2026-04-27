namespace CertificateVerification.Application.Interfaces;

public interface IPkiService
{
    (string PublicKey, string PrivateKey) GenerateKeyPair();
    string SignData(string data, string privateKey);
    bool VerifySignature(string data, string signature, string publicKey);
}
