import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Edit, Eye, Users, UserCheck, UserX, Download, Filter, Phone, Mail, MapPin, Calendar, FileText } from "lucide-react";
import EmployeeDialog from './components/EmployeeDialog';
import api from '@/utils/axios'
import type {
    Employee,
    Department,
    PositionType,
    EmployeeListResponse,
    EmployeeFormData,
    EmployeeFilters
} from './employeeTS';

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
    const [summary, setSummary] = useState({ total_employees: 0, active_employees: 0, inactive_employees: 0 });
    const [pagination, setPagination] = useState({ current_page: 1, per_page: 10, total: 0, last_page: 1 });

    // Fetch employees with pagination
    const fetchEmployees = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/employees?page=${page}`);
            const result = response.data;

            if (result.isSuccess) {
                setEmployees(result.employees || []);
                setSummary(result.summary || { total_employees: 0, active_employees: 0, inactive_employees: 0 });
                setPagination(result.pagination || { current_page: 1, per_page: 10, total: 0, last_page: 1 });
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch employee details for view dialog
    const fetchEmployeeDetails = async (employeeId: number) => {
        try {
            const response = await api.get(`/employees/${employeeId}`);
            const result = response.data;

            if (result.isSuccess) {
                return result.employee;
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch employee details');
            return null;
        }
    };

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            const [deptResponse, posResponse, mgrResponse] = await Promise.all([
                api.get('/dropdown/departments'),
                api.get('/dropdown/position-types'),
                api.get('/dropdown/employees')
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

    const handleViewEmployee = async (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsViewDialogOpen(true);

        // Fetch detailed employee data including files
        const detailedEmployee = await fetchEmployeeDetails(employee.id);
        if (detailedEmployee) {
            setSelectedEmployee(detailedEmployee);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department?.department_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position?.position_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getManagerName = (employee: Employee) => {
        if (employee.manager) {
            return `${employee.manager.first_name} ${employee.manager.last_name}`;
        }
        return employee.manager_id ? 'Manager not loaded' : 'No Manager';
    };

    const formatSalary = (salary: string | number) => {
        const numSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(numSalary);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchEmployees(newPage);
        }
    };

    const renderField = (value: any, fallback = 'N/A') => {
        return value ? value : fallback;
    };

    const downloadFile = (fileUrl: string, fileName: string) => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading employees...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">×</button>
                </div>
                <Button onClick={() => fetchEmployees()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your organization's workforce efficiently
                    </p>
                </div>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.total_employees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{summary.active_employees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{summary.inactive_employees}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {summary.total_employees > 0
                                ? Math.round((summary.active_employees / summary.total_employees) * 100)
                                : 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Employee Directory</CardTitle>
                            <CardDescription>
                                Browse and manage all employees in your organization
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 w-full sm:w-64"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Manager</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead>Hire Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEmployees.map((employee) => (
                                        <TableRow key={employee.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {getInitials(employee.first_name, employee.last_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium truncate">
                                                            {employee.first_name} {employee.middle_name} {employee.last_name} {employee.suffix}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">
                                                            {employee.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal">
                                                    {employee.department?.department_name || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{employee.position?.position_name || 'N/A'}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {getManagerName(employee)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge
                                                        variant={employee.is_active ? "default" : "secondary"}
                                                        className={employee.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                                    >
                                                        {employee.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    {employee.is_archived && (
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                            Archived
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatSalary(employee.base_salary)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(employee.hire_date)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewEmployee(employee)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingEmployee(employee)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                                {pagination.total} entries
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                                        <Button
                                            key={page}
                                            variant={pagination.current_page === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Employee Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                        <DialogDescription>
                            Complete information for {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmployee && (
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="employment">Employment</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                                <TabsTrigger value="files">Files</TabsTrigger>
                            </TabsList>

                            {/* Personal Information Tab */}
                            <TabsContent value="personal" className="space-y-4">
                                <div className="flex items-center space-x-4 pb-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                            {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {selectedEmployee.first_name} {selectedEmployee.middle_name} {selectedEmployee.last_name} {selectedEmployee.suffix}
                                        </h3>
                                        <p className="text-muted-foreground">{selectedEmployee.position?.position_name || 'N/A'}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant={selectedEmployee.is_active ? "default" : "secondary"}>
                                                {selectedEmployee.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <Badge variant="outline">{selectedEmployee.role}</Badge>
                                            {selectedEmployee.is_archived && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    Archived
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Basic Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Employee ID</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.employee_id)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Date of Birth</Label>
                                                <p className="text-sm mt-1">{formatDate(selectedEmployee.date_of_birth)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Place of Birth</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.place_of_birth)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Sex</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.sex)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Civil Status</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.civil_status)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Physical Attributes */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Physical Attributes
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Height</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.height_m)} m</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Weight</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.weight_kg)} kg</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Blood Type</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.blood_type)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Citizenship</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.citizenship)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Government IDs */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Government IDs
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label className="text-sm">GSIS No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.gsis_no)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm">PAG-IBIG No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.pagibig_no)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm">PhilHealth No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.philhealth_no)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm">SSS No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.sss_no)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm">TIN No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.tin_no)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Agency Employee No.</Label>
                                            <p className="text-sm mt-1">{renderField(selectedEmployee.agency_employee_no)}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Employment Information Tab */}
                            <TabsContent value="employment" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Employment Details */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Employment Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Department</Label>
                                                <p className="text-sm mt-1 font-medium">
                                                    {selectedEmployee.department?.department_name || 'N/A'}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {selectedEmployee.department?.description}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Position</Label>
                                                <p className="text-sm mt-1 font-medium">
                                                    {selectedEmployee.position?.position_name || 'N/A'}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {selectedEmployee.position?.description}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Manager</Label>
                                                <p className="text-sm mt-1">{getManagerName(selectedEmployee)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Employment Type</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.employment_type_id)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compensation & Dates */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Compensation & Dates
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Base Salary</Label>
                                                <p className="text-sm font-medium mt-1">{formatSalary(selectedEmployee.base_salary)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Hire Date</Label>
                                                <p className="text-sm mt-1">{formatDate(selectedEmployee.hire_date)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Created At</Label>
                                                <p className="text-sm mt-1">{formatDateTime(selectedEmployee.created_at)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Last Updated</Label>
                                                <p className="text-sm mt-1">{formatDateTime(selectedEmployee.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Education Tab */}
                            <TabsContent value="education" className="space-y-6">
                                {/* Educational Background */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Educational Background
                                    </h4>

                                    {/* Elementary */}
                                    <div className="space-y-2 p-3 border rounded-lg">
                                        <h5 className="font-medium">Elementary</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div><Label>School:</Label> {renderField(selectedEmployee.elementary_school_name)}</div>
                                            <div><Label>Year Graduated:</Label> {renderField(selectedEmployee.elementary_year_graduated)}</div>
                                            <div><Label>Highest Level:</Label> {renderField(selectedEmployee.elementary_highest_level)}</div>
                                            <div><Label>Honors:</Label> {renderField(selectedEmployee.elementary_honors)}</div>
                                        </div>
                                    </div>

                                    {/* Secondary */}
                                    <div className="space-y-2 p-3 border rounded-lg">
                                        <h5 className="font-medium">Secondary</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div><Label>School:</Label> {renderField(selectedEmployee.secondary_school_name)}</div>
                                            <div><Label>Year Graduated:</Label> {renderField(selectedEmployee.secondary_year_graduated)}</div>
                                            <div><Label>Highest Level:</Label> {renderField(selectedEmployee.secondary_highest_level)}</div>
                                            <div><Label>Honors:</Label> {renderField(selectedEmployee.secondary_honors)}</div>
                                        </div>
                                    </div>

                                    {/* College */}
                                    <div className="space-y-2 p-3 border rounded-lg">
                                        <h5 className="font-medium">College</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div><Label>School:</Label> {renderField(selectedEmployee.college_school_name)}</div>
                                            <div><Label>Degree/Course:</Label> {renderField(selectedEmployee.college_degree_course)}</div>
                                            <div><Label>Year Graduated:</Label> {renderField(selectedEmployee.college_year_graduated)}</div>
                                            <div><Label>Highest Level:</Label> {renderField(selectedEmployee.college_highest_level)}</div>
                                            <div><Label>Honors:</Label> {renderField(selectedEmployee.college_honors)}</div>
                                        </div>
                                    </div>

                                    {/* Graduate Studies */}
                                    <div className="space-y-2 p-3 border rounded-lg">
                                        <h5 className="font-medium">Graduate Studies</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div><Label>School:</Label> {renderField(selectedEmployee.graduate_school_name)}</div>
                                            <div><Label>Degree/Course:</Label> {renderField(selectedEmployee.graduate_degree_course)}</div>
                                            <div><Label>Year Graduated:</Label> {renderField(selectedEmployee.graduate_year_graduated)}</div>
                                            <div><Label>Highest Level:</Label> {renderField(selectedEmployee.graduate_highest_level)}</div>
                                            <div><Label>Honors:</Label> {renderField(selectedEmployee.graduate_honors)}</div>
                                        </div>
                                    </div>

                                    {/* Vocational */}
                                    <div className="space-y-2 p-3 border rounded-lg">
                                        <h5 className="font-medium">Vocational</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div><Label>School:</Label> {renderField(selectedEmployee.vocational_school_name)}</div>
                                            <div><Label>Degree/Course:</Label> {renderField(selectedEmployee.vocational_degree_course)}</div>
                                            <div><Label>Year Graduated:</Label> {renderField(selectedEmployee.vocational_year_graduated)}</div>
                                            <div><Label>Highest Level:</Label> {renderField(selectedEmployee.vocational_highest_level)}</div>
                                            <div><Label>Honors:</Label> {renderField(selectedEmployee.vocational_honors)}</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Contacts Tab */}
                            <TabsContent value="contacts" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Contact Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <Label className="text-sm">Email</Label>
                                                    <p className="text-sm mt-1">{selectedEmployee.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <Label className="text-sm">Phone</Label>
                                                    <p className="text-sm mt-1">{renderField(selectedEmployee.phone)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Emergency Contact
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Name</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.emergency_contact_name)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Phone</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.emergency_contact_number)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Relation</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.emergency_contact_relation)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Residential Address */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Residential Address
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm">{renderField(selectedEmployee.residential_address)}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Zipcode: {renderField(selectedEmployee.residential_zipcode)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tel: {renderField(selectedEmployee.residential_tel_no)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Permanent Address */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Permanent Address
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm">{renderField(selectedEmployee.permanent_address)}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Zipcode: {renderField(selectedEmployee.permanent_zipcode)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tel: {renderField(selectedEmployee.permanent_tel_no)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Family Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Family Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Father's Name</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.father_name)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Mother's Name</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.mother_name)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Parents' Address</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.parents_address)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm">Spouse's Name</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.spouse_name)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Spouse's Occupation</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.spouse_occupation)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Spouse's Employer</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.spouse_employer)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Spouse's Business Address</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.spouse_business_address)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm">Spouse's Telephone</Label>
                                                <p className="text-sm mt-1">{renderField(selectedEmployee.spouse_tel_no)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Files Tab */}
                            <TabsContent value="files" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Resume */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Resume
                                        </h4>
                                        {selectedEmployee.resume ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">Resume File</span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => downloadFile(selectedEmployee.resume!, 'Resume.pdf')}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download Resume
                                                </Button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No resume uploaded</p>
                                        )}
                                    </div>

                                    {/* 201 Files */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            201 Files
                                        </h4>
                                        {selectedEmployee.files && selectedEmployee.files.length > 0 ? (
                                            <div className="space-y-3">
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {selectedEmployee.files.map((file: any) => (
                                                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center space-x-2">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium">{file.file_name}</span>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => downloadFile(file.file_path, file.file_name)}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No 201 files uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            setEditingEmployee(selectedEmployee);
                            setIsViewDialogOpen(false);
                        }}>
                            Edit Employee
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Employees;