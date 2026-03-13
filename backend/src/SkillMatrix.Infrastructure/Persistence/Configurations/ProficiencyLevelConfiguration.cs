using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class ProficiencyLevelConfiguration : IEntityTypeConfiguration<ProficiencyLevel>
{
    public void Configure(EntityTypeBuilder<ProficiencyLevel> builder)
    {
        builder.ToTable("proficiency_levels");

        builder.HasKey(x => x.Code);

        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(32).IsRequired();
        builder.Property(x => x.DisplayName).HasColumnName("display_name").HasMaxLength(64).IsRequired();
        builder.Property(x => x.Description).HasColumnName("description").HasColumnType("longtext").IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").IsRequired();
    }
}

