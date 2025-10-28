import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockEmployees, mockLeaveRequests, mockDepartments } from '../data/mockData';

const departmentData = mockDepartments.map(dept => ({
    name: dept.name,
    employees: dept.employeeCount,
    budget: dept.budget / 1000,
}));

const attendanceData = [
    { name: 'Present', value: 4, color: '#10b981' },
    { name: 'Late', value: 1, color: '#f59e0b' },
    { name: 'Absent', value: 1, color: '#ef4444' },
];

const Dashboard = () => {
    const totalEmployees = mockEmployees.length;
    const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
    const pendingLeaves = mockLeaveRequests.filter(leave => leave.status === 'pending').length;
    const totalDepartments = mockDepartments.length;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1>Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your HR dashboard. Here's an overview of your organization.
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeEmployees} active employees
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDepartments}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all locations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLeaves}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">83%</div>
                        <p className="text-xs text-muted-foreground">
                            Today's attendance
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Department Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Department Overview</CardTitle>
                        <CardDescription>
                            Employee count and budget by department
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="employees" fill="#8884d8" name="Employees" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Attendance Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>
                            Current attendance status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {attendanceData.map((entry, index) => {

                                        return (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        )
                                    }

                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center space-x-4 mt-4">
                            {attendanceData.map((entry, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm">{entry.name}: {entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>
                        Latest updates from your HR system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm">New employee onboarded: John Doe</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                            <Badge variant="outline">New Hire</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm">Leave request submitted by Jane Smith</p>
                                <p className="text-xs text-muted-foreground">4 hours ago</p>
                            </div>
                            <Badge variant="outline">Leave Request</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm">Payroll processed for January 2024</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                            <Badge variant="outline">Payroll</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Dashboard