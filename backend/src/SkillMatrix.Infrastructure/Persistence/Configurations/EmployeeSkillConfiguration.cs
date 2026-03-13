using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Employees;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class EmployeeSkillConfiguration : IEntityTypeConfiguration<EmployeeSkill>
{
    public void Configure(EntityTypeBuilder<EmployeeSkill> builder)
    {
        builder.ToTable("employee_skills");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.EmployeeId).HasColumnName("employee_id").HasMaxLength(128).IsRequired();
        builder.Property(x => x.SkillId).HasColumnName("skill_id").IsRequired();

        builder.Property(x => x.ActiveProficiencyCode)
            .HasColumnName("active_proficiency_code")
            .HasConversion(
                v => v.ToString(),
                v => Enum.Parse<ProficiencyCode>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.ValidationStatus)
            .HasColumnName("validation_status")
            .HasConversion(
                v => v.Value,
                v => ValidationStatus.From(v))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.LastValidatedAtUtc).HasColumnName("last_validated_at_utc");
        builder.Property(x => x.ValidationExpiresAtUtc).HasColumnName("validation_expires_at_utc");

        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();
        builder.Property(x => x.UpdatedAtUtc).HasColumnName("updated_at_utc").IsRequired();

        builder.HasMany(x => x.Evidence)
            .WithOne()
            .HasForeignKey(e => e.EmployeeSkillId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.EmployeeId, x.SkillId }).IsUnique();
    }
}

