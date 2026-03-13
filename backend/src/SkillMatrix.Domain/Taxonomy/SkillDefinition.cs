namespace SkillMatrix.Domain.Taxonomy;

public class SkillDefinition
{
    public long Id { get; set; }

    public long SubcategoryId { get; set; }

    public string Name { get; set; } = "";

    public string Definition { get; set; } = "";

    public int Version { get; set; } = 1;

    public SkillStatus Status { get; set; } = SkillStatus.Active;

    public long? ReplacedBySkillId { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public SkillSubcategory? Subcategory { get; set; }
}

