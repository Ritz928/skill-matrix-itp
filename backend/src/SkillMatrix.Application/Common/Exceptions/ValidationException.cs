namespace SkillMatrix.Application.Common.Exceptions;

public sealed class ValidationException(string message) : AppException("validation_error", message);

