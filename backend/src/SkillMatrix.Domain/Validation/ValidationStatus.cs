namespace SkillMatrix.Domain.Validation;

public readonly record struct ValidationStatus(string Value)
{
    public static readonly ValidationStatus SelfAssessed = new("SelfAssessed");
    public static readonly ValidationStatus PendingValidation = new("PendingValidation");
    public static readonly ValidationStatus Validated = new("Validated");
    public static readonly ValidationStatus Expired = new("Expired");

    public static ValidationStatus From(string value)
    {
        if (string.Equals(value, SelfAssessed.Value, StringComparison.OrdinalIgnoreCase)) return SelfAssessed;
        if (string.Equals(value, PendingValidation.Value, StringComparison.OrdinalIgnoreCase)) return PendingValidation;
        if (string.Equals(value, Validated.Value, StringComparison.OrdinalIgnoreCase)) return Validated;
        if (string.Equals(value, Expired.Value, StringComparison.OrdinalIgnoreCase)) return Expired;

        throw new ArgumentOutOfRangeException(nameof(value), value, "Unknown validation status.");
    }

    public override string ToString() => Value;
}

