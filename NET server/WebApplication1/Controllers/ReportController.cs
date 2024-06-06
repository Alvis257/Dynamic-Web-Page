using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebApplication1.Classes;
using DGSService.Service;

[ApiController]
[Route("api/[controller]")]
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

            //var convertedData = new Dictionary<string, object>();
            //foreach (var item in data)
            //{
            //    switch (item.Value.ValueKind)
            //    {
            //        case JsonValueKind.String:
            //            convertedData.Add(item.Key, item.Value.GetString());
            //            break;
            //        case JsonValueKind.Number:
            //            convertedData.Add(item.Key, item.Value.GetDouble()); // or GetInt32(), etc.
            //            break;
            //        case JsonValueKind.True:
            //        case JsonValueKind.False:
            //            convertedData.Add(item.Key, item.Value.GetBoolean());
            //            break;
            //            // handle other types as needed
            //    }
            //}

            //if (convertedData.Count > 0)
            //{
                var documentBytes = _reportService.GenerateDocumentFromTemplate($"Aspose/{request.FilePath}", data, request.Type.ToLower() == "pdf");

                return File(documentBytes, "application/octet-stream", $"output.{request.Type}");
            //}
            //else
            //{
            //    return BadRequest("The data parameter cannot be null or malformed.");
            //}
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while generating the document.");
            return StatusCode(500, "An error occurred while generating the document.");
        }
    }

}

