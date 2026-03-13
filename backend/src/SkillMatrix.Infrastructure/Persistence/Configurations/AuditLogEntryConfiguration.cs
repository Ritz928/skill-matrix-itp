using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Audit;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class AuditLogEntryConfiguration : IEntityTypeConfiguration<AuditLogEntry>
{
    public void Configure(EntityTypeBuilder<AuditLogEntry> builder)
    {
        builder.ToTable("audit_log_entries");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.ActorEmployeeId).HasColumnName("actor_employee_id").HasMaxLength(128).IsRequired();
        builder.Property(x => x.Action).HasColumnName("action").HasMaxLength(200).IsRequired();
        builder.Property(x => x.ScopeType).HasColumnName("scope_type").HasMaxLength(64);
        builder.Property(x => x.ScopeId).HasColumnName("scope_id").HasMaxLength(128);
        builder.Property(x => x.DetailsJson).HasColumnName("details_json").HasColumnType("longtext");
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();

        builder.HasIndex(x => x.CreatedAtUtc);
        builder.HasIndex(x => x.ActorEmployeeId);
    }
}

