using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class ValidationRequestConfiguration : IEntityTypeConfiguration<ValidationRequest>
{
    public void Configure(EntityTypeBuilder<ValidationRequest> builder)
    {
        builder.ToTable("validation_requests");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.EmployeeSkillId).HasColumnName("employee_skill_id").IsRequired();
        builder.Property(x => x.RequestedByEmployeeId).HasColumnName("requested_by_employee_id").HasMaxLength(128).IsRequired();

        builder.Property(x => x.RequestedProficiencyCode)
            .HasColumnName("requested_proficiency_code")
            .HasConversion(v => v.ToString(), v => Enum.Parse<ProficiencyCode>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(v => v.ToString(), v => Enum.Parse<ValidationRequestStatus>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.SubmittedAtUtc).HasColumnName("submitted_at_utc").IsRequired();
        builder.Property(x => x.DecidedAtUtc).HasColumnName("decided_at_utc");
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();
        builder.Property(x => x.UpdatedAtUtc).HasColumnName("updated_at_utc").IsRequired();

        builder.HasIndex(x => new { x.Status, x.SubmittedAtUtc });
        builder.HasIndex(x => x.EmployeeSkillId);
    }
}

