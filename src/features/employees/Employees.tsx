import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Eye } from "lucide-react";
import EmployeeDialog from './components/EmployeeDialog';
import api from '@/utils/axios'
import type { Employee, Department, PositionType } from '@/features/data/types'

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<PositionType[]>([]);
    const [managers, setManagers] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await api.get('/employees');
            const result = response.data;

            if (result.isSuccess) {
                setEmployees(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch dropdown data (departments, positions, managers)
    const fetchDropdownData = async () => {
        try {
            // You'll need to create these API endpoints or modify existing ones
            const [deptResponse, posResponse, mgrResponse] = await Promise.all([
                api.get('/departments'),
                api.get('/positions'),
                api.get('/employees?managers=true')
            ]);

            if (deptResponse.data.isSuccess) {
                setDepartments(deptResponse.data.data);
            }

            if (posResponse.data.isSuccess) {
                setPositions(posResponse.data.data);
            }

            if (mgrResponse.data.isSuccess) {
                setManagers(mgrResponse.data.data);
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDropdownData();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getEmployeeDisplayName = (employeeId: number | null) => {
        if (!employeeId) return 'N/A';
        const manager = managers.find(m => m.id === employeeId);
        return manager ? `${manager.first_name} ${manager.last_name}` : 'N/A';
    };

    if (loading) {
        return <div className="p-6">Loading employees...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500">Error: {error}</div>
                <Button onClick={fetchEmployees} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                    <button onClick={() => setError(null)} className="float-right font-bold">×</button>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p className="text-muted-foreground">
                        Manage your organization's employees
                    </p>
                </div>
                {/* DIALOG HERE */}
                <EmployeeDialog
                    editingEmployee={editingEmployee}
                    setEditingEmployee={setEditingEmployee}
                    departments={departments}
                    positions={positions}
                    managers={managers}
                    onEmployeeAdded={fetchEmployees}
                    onEmployeeUpdated={fetchEmployees}
                    onEmployeeArchived={fetchEmployees}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Employees</CardTitle>
                    <CardDescription>
                        A list of all employees in your organization
                    </CardDescription>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Base Salary</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(employee.first_name, employee.last_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {employee.first_name} {employee.last_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {employee.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.department?.name || 'N/A'}</TableCell>
                                    <TableCell>{employee.position?.title || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={employee.is_active ? 'default' : 'secondary'}>
                                            {employee.is_active ? 'active' : 'inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${employee.base_salary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setIsViewDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingEmployee(employee);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Employee Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                        <DialogDescription>
                            Complete information for {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedEmployee.first_name} {selectedEmployee.last_name}
                                    </h3>
                                    <p className="text-muted-foreground">{selectedEmployee.position?.title || 'N/A'}</p>
                                    <Badge variant={selectedEmployee.is_active ? 'default' : 'secondary'}>
                                        {selectedEmployee.is_active ? 'active' : 'inactive'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Employee ID</Label>
                                    <p className="text-sm">{selectedEmployee.employee_id || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Department</Label>
                                    <p className="text-sm">{selectedEmployee.department?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="text-sm">{selectedEmployee.email}</p>
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm">{selectedEmployee.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Hire Date</Label>
                                    <p className="text-sm">{new Date(selectedEmployee.hire_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label>Base Salary</Label>
                                    <p className="text-sm">${selectedEmployee.base_salary.toLocaleString()}/year</p>
                                    <p className="text-xs text-muted-foreground">Payroll auto-calculates total compensation</p>
                                </div>
                                {selectedEmployee.manager_id && (
                                    <div className="col-span-2">
                                        <Label>Manager</Label>
                                        <p className="text-sm">{getEmployeeDisplayName(selectedEmployee.manager_id)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default Employees