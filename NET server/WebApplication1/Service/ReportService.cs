using Aspose.Words.Reporting;
using Aspose.Words;
using System.Text.Json.Nodes;
using System.Text.Json;

namespace DGSService.Service
{
    public class ReportService
    {
        public byte[] GenerateDocumentFromTemplate(string templatePath, object jsonData, bool outputToPDF)
        {
            if (string.IsNullOrEmpty(templatePath) || !File.Exists(templatePath))
            {
                throw new FileNotFoundException("The template file could not be found.", templatePath);
            }

            Document doc = new Document(templatePath);
            ReportingEngine engine = new ReportingEngine();

            engine.BuildReport(doc, jsonData);

            using (MemoryStream ms = new MemoryStream())
            {
                if (outputToPDF)
                {
                    doc.Save(ms, SaveFormat.Pdf);
                }
                else
                {
                    doc.Save(ms, SaveFormat.Docx);
                }

                return ms.ToArray();
            }
        }
    }
}
