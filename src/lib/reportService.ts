import { ReportElement } from "@/components/report-editor/types";
import { generateUniqueSlug } from "./utils";

export interface Report {
  id: string;
  slug: string;
  name: string;
  description?: string;
  elements: ReportElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportMetadata {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

class ReportService {
  private dataDir = "/data/reports";

  async saveReport(
    report: Omit<Report, "id" | "slug" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  ): Promise<Report> {
    const now = new Date();
    const id = report.id || `report-${Date.now()}`;
    const slug = generateUniqueSlug(report.name, await this.getExistingSlugs());

    const fullReport: Report = {
      ...report,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate saving to localStorage
      const reports = this.getReportsFromStorage();
      const existingIndex = reports.findIndex((r) => r.id === id);

      if (existingIndex >= 0) {
        reports[existingIndex] = {
          ...fullReport,
          createdAt: reports[existingIndex].createdAt,
        };
      } else {
        reports.push(fullReport);
      }

      this.saveReportsToStorage(reports);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      return fullReport;
    } catch (error) {
      console.error("Error saving report:", error);
      throw new Error("Failed to save report");
    }
  }

  async loadReport(slug: string): Promise<Report | null> {
    try {
      const reports = this.getReportsFromStorage();
      const report = reports.find((r) => r.slug === slug);

      if (!report) return null;

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      return report;
    } catch (error) {
      console.error("Error loading report:", error);
      throw new Error("Failed to load report");
    }
  }

  async getAllReports(): Promise<ReportMetadata[]> {
    try {
      const reports = this.getReportsFromStorage();

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      return reports.map(({ elements, ...metadata }) => metadata);
    } catch (error) {
      console.error("Error loading reports:", error);
      throw new Error("Failed to load reports");
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const reports = this.getReportsFromStorage();
      const filteredReports = reports.filter((r) => r.id !== id);
      this.saveReportsToStorage(filteredReports);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error deleting report:", error);
      throw new Error("Failed to delete report");
    }
  }

  private async getExistingSlugs(): Promise<string[]> {
    const reports = this.getReportsFromStorage();
    return reports.map((r) => r.slug);
  }

  private getReportsFromStorage(): Report[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("reporthub-reports");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading from storage:", error);
      return [];
    }
  }

  private saveReportsToStorage(reports: Report[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        "reporthub-reports",
        JSON.stringify(reports, null, 2)
      );
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  // For development: Initialize with some sample data
  initializeSampleData(): void {
    if (typeof window === "undefined") return;

    const existing = this.getReportsFromStorage();
    if (existing.length > 0) return; // Don't overwrite existing data

    const sampleReports: Report[] = [
      {
        id: "1",
        slug: "q4-sales-report",
        name: "Q4 Sales Report",
        description: "Quarterly sales analysis and projections",
        elements: [],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
      },
      {
        id: "2",
        slug: "marketing-campaign-results",
        name: "Marketing Campaign Results",
        description: "Analysis of recent marketing initiatives",
        elements: [],
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18"),
      },
      {
        id: "3",
        slug: "customer-feedback-summary",
        name: "Customer Feedback Summary",
        description: "Compilation of customer surveys and feedback",
        elements: [],
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-12"),
      },
    ];

    this.saveReportsToStorage(sampleReports);
  }
}

export const reportService = new ReportService();
