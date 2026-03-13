using System.Net.Mime;
using System.Text.Json;
using SkillMatrix.Application.Common.Exceptions;

namespace SkillMatrix.Api.Middleware;

public sealed class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await WriteErrorAsync(context, ex);
        }
    }

    private async Task WriteErrorAsync(HttpContext context, Exception ex)
    {
        var correlationId = context.Items.TryGetValue(CorrelationIdMiddleware.ItemKey, out var cid) ? cid?.ToString() : null;

        var (statusCode, code, message) = ex switch
        {
            AppException appEx => (MapStatus(appEx), appEx.Code, appEx.Message),
            _ => (StatusCodes.Status500InternalServerError, "internal_error", "An unexpected error occurred."),
        };

        if (statusCode >= 500)
        {
            logger.LogError(ex, "Unhandled exception (correlationId={CorrelationId})", correlationId);
        }
        else
        {
            logger.LogInformation(ex, "Request failed with {StatusCode} (correlationId={CorrelationId})", statusCode, correlationId);
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = MediaTypeNames.Application.Json;

        var body = new
        {
            correlationId,
            error = new
            {
                code,
                message,
            }
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOptions));
    }

    private static int MapStatus(AppException ex) =>
        ex switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            ForbiddenException => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status400BadRequest,
        };
}

