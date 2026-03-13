namespace SkillMatrix.Infrastructure.Files;

public sealed class EvidenceFileStore
{
    private readonly string _basePath;

    public EvidenceFileStore(string basePath)
    {
        _basePath = basePath;
    }

    public async Task<string> SaveAsync(Stream content, string fileName, CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(_basePath);

        var safeName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var fullPath = Path.Combine(_basePath, safeName);

        await using var file = File.Create(fullPath);
        await content.CopyToAsync(file, cancellationToken);

        return safeName;
    }

    public string GetFullPath(string fileRef) => Path.Combine(_basePath, fileRef);
}

