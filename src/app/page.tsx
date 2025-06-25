"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data - in a real app, this would come from an API or database
const mockReports: Report[] = [
  {
    id: "1",
    name: "Q4 Sales Report",
    description: "Quarterly sales analysis and projections",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Marketing Campaign Results",
    description: "Analysis of recent marketing initiatives",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Customer Feedback Summary",
    description: "Compilation of customer surveys and feedback",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
];

export default function Home() {
  const [reports] = useState<Report[]>(mockReports);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ReportHub</h1>
              <p className="text-gray-600 mt-2">
                Create and manage your reports
              </p>
            </div>
            <Link href="/editor">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      reports.filter(
                        (r) => r.createdAt.getMonth() === new Date().getMonth()
                      ).length
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recently Updated
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      reports.filter((r) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return r.updatedAt > weekAgo;
                      }).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Reports
          </h2>
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reports yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first report to get started
                </p>
                <Link href="/editor">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Link href={`/editor/${report.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {report.name}
                          </CardTitle>
                          {report.description && (
                            <CardDescription className="mt-2">
                              {report.description}
                            </CardDescription>
                          )}
                        </div>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created: {formatDate(report.createdAt)}</span>
                        <span>Updated: {formatDate(report.updatedAt)}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/editor">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Report
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Import Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
