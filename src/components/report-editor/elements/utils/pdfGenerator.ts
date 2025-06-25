import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ReportElement } from "../types";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const drawChartOnCanvas = (
  element: ReportElement,
  canvas: HTMLCanvasElement
): void => {
  const { chartType = "bar", data = [] } = element.content;
  const ctx = canvas.getContext("2d");
  if (!ctx || data.length === 0) return;

  const { width, height } = canvas;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Clear canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Draw based on chart type
  switch (chartType) {
    case "bar":
      drawBarChart(ctx, data, padding, chartWidth, chartHeight);
      break;
    case "line":
      drawLineChart(ctx, data, padding, chartWidth, chartHeight);
      break;
    case "pie":
      drawPieChart(
        ctx,
        data,
        width / 2,
        height / 2,
        Math.min(chartWidth, chartHeight) / 2 - 20
      );
      break;
  }
};

const drawBarChart = (
  ctx: CanvasRenderingContext2D,
  data: any[],
  padding: number,
  width: number,
  height: number
) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = (width / data.length) * 0.8;
  const barSpacing = (width / data.length) * 0.2;

  ctx.fillStyle = "#3b82f6";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * height;
    const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
    const y = padding + height - barHeight;

    // Draw bar
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw label
    ctx.fillStyle = "#374151";
    ctx.fillText(item.name, x + barWidth / 2, padding + height + 20);
    ctx.fillStyle = "#3b82f6";
  });
};

const drawLineChart = (
  ctx: CanvasRenderingContext2D,
  data: any[],
  padding: number,
  width: number,
  height: number
) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const stepX = width / (data.length - 1);

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((item, index) => {
    const x = padding + index * stepX;
    const y = padding + height - (item.value / maxValue) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    // Draw point
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.stroke();

  // Draw labels
  ctx.fillStyle = "#374151";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  data.forEach((item, index) => {
    const x = padding + index * stepX;
    ctx.fillText(item.name, x, padding + height + 20);
  });
};

const drawPieChart = (
  ctx: CanvasRenderingContext2D,
  data: any[],
  centerX: number,
  centerY: number,
  radius: number
) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;

  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    // Draw slice
    ctx.fillStyle = COLORS[index % COLORS.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${item.name}: ${item.value}`, labelX, labelY);

    currentAngle += sliceAngle;
  });
};

const renderChartToCanvas = async (element: ReportElement): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = element.size.width;
  canvas.height = element.size.height;

  drawChartOnCanvas(element, canvas);

  return canvas.toDataURL("image/png");
};

export const generatePDF = async (elements: ReportElement[]) => {
  // Create a temporary container to render elements for PDF generation
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "794px"; // A4 width in pixels at 96 DPI
  container.style.height = "1123px"; // A4 height in pixels at 96 DPI
  container.style.backgroundColor = "white";
  document.body.appendChild(container);

  // Pre-render charts and store their images
  const chartImages: { [key: string]: string } = {};
  for (const element of elements) {
    if (element.type === "chart") {
      try {
        chartImages[element.id] = await renderChartToCanvas(element);
      } catch (error) {
        console.error("Error rendering chart:", error);
        // Fallback to placeholder
        chartImages[element.id] = "";
      }
    }
  }

  // Render each element in the container
  elements.forEach((element) => {
    const elementDiv = document.createElement("div");
    elementDiv.style.position = "absolute";
    elementDiv.style.left = `${element.position.x}px`;
    elementDiv.style.top = `${element.position.y}px`;
    elementDiv.style.width = `${element.size.width}px`;
    elementDiv.style.height = `${element.size.height}px`;
    elementDiv.style.backgroundColor = element.style.backgroundColor || "white";
    elementDiv.style.borderColor = element.style.borderColor || "#e5e7eb";
    elementDiv.style.borderWidth = `${element.style.borderWidth || 1}px`;
    elementDiv.style.borderStyle = "solid";
    elementDiv.style.borderRadius = `${element.style.borderRadius || 0}px`;
    elementDiv.style.padding = `${element.style.padding || 16}px`;

    // Render content based on element type
    if (element.type === "text") {
      elementDiv.innerHTML = `<div style="color: ${
        element.style.color || "#1f2937"
      }; font-size: ${element.content.fontSize || 16}px; font-weight: ${
        element.content.fontWeight || "normal"
      };">${element.content.text || "Text"}</div>`;
    } else if (element.type === "table") {
      const { headers = [], rows = [] } = element.content;
      let tableHTML =
        '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">';

      if (headers.length > 0) {
        tableHTML += '<thead><tr style="background-color: #f9fafb;">';
        headers.forEach((header: string) => {
          tableHTML += `<th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">${header}</th>`;
        });
        tableHTML += "</tr></thead>";
      }

      tableHTML += "<tbody>";
      rows.forEach((row: string[]) => {
        tableHTML += "<tr>";
        row.forEach((cell: string) => {
          tableHTML += `<td style="border: 1px solid #e5e7eb; padding: 8px;">${cell}</td>`;
        });
        tableHTML += "</tr>";
      });
      tableHTML += "</tbody></table>";

      elementDiv.innerHTML = tableHTML;
    } else if (element.type === "chart") {
      // Use the pre-rendered chart image if available
      if (chartImages[element.id]) {
        const img = document.createElement("img");
        img.src = chartImages[element.id];
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        elementDiv.appendChild(img);
      } else {
        // Fallback to placeholder text
        elementDiv.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280; font-size: 14px;">Chart: ${
          element.content.chartType || "bar"
        } chart with ${element.content.data?.length || 0} data points</div>`;
      }
    }

    container.appendChild(elementDiv);
  });

  try {
    // Convert the container to canvas
    const canvas = await html2canvas(container, {
      width: 794,
      height: 1123,
      scale: 2, // Higher quality
      backgroundColor: "white",
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [794, 1123],
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);

    // Save the PDF
    pdf.save("report.pdf");
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};
