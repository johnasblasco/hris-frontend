import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, X, Eye } from "lucide-react";
import { mockLeaveRequests } from '@/features/data/mockData';
import type { LeaveRequest } from '@/features/data/types';
import { format, differenceInDays } from 'date-fns';

const LeaveManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getLeaveTypeColor = (type: string) => {
        switch (type) {
            case 'vacation':
                return 'bg-blue-100 text-blue-800';
            case 'sick':
                return 'bg-red-100 text-red-800';
            case 'personal':
                return 'bg-green-100 text-green-800';
            case 'maternity':
                return 'bg-purple-100 text-purple-800';
            case 'paternity':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n.charAt(0)).join('').toUpperCase();
    };

    const handleApprove = (id: string) => {
        setLeaveRequests(prev =>
            prev.map(request =>
                request.id === id ? { ...request, status: 'approved' as const } : request
            )
        );
    };

    const handleReject = (id: string) => {
        setLeaveRequests(prev =>
            prev.map(request =>
                request.id === id ? { ...request, status: 'rejected' as const } : request
            )
        );
    };

    const handleAddLeaveRequest = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

        const newRequest: LeaveRequest = {
            id: (leaveRequests.length + 1).toString(),
            employeeId: 'EMP001', // In real app, this would be current user
            employeeName: 'Current User',
            leaveType: formData.get('leaveType') as any,
            startDate,
            endDate,
            days,
            status: 'pending',
            reason: formData.get('reason') as string,
            appliedDate: new Date().toISOString().split('T')[0],
        };

        setLeaveRequests([...leaveRequests, newRequest]);
        setIsAddDialogOpen(false);
    };

    const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length;
    const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = leaveRequests.filter(r => r.status === 'rejected').length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1>Leave Management</h1>
                    <p className="text-muted-foreground">
                        Manage employee leave requests and approvals
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Leave Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>New Leave Request</DialogTitle>
                            <DialogDescription>
                                Submit a new leave request for approval.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddLeaveRequest} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="leaveType">Leave Type</Label>
                                <Select name="leaveType" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vacation">Vacation</SelectItem>
                                        <SelectItem value="sick">Sick Leave</SelectItem>
                                        <SelectItem value="personal">Personal</SelectItem>
                                        <SelectItem value="maternity">Maternity</SelectItem>
                                        <SelectItem value="paternity">Paternity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input name="startDate" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input name="endDate" type="date" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason</Label>
                                <Textarea name="reason" placeholder="Please provide a reason for your leave request" required />
                            </div>
                            <Button type="submit" className="w-full">Submit Request</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Leave Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{rejectedRequests}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Leave Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Leave Requests</CardTitle>
                    <CardDescription>
                        Manage and review employee leave requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Leave Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaveRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(request.employeeName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{request.employeeName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {request.employeeId}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getLeaveTypeColor(request.leaveType)}>
                                            {request.leaveType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{request.days} day{request.days > 1 ? 's' : ''}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd, yyyy')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(request.status)}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(request.appliedDate), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setIsViewDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleApprove(request.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReject(request.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Leave Request Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>
                            Complete information for this leave request
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {getInitials(selectedRequest.employeeName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedRequest.employeeName}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.employeeId}</p>
                                </div>
                                <div className="ml-auto">
                                    <Badge variant={getStatusColor(selectedRequest.status)}>
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Leave Type</Label>
                                    <p className="text-sm">
                                        <Badge variant="outline" className={getLeaveTypeColor(selectedRequest.leaveType)}>
                                            {selectedRequest.leaveType}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <Label>Duration</Label>
                                    <p className="text-sm">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                                </div>
                                <div>
                                    <Label>Start Date</Label>
                                    <p className="text-sm">{format(new Date(selectedRequest.startDate), 'PPP')}</p>
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <p className="text-sm">{format(new Date(selectedRequest.endDate), 'PPP')}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label>Applied Date</Label>
                                    <p className="text-sm">{format(new Date(selectedRequest.appliedDate), 'PPP')}</p>
                                </div>
                            </div>
                            <div>
                                <Label>Reason</Label>
                                <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedRequest.reason}</p>
                            </div>
                            {selectedRequest.status === 'pending' && (
                                <div className="flex space-x-2 pt-4">
                                    <Button
                                        onClick={() => {
                                            handleApprove(selectedRequest.id);
                                            setIsViewDialogOpen(false);
                                        }}
                                        className="flex-1"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleReject(selectedRequest.id);
                                            setIsViewDialogOpen(false);
                                        }}
                                        className="flex-1"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default LeaveManagement;