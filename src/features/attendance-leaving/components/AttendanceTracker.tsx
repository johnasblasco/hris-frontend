import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Download, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
const API_BASE_URL = 'https://api-hris.slarenasitsolutions.com/public/api';
const token = localStorage.getItem('token');
// Define types based on your backend response
interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    department_id: number;
    position_id: number;
}

interface AttendanceRecord {
    id: number;
    employee_id: number;
    clock_in: string;
    clock_out: string | null;
    hours_worked: string;
    status: string;
    remarks: string | null;
    created_at: string;
    updated_at: string;
    employee: Employee;
}

interface AttendanceResponse {
    isSuccess: boolean;
    data: AttendanceRecord[];
}

const AttendanceTracker = () => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch attendance data from API
    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            // Replace with your actual API call
            const response = await fetch(`${API_BASE_URL}/attendances`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data: AttendanceResponse = await response.json();

            if (data.isSuccess) {
                setAttendance(data.data);
            } else {
                setError('Failed to fetch attendance data');
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return 'default';
            case 'late':
                return 'secondary';
            case 'absent':
                return 'destructive';
            case 'half-day':
                return 'outline';
            default:
                return 'default';
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getEmployeeName = (employee: Employee) => {
        return `${employee.first_name} ${employee.last_name}`;
    };

    // Filter attendance for selected date
    const filteredAttendance = attendance.filter(record => {
        const recordDate = format(new Date(record.clock_in), 'yyyy-MM-dd');
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        return recordDate === selectedDateStr;
    });

    const attendanceStats = {
        totalEmployees: filteredAttendance.length,
        present: filteredAttendance.filter(a => a.status.toLowerCase() === 'present').length,
        late: filteredAttendance.filter(a => a.status.toLowerCase() === 'late').length,
        absent: filteredAttendance.filter(a => a.status.toLowerCase() === 'absent').length,
        halfDay: filteredAttendance.filter(a => a.status.toLowerCase() === 'half-day').length,
    };

    const handleExportAttendance = () => {
        const headers = ['Employee', 'Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredAttendance.map(record => [
                getEmployeeName(record.employee),
                format(new Date(record.clock_in), 'yyyy-MM-dd'),
                format(new Date(record.clock_in), 'HH:mm:ss'),
                record.clock_out ? format(new Date(record.clock_out), 'HH:mm:ss') : 'N/A',
                record.hours_worked,
                record.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-red-500">{error}</div>
                        <Button onClick={fetchAttendance} className="mt-4">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Tracker</h1>
                    <p className="text-muted-foreground">
                        Monitor employee attendance and working hours
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(selectedDate, "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" onClick={fetchAttendance}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExportAttendance}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Attendance Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendanceStats.totalEmployees}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                        <p className="text-xs text-muted-foreground">
                            {attendanceStats.totalEmployees > 0 ?
                                Math.round((attendanceStats.present / attendanceStats.totalEmployees) * 100) : 0}% attendance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Late</CardTitle>
                        <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Half Day</CardTitle>
                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{attendanceStats.halfDay}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Attendance</CardTitle>
                    <CardDescription>
                        Attendance records for {format(selectedDate, "PPPP")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredAttendance.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No attendance records found for selected date
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Clock In</TableHead>
                                    <TableHead>Clock Out</TableHead>
                                    <TableHead>Hours Worked</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAttendance.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {getInitials(record.employee.first_name, record.employee.last_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{getEmployeeName(record.employee)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {record.employee.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(record.clock_in), 'HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            {record.clock_out ? format(new Date(record.clock_out), 'HH:mm:ss') :
                                                <span className="text-muted-foreground">--</span>}
                                        </TableCell>
                                        <TableCell>
                                            {parseFloat(record.hours_worked) > 0 ? `${record.hours_worked}h` : '--'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(record.status)}>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AttendanceTracker;