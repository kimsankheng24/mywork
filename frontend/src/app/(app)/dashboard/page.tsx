"use client";

import { useTranslation } from "react-i18next";
import { Users, UserCheck, UserX, Clock, CalendarOff, Banknote, Timer } from "lucide-react";

export default function DashboardPage() {
  const { t } = useTranslation();

  const kpis = [
    { title: "Total Employees", value: "245", icon: <Users className="w-6 h-6 text-primary" />, trend: "+2%" },
    { title: "Present Today", value: "230", icon: <UserCheck className="w-6 h-6 text-success" />, trend: "94%" },
    { title: "Absent Today", value: "8", icon: <UserX className="w-6 h-6 text-destructive" />, trend: "3%" },
    { title: "Late Employees", value: "12", icon: <Clock className="w-6 h-6 text-warning" />, trend: "-1%" },
    { title: "On Leave", value: "7", icon: <CalendarOff className="w-6 h-6 text-muted-foreground" />, trend: "" },
    { title: "Payroll Cost (Est.)", value: "$42,500", icon: <Banknote className="w-6 h-6 text-primary" />, trend: "This Month" },
    { title: "Overtime Cost", value: "$1,250", icon: <Timer className="w-6 h-6 text-warning" />, trend: "This Month" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("common.dashboard")}</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <h3 className="text-3xl font-bold mt-2">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                {kpi.icon}
              </div>
            </div>
            {kpi.trend && (
              <div className="mt-4 text-sm font-medium text-success">
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lists Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-8">
        {/* Recent Attendance */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Attendance</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">IT Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    Checked In
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">08:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Pending Leave Requests</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
                    SM
                  </div>
                  <div>
                    <p className="font-medium">Sarah Miller</p>
                    <p className="text-xs text-muted-foreground">Annual Leave (2 days)</p>
                  </div>
                </div>
                <div className="text-right flex gap-2">
                  <button className="px-3 py-1 text-xs font-medium bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
