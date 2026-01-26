import { useRef } from "react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const primaryColors = [
  { name: "Primary", light: "#006699", dark: "#0099E6", hsl: "203 100% 30%", usage: "Main brand color, CTAs, buttons, links" },
  { name: "Primary Foreground", light: "#FFFFFF", dark: "#FFFFFF", hsl: "0 0% 100%", usage: "Text on primary backgrounds" },
];

const heroGradient = {
  from: { light: "#006699", dark: "#0099E6" },
  to: { light: "#1A2744", dark: "#1A3A66" },
  usage: "Hero sections, feature backgrounds",
};

const neutralColors = [
  { name: "Background", light: "#FFFFFF", dark: "#131316", usage: "Page backgrounds" },
  { name: "Foreground", light: "#18181B", dark: "#FAFAFA", usage: "Primary text" },
  { name: "Muted", light: "#EFEFEF", dark: "#242428", usage: "Subtle backgrounds, dividers" },
  { name: "Muted Foreground", light: "#595959", dark: "#A6A6A6", usage: "Secondary text, placeholders" },
  { name: "Card", light: "#FAFAFA", dark: "#19191C", usage: "Card backgrounds" },
  { name: "Border", light: "#E0E0E3", dark: "#2E2E33", usage: "Borders, separators" },
];

const accentColors = [
  { name: "Success", hex: "#188754", usage: "Success states, confirmations" },
  { name: "Destructive", hex: "#E11D27", usage: "Errors, warnings, delete actions" },
  { name: "Accent", light: "#EBEBED", dark: "#28282D", usage: "Hover states, highlights" },
];

const ColorSwatch = ({ color, name, usage }: { color: string; name: string; usage?: string }) => (
  <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-card">
    <div
      className="w-16 h-16 rounded-md border border-border shadow-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground">{name}</p>
      <p className="font-mono text-sm text-muted-foreground">{color}</p>
      {usage && <p className="text-xs text-muted-foreground mt-1">{usage}</p>}
    </div>
  </div>
);

const GradientSwatch = ({ from, to, name }: { from: string; to: string; name: string }) => (
  <div
    className="w-full h-24 rounded-lg shadow-sm"
    style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
  >
    <div className="h-full flex items-end p-4">
      <span className="text-white font-semibold text-sm drop-shadow-md">{name}</span>
    </div>
  </div>
);

export default function BrandGuide() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    // Handle multi-page PDF if content is long
    const pageHeight = pdfHeight;
    const contentHeight = (imgHeight * ratio);
    let position = 0;

    if (contentHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    } else {
      let heightLeft = contentHeight;
      let pageNum = 0;

      while (heightLeft > 0) {
        if (pageNum > 0) {
          pdf.addPage();
        }
        
        const sourceY = pageNum * (imgHeight * (pageHeight / contentHeight));
        const sourceHeight = Math.min(imgHeight * (pageHeight / contentHeight), imgHeight - sourceY);
        
        pdf.addImage(
          imgData, 
          "PNG", 
          imgX, 
          0, 
          imgWidth * ratio, 
          imgHeight * ratio,
          undefined,
          "FAST",
          0
        );
        
        heightLeft -= pageHeight;
        pageNum++;
        
        if (pageNum > 5) break; // Safety limit
      }
    }

    pdf.save("VonAI-Brand-Guide.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Download Button - Fixed */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border py-4">
        <div className="container-padding mx-auto max-w-4xl flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">VonAI Brand Guide</h1>
          <Button onClick={handleDownloadPDF} variant="cta">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Brand Guide Content */}
      <div ref={contentRef} className="bg-white text-gray-900 p-8 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 pb-8 border-b border-gray-200">
            <img src={logoDark} alt="VonAI" className="h-12 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900">Brand Guidelines</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Official brand colors, typography, and usage guidelines for VonAI visual identity.
            </p>
          </div>

          {/* Logo Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Logo</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                <img src={logoDark} alt="VonAI Dark Logo" className="h-10" />
              </div>
              <div className="p-8 bg-gray-900 rounded-xl flex items-center justify-center">
                <img src={logoLight} alt="VonAI Light Logo" className="h-10" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Use the dark logo on light backgrounds and the light logo on dark backgrounds for optimal contrast.
            </p>
          </section>

          {/* Primary Colors */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Primary Colors</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {primaryColors.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="w-20 h-20 rounded-lg shadow-md"
                      style={{ backgroundColor: color.light }}
                    />
                    <div
                      className="w-20 h-20 rounded-lg shadow-md"
                      style={{ backgroundColor: color.dark }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{color.name}</p>
                    <p className="font-mono text-sm text-gray-500">Light: {color.light}</p>
                    <p className="font-mono text-sm text-gray-500">Dark: {color.dark}</p>
                    <p className="text-xs text-gray-600 mt-1">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hero Gradient */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Hero Gradient</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div
                  className="h-24 rounded-lg shadow-md"
                  style={{ background: `linear-gradient(135deg, ${heroGradient.from.light} 0%, ${heroGradient.to.light} 100%)` }}
                />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Light Mode:</span> {heroGradient.from.light} → {heroGradient.to.light}
                </p>
              </div>
              <div className="space-y-3">
                <div
                  className="h-24 rounded-lg shadow-md"
                  style={{ background: `linear-gradient(135deg, ${heroGradient.from.dark} 0%, ${heroGradient.to.dark} 100%)` }}
                />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Dark Mode:</span> {heroGradient.from.dark} → {heroGradient.to.dark}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{heroGradient.usage}</p>
          </section>

          {/* Neutral Colors */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Neutral Colors</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Light</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Dark</th>
                    <th className="text-left py-3 pl-4 font-semibold text-gray-900">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {neutralColors.map((color) => (
                    <tr key={color.name} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{color.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: color.light }}
                          />
                          <span className="font-mono text-xs text-gray-500">{color.light}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: color.dark }}
                          />
                          <span className="font-mono text-xs text-gray-500">{color.dark}</span>
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-gray-600">{color.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Accent Colors */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Accent Colors</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {accentColors.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div
                    className="w-full h-16 rounded-lg shadow-md"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{color.name}</p>
                    <p className="font-mono text-sm text-gray-500">{color.hex}</p>
                    <p className="text-xs text-gray-600 mt-1">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Typography</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Primary Font: Inter</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Inter is used for all text across the VonAI brand. It provides excellent readability 
                  and a modern, professional appearance.
                </p>
                <div className="space-y-3 p-6 bg-gray-50 rounded-lg">
                  <p className="text-4xl font-bold text-gray-900">Heading 1 - Bold 36px</p>
                  <p className="text-3xl font-bold text-gray-900">Heading 2 - Bold 30px</p>
                  <p className="text-2xl font-semibold text-gray-900">Heading 3 - Semibold 24px</p>
                  <p className="text-xl font-semibold text-gray-900">Heading 4 - Semibold 20px</p>
                  <p className="text-base text-gray-700">Body text - Regular 16px</p>
                  <p className="text-sm text-gray-600">Small text - Regular 14px</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Font Stack</h3>
                <code className="block p-4 bg-gray-100 rounded-lg text-sm text-gray-800 font-mono">
                  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                </code>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} VonAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
