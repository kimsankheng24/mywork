"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Timer,
  FileText,
  Banknote,
  PieChart,
  Settings,
} from "lucide-react";

type NavItem = {
  titleKey: string;
  href?: string;
  icon?: React.ReactNode;
  children?: { titleKey: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    titleKey: "common.dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    titleKey: "common.hr_employee",
    icon: <Users className="w-5 h-5" />,
    children: [
      { titleKey: "common.employee_management", href: "/hr/employees" },
      { titleKey: "common.departments", href: "/hr/departments" },
      { titleKey: "common.positions", href: "/hr/positions" },
      { titleKey: "common.contracts", href: "/hr/contracts" },
    ],
  },
  {
    titleKey: "common.attendance",
    icon: <Clock className="w-5 h-5" />,
    children: [
      { titleKey: "common.attendance", href: "/attendance" },
      { titleKey: "common.shifts", href: "/attendance/shifts" },
      { titleKey: "common.rosters", href: "/attendance/rosters" },
      { titleKey: "common.holidays", href: "/attendance/holidays" },
    ],
  },
  {
    titleKey: "common.leave",
    icon: <CalendarDays className="w-5 h-5" />,
    children: [
      { titleKey: "common.leave_requests", href: "/leave/requests" },
      { titleKey: "common.leave_balances", href: "/leave/balances" },
    ],
  },
  {
    titleKey: "common.overtime",
    icon: <Timer className="w-5 h-5" />,
    children: [
      { titleKey: "common.ot_requests", href: "/overtime/requests" },
      { titleKey: "common.ot_approval", href: "/overtime/approvals" },
    ],
  },
  {
    titleKey: "common.claims",
    icon: <FileText className="w-5 h-5" />,
    children: [
      { titleKey: "common.claims", href: "/claims" },
      { titleKey: "common.budget_tracking", href: "/claims/budget" },
    ],
  },
  {
    titleKey: "common.payroll",
    icon: <Banknote className="w-5 h-5" />,
    children: [
      { titleKey: "common.payroll_processing", href: "/payroll/processing" },
      { titleKey: "common.salary_structures", href: "/payroll/structures" },
      { titleKey: "common.allowances", href: "/payroll/allowances" },
      { titleKey: "common.bonuses", href: "/payroll/bonuses" },
      { titleKey: "common.deductions", href: "/payroll/deductions" },
      { titleKey: "common.payslips", href: "/payroll/payslips" },
    ],
  },
  {
    titleKey: "common.reports",
    icon: <PieChart className="w-5 h-5" />,
    children: [
      { titleKey: "common.attendance_reports", href: "/reports/attendance" },
      { titleKey: "common.leave_reports", href: "/reports/leave" },
      { titleKey: "common.payroll_reports", href: "/reports/payroll" },
      { titleKey: "common.nssf_reports", href: "/reports/nssf" },
      { titleKey: "common.tax_reports", href: "/reports/tax" },
    ],
  },
  {
    titleKey: "common.administration",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { titleKey: "common.users", href: "/admin/users" },
      { titleKey: "common.roles", href: "/admin/roles" },
      { titleKey: "common.permissions", href: "/admin/permissions" },
      { titleKey: "common.audit_logs", href: "/admin/audit" },
      { titleKey: "common.settings", href: "/admin/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (titleKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [titleKey]: !prev[titleKey],
    }));
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-primary tracking-tight">My Work</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isOpen = openMenus[item.titleKey];
          const hasChildren = !!item.children;
          const isActive = item.href ? pathname === item.href : false;

          return (
            <div key={item.titleKey}>
              {hasChildren ? (
                <button
                  onClick={() => toggleMenu(item.titleKey)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{t(item.titleKey)}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                  <span>{t(item.titleKey)}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && isOpen && (
                <div className="mt-1 ml-6 space-y-1 border-l-2 border-sidebar-border pl-2">
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.titleKey}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isChildActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
                        )}
                      >
                        {t(child.titleKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-center text-muted-foreground">
        © MR.KHENG Kimsan. All rights reserved.
      </div>
    </aside>
  );
}
