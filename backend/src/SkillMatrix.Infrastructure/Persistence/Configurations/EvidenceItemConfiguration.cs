using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Evidence;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class EvidenceItemConfiguration : IEntityTypeConfiguration<EvidenceItem>
{
    public void Configure(EntityTypeBuilder<EvidenceItem> builder)
    {
        builder.ToTable("evidence_items");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(x => x.EmployeeSkillId).HasColumnName("employee_skill_id").IsRequired();

        builder.Property(x => x.Type)
            .HasColumnName("type")
            .HasConversion(v => v.ToString(), v => Enum.Parse<EvidenceType>(v, true))
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(x => x.ExternalRef).HasColumnName("external_ref").HasMaxLength(256);
        builder.Property(x => x.FileRef).HasColumnName("file_ref").HasMaxLength(512);
        builder.Property(x => x.MetadataJson).HasColumnName("metadata_json").HasColumnType("longtext");
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();

        builder.HasIndex(x => x.EmployeeSkillId);
    }
}

