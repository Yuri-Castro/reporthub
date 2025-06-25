"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { reportService, ReportMetadata } from "@/lib/reportService";

interface Schedule {
  id: string;
  reportId: string;
  reportName: string;
  reportSlug: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  time: string;
  days?: string[];
  customCron?: string;
  isActive: boolean;
  nextRun?: Date;
}

// Mock schedules data
const mockSchedules: Schedule[] = [
  {
    id: "1",
    reportId: "1",
    reportName: "Q4 Sales Report",
    reportSlug: "q4-sales-report",
    frequency: "weekly",
    time: "09:00",
    days: ["monday"],
    isActive: true,
    nextRun: new Date("2024-01-29T09:00:00"),
  },
  {
    id: "2",
    reportId: "2",
    reportName: "Marketing Campaign Results",
    reportSlug: "marketing-campaign-results",
    frequency: "monthly",
    time: "14:00",
    isActive: false,
    nextRun: new Date("2024-02-01T14:00:00"),
  },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [reports, setReports] = useState<ReportMetadata[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [frequency, setFrequency] = useState<
    "daily" | "weekly" | "monthly" | "custom"
  >("weekly");
  const [time, setTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [customCron, setCustomCron] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const reportsData = await reportService.getAllReports();
      setReports(reportsData);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreateSchedule = () => {
    if (!selectedReport) return;

    const report = reports.find((r) => r.id === selectedReport);
    if (!report) return;

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      reportId: selectedReport,
      reportName: report.name,
      reportSlug: report.slug,
      frequency,
      time,
      days: frequency === "weekly" ? selectedDays : undefined,
      customCron: frequency === "custom" ? customCron : undefined,
      isActive: true,
      nextRun: calculateNextRun(),
    };

    setSchedules([...schedules, newSchedule]);
    resetForm();
  };

  const calculateNextRun = (): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);

    switch (frequency) {
      case "daily":
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow;
      case "weekly":
        if (selectedDays.length === 0) return now;
        // Find next occurrence of selected day
        const nextDay = selectedDays[0]; // Simplified logic
        const nextRun = new Date(now);
        nextRun.setHours(hours, minutes, 0, 0);
        return nextRun;
      case "monthly":
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(hours, minutes, 0, 0);
        return nextMonth;
      default:
        return now;
    }
  };

  const resetForm = () => {
    setSelectedReport("");
    setFrequency("weekly");
    setTime("09:00");
    setSelectedDays([]);
    setCustomCron("");
  };

  const toggleScheduleStatus = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  const formatNextRun = (date?: Date) => {
    if (!date) return "Not scheduled";
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Report Scheduling
                </h1>
                <p className="text-gray-600 mt-2">
                  Automate your report generation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Form - Always Visible */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Schedule</CardTitle>
                <CardDescription>
                  Set up automated report generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Selection */}
                <div className="space-y-2">
                  <Label htmlFor="report">Select Report</Label>
                  <Select
                    value={selectedReport}
                    onValueChange={setSelectedReport}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Frequency Selection */}
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={(value: any) => setFrequency(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom (Cron)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                {/* Weekly Days Selection */}
                {frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={day.value}
                            checked={selectedDays.includes(day.value)}
                            onCheckedChange={() => handleDayToggle(day.value)}
                          />
                          <Label htmlFor={day.value} className="text-sm">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Cron Expression */}
                {frequency === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="cron">Cron Expression</Label>
                    <Input
                      placeholder="0 9 * * 1 (Every Monday at 9 AM)"
                      value={customCron}
                      onChange={(e) => setCustomCron(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Format: minute hour day month weekday
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4">
                  <Button
                    onClick={handleCreateSchedule}
                    disabled={
                      !selectedReport ||
                      (frequency === "weekly" && selectedDays.length === 0)
                    }
                    className="w-full"
                  >
                    Create Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedules List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Schedules
                </CardTitle>
                <CardDescription>
                  Manage your automated report schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No schedules yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first schedule to automate report generation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {schedule.reportName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  schedule.isActive ? "default" : "secondary"
                                }
                              >
                                {schedule.frequency}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {schedule.time}
                              </span>
                              {schedule.days && (
                                <span className="text-sm text-gray-500">
                                  ({schedule.days.join(", ")})
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Next run: {formatNextRun(schedule.nextRun)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-mono">
                              /{schedule.reportSlug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={schedule.isActive ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleScheduleStatus(schedule.id)}
                          >
                            {schedule.isActive ? "Pause" : "Resume"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
