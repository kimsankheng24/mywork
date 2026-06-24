"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the expected Employee type from the backend
type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string | null;
  positionId: string | null;
  status: string;
};

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      fullName.includes(searchLower) || 
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchLower)) ||
      (emp.email && emp.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("common.employee_management")}</h1>
          <p className="text-muted-foreground">Manage your organization's workforce, departments, and roles.</p>
        </div>
        <AddEmployeeDialog onEmployeeAdded={fetchEmployees} />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employees..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No employees found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium text-muted-foreground">{emp.employeeCode}</TableCell>
                    <TableCell>
                      <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-muted-foreground">{emp.email}</div>
                    </TableCell>
                    <TableCell>{emp.departmentId || 'N/A'}</TableCell>
                    <TableCell>{emp.positionId || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${emp.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                      `}>
                        {emp.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm text-primary hover:underline font-medium">Edit</button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
