import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Download } from "lucide-react";
import { mockAttendance } from '@/features/data/mockData';
import type { AttendanceRecord } from '@/features/data/types';
import { format } from 'date-fns';

const AttendanceTracker = () => {
    const [attendance,] = useState<AttendanceRecord[]>(mockAttendance);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const getStatusColor = (status: string) => {
        switch (status) {
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

    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n.charAt(0)).join('').toUpperCase();
    };

    const attendanceStats = {
        totalEmployees: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        late: attendance.filter(a => a.status === 'late').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        halfDay: attendance.filter(a => a.status === 'half-day').length,
    };

    const handleExportAttendance = () => {
        // Create CSV content
        const headers = ['Employee', 'Date', 'Check In', 'Check Out', 'Hours Worked', 'Status'];
        const csvContent = [
            headers.join(','),
            ...attendance.map(record => [
                record.employeeName,
                format(selectedDate, 'yyyy-MM-dd'),
                record.checkIn || 'N/A',
                record.checkOut || 'N/A',
                record.hoursWorked || 'N/A',
                record.status
            ].join(','))
        ].join('\n');

        // Create and download file
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Attendance Tracker</h1>
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
                            {Math.round((attendanceStats.present / attendanceStats.totalEmployees) * 100)}% attendance
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
                            {attendance.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(record.employeeName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{record.employeeName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {record.employeeId}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {record.clockIn || <span className="text-muted-foreground">--</span>}
                                    </TableCell>
                                    <TableCell>
                                        {record.clockOut || <span className="text-muted-foreground">--</span>}
                                    </TableCell>
                                    <TableCell>
                                        {record.hoursWorked > 0 ? `${record.hoursWorked}h` : '--'}
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
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common attendance management tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                            <Clock className="h-6 w-6" />
                            <span>Mark Attendance</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                            <CalendarIcon className="h-6 w-6" />
                            <span>View Monthly Report</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                            <Download className="h-6 w-6" />
                            <span>Generate Report</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AttendanceTracker;