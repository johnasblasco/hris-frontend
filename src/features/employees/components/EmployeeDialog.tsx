import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { Employee, Department, PositionType } from '@/features/data/types'
import api from '@/utils/axios'
import { useEffect, useState } from "react"

interface EmployeeDialogProps {
    editingEmployee: Employee | null;
    setEditingEmployee: (employee: Employee | null) => void;
    departments: Department[];
    positions: PositionType[];
    managers: Employee[];
    onEmployeeAdded: () => void;
    onEmployeeUpdated: () => void;
    onEmployeeArchived: () => void;
}

const EmployeeDialog = ({
    editingEmployee,
    setEditingEmployee,
    departments,
    positions,
    managers,
    onEmployeeAdded,
    onEmployeeUpdated,
    onEmployeeArchived
}: EmployeeDialogProps) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Open edit dialog when editingEmployee changes
    useEffect(() => {
        if (editingEmployee) {
            setIsEditDialogOpen(true);
        }
    }, [editingEmployee]);

    const handleAddEmployee = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            // ✅ Create FormData object for file upload support
            const submitData = new FormData();
            submitData.append('first_name', formData.get('firstName') as string);
            submitData.append('last_name', formData.get('lastName') as string);
            submitData.append('email', formData.get('email') as string);
            submitData.append('phone', formData.get('phone') as string || '');
            submitData.append('department_id', formData.get('department') as string || '');
            submitData.append('position_id', formData.get('position') as string || '');
            submitData.append('base_salary', formData.get('salary') as string);
            submitData.append('hire_date', formData.get('hireDate') as string);
            submitData.append('manager_id', formData.get('manager') as string || '');
            submitData.append('password', formData.get('password') as string);

            // ✅ Add file upload if provided
            const fileInput = (event.target as HTMLFormElement).elements.namedItem('201_file') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                submitData.append('201_file', fileInput.files[0]);
            }

            const response = await api.post('/create/employees', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.isSuccess) {
                onEmployeeAdded();
                setIsAddDialogOpen(false);
                (event.target as HTMLFormElement).reset();
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    const handleEditEmployee = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingEmployee) return;

        setLoading(true);
        setError(null);

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const updatedEmployee = {
                first_name: formData.get('firstName') as string,
                last_name: formData.get('lastName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                department_id: formData.get('department') ? Number(formData.get('department')) : null,
                position_id: formData.get('position') ? Number(formData.get('position')) : null,
                base_salary: Number(formData.get('salary')),
                hire_date: formData.get('hireDate') as string,
                manager_id: formData.get('manager') ? Number(formData.get('manager')) : null,
            };

            const response = await api.post(`/update/employees/${editingEmployee.id}`, updatedEmployee);

            if (response.data.isSuccess) {
                onEmployeeUpdated();
                setIsEditDialogOpen(false);
                setEditingEmployee(null);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update employee');
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveEmployee = async (id: number) => {
        if (!confirm('Are you sure you want to archive this employee?')) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/employees/${id}/archive`);

            if (response.data.isSuccess) {
                onEmployeeArchived();
                setIsEditDialogOpen(false);
                setEditingEmployee(null);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to archive employee');
        } finally {
            setLoading(false);
        }
    };

    const handleEditDialogOpenChange = (open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
            setEditingEmployee(null);
        }
    };

    return (
        <div>
            {/* ADD DIALOG */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:min-w-5xl w-full"> {/* ✅ Increased width */}
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>
                            Enter the employee's information below.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddEmployee} className="grid grid-cols-3 gap-6"> {/* ✅ 3 columns for wider layout */}
                        {/* Column 1 - Personal Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input name="firstName" placeholder="John" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input name="lastName" placeholder="Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" type="email" placeholder="john.doe@company.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input name="phone" placeholder="+1-555-0101" />
                            </div>
                        </div>

                        {/* Column 2 - Job Details */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select name="department" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.department_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Select name="position" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map(pos => (
                                            <SelectItem key={pos.id} value={pos.id.toString()}>
                                                {pos.position_name} {/* ✅ Fixed: should be position_name */}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Base Salary (Annual)</Label>
                                <Input name="salary" type="number" placeholder="75000" required />
                                <p className="text-xs text-muted-foreground">
                                    System auto-calculates deductions, taxes & net pay in Payroll
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hireDate">Hire Date</Label>
                                <Input name="hireDate" type="date" required />
                            </div>
                        </div>

                        {/* Column 3 - Security & File Upload */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager">Manager</Label>
                                <Select name="manager">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map(manager => (
                                            <SelectItem key={manager.id} value={manager.id.toString()}>
                                                {manager.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input name="password" type="password" placeholder="Enter password" required />
                            </div>

                            {/* File Upload - Full width in this column */}
                            <div className="space-y-2">
                                <Label htmlFor="201_file">201 File</Label>
                                <Input
                                    name="201_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload employee 201 file (PDF, DOC, DOCX, JPG, PNG - max 2MB)
                                </p>
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Employee'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
                <DialogContent className="md:min-w-5xl w-full"> {/* ✅ Wider than before */}
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                            Update the employee's information below.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {editingEmployee && (
                        <form onSubmit={handleEditEmployee} className="grid grid-cols-2 gap-6"> {/* ✅ 2 columns for edit */}
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input name="firstName" defaultValue={editingEmployee.first_name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input name="lastName" defaultValue={editingEmployee.last_name} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input name="email" type="email" defaultValue={editingEmployee.email} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input name="phone" defaultValue={editingEmployee.phone || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Base Salary (Annual)</Label>
                                    <Input name="salary" type="number" defaultValue={editingEmployee.base_salary} required />
                                    <p className="text-xs text-muted-foreground">System auto-calculates deductions, taxes & net pay in Payroll</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select name="department" defaultValue={editingEmployee.department_id?.toString()} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => (
                                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                                    {dept.department_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Select name="position" defaultValue={editingEmployee.position_id?.toString()} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map(pos => (
                                                <SelectItem key={pos.id} value={pos.id.toString()}>
                                                    {pos.position_name} {/* ✅ Fixed: should be position_name */}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hireDate">Hire Date</Label>
                                    <Input name="hireDate" type="date" defaultValue={editingEmployee.hire_date} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manager">Manager</Label>
                                    <Select name="manager" defaultValue={editingEmployee.manager_id?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select manager" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {managers.map(manager => (
                                                <SelectItem key={manager.id} value={manager.id.toString()}>
                                                    {manager.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="201_file">201 File</Label>
                                    <Input
                                        name="201_file"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload new 201 file (optional)
                                    </p>
                                </div>
                            </div>

                            {/* Full Width Actions */}
                            <div className="col-span-2 flex gap-2 pt-4 border-t">
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Employee'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleArchiveEmployee(editingEmployee.id)}
                                    disabled={loading}
                                >
                                    Archive
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmployeeDialog