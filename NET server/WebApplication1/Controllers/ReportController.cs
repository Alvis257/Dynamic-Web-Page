using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebApplication1.Classes;
using DGSService.Service;

[ApiController]
[Route("[controller]")]
public class DocumentController : ControllerBase
{
    private readonly ILogger<DocumentController> _logger;
    private readonly ReportService _reportService;
    public DocumentController(ILogger<DocumentController> logger, ReportService reportService)
    {
        _logger = logger;
        _reportService = reportService;
    }

    [HttpPost("GenerateDocument")]
    public async Task<IActionResult> GenerateDocument([FromBody] DocumentRequest request)
    {
        try
        {
            var data = JsonSerializer.Deserialize<Dictionary<string, object>>(request.Data);

            if (data != null)
            {
                var documentBytes = _reportService.GenerateDocumentFromTemplate($"Aspose/{request.FilePath}", data, request.Type.ToLower() == "pdf");

                return File(documentBytes, "application/octet-stream", $"output.{request.Type}");
            }
            else
            {
                return BadRequest("The data parameter cannot be null or malformed.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while generating the document.");
            return StatusCode(500, "An error occurred while generating the document.");
        }
    }

}

