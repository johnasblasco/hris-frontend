import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    Settings,
    Shield,
    Users,
    Database,
    Bell,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Save,
    UserPlus,
    Edit,
    Trash2,
    Mail,
    Key,
    Plus,
    Building
} from 'lucide-react';

const SettingsComponent = () => {
    const [settings, setSettings] = useState({
        // General Settings - Company Information
        companyName: 'Acme Corporation',
        companyMission: 'To empower businesses with innovative technology solutions that drive growth and success.',
        companyVision: 'To be the leading provider of enterprise solutions, transforming how organizations operate and grow in the digital age.',
        registrationNumber: 'REG-2024-12345',
        taxId: '12-3456789',
        foundedYear: '2010',
        industry: 'Technology',
        companySize: '100-500',
        website: 'www.acmecorp.com',
        primaryEmail: 'info@acmecorp.com',
        phoneNumber: '+1 (555) 123-4567',
        address: '123 Business Street',
        city: 'San Francisco',
        state: 'California',
        postalCode: '94102',
        country: 'United States',

        // Security Settings
        passwordPolicy: 'medium',
        sessionTimeout: '8',
        twoFactorAuth: true,
        auditLogging: true,

        // HR Policies
        workingHours: '8',
        lunchBreak: '1',
        overtimeRate: '1.5',
        probationPeriod: '90',

        // Leave Policies
        annualLeave: '20',
        sickLeave: '10',
        maternityLeave: '12',
        paternityLeave: '2',

        // Attendance Settings
        lateThreshold: '15',
        halfDayThreshold: '4',
        attendanceTracking: true,
        geofencing: false,

        // Notification Settings
        emailNotifications: true,
        payrollReminders: true,
        leaveApprovals: true,
        birthdayReminders: true,
    });

    const [hasChanges, setHasChanges] = useState(false);

    // User Management State
    const [users, setUsers] = useState([
        {
            id: 'U001',
            name: 'Super Admin',
            email: 'superadmin@company.com',
            role: 'Super Admin',
            status: 'Active',
            createdAt: '2024-01-01',
            lastLogin: '2025-10-09'
        },
        {
            id: 'U002',
            name: 'HR Manager',
            email: 'hr.manager@company.com',
            role: 'Admin',
            status: 'Active',
            createdAt: '2024-02-15',
            lastLogin: '2025-10-08'
        }
    ]);

    // Department Management State
    const [departments, setDepartments] = useState([
        { id: 'D001', name: 'Engineering', manager: 'Sarah Johnson', employeeCount: 12, description: 'Software development and technical operations' },
        { id: 'D002', name: 'Marketing', manager: 'Michael Brown', employeeCount: 8, description: 'Brand management and customer engagement' },
        { id: 'D003', name: 'Sales', manager: 'Lisa Davis', employeeCount: 15, description: 'Revenue generation and client relations' },
        { id: 'D004', name: 'Human Resources', manager: 'David Miller', employeeCount: 4, description: 'Employee management and organizational development' },
        { id: 'D005', name: 'Finance', manager: 'Emily Wilson', employeeCount: 6, description: 'Financial planning and accounting' }
    ]);
    const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [departmentForm, setDepartmentForm] = useState({
        name: '',
        manager: '',
        employeeCount: '',
        description: ''
    });

    const [showUserDialog, setShowUserDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
        status: 'Active'
    });

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const saveSettings = () => {
        // Simulate saving settings
        console.log('Saving settings:', settings);
        setHasChanges(false);
        alert('Settings saved successfully!');
    };

    const resetToDefaults = () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            // Reset to default values
            setHasChanges(true);
        }
    };

    // User Management Functions
    const resetUserForm = () => {
        setUserForm({
            name: '',
            email: '',
            password: '',
            role: 'Admin',
            status: 'Active'
        });
        setEditingUser(null);
    };

    const handleSaveUser = () => {
        if (editingUser) {
            setUsers(users.map(u =>
                u.id === editingUser
                    ? { ...u, name: userForm.name, email: userForm.email, role: userForm.role, status: userForm.status }
                    : u
            ));
        } else {
            const newUser = {
                id: `U${String(users.length + 1).padStart(3, '0')}`,
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                status: userForm.status,
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: 'Never'
            };
            setUsers([...users, newUser]);
        }
        setShowUserDialog(false);
        resetUserForm();
    };

    const handleEditUser = (user: any) => {
        setUserForm({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status
        });
        setEditingUser(user);
        setShowUserDialog(true);
    };

    const handleDeleteUser = (id: any) => {
        setUsers(users.filter(u => u.id !== id));
    };

    // Department Management Functions
    const resetDepartmentForm = () => {
        setDepartmentForm({
            name: '',
            manager: '',
            employeeCount: '',
            description: ''
        });
        setEditingDepartment(null);
    };

    const handleSaveDepartment = () => {
        if (editingDepartment) {
            setDepartments(departments.map(d =>
                d.id === editingDepartment
                    ? { ...d, name: departmentForm.name, manager: departmentForm.manager, employeeCount: Number(departmentForm.employeeCount), description: departmentForm.description }
                    : d
            ));
        } else {
            const newDepartment = {
                id: `D${String(departments.length + 1).padStart(3, '0')}`,
                name: departmentForm.name,
                manager: departmentForm.manager,
                employeeCount: Number(departmentForm.employeeCount),
                description: departmentForm.description
            };
            setDepartments([...departments, newDepartment]);
        }
        setShowDepartmentDialog(false);
        resetDepartmentForm();
    };

    const handleEditDepartment = (department: any) => {
        setDepartmentForm({
            name: department.name,
            manager: department.manager,
            employeeCount: String(department.employeeCount),
            description: department.description
        });
        setEditingDepartment(department);
        setShowDepartmentDialog(true);
    };

    const handleDeleteDepartment = (id: any) => {
        if (confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
            setDepartments(departments.filter(d => d.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">System Settings</h1>
                    <p className="text-muted-foreground">
                        Configure system preferences and policies
                    </p>
                </div>
                {hasChanges && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={resetToDefaults}>
                            Reset to Defaults
                        </Button>
                        <Button onClick={saveSettings}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {hasChanges && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        You have unsaved changes. Make sure to save your settings before leaving this page.
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="hr-policies">HR Policies</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                General Settings
                            </CardTitle>
                            <CardDescription>
                                Basic system configuration and company information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Company Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-4">Basic Information</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input
                                                id="companyName"
                                                value={settings.companyName}
                                                onChange={(e) => updateSetting('companyName', e.target.value)}
                                                placeholder="Enter your company name"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="industry">Industry</Label>
                                                <Select value={settings.industry} onValueChange={(value) => updateSetting('industry', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Technology">Technology</SelectItem>
                                                        <SelectItem value="Finance">Finance</SelectItem>
                                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                        <SelectItem value="Retail">Retail</SelectItem>
                                                        <SelectItem value="Education">Education</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="companySize">Company Size</Label>
                                                <Select value={settings.companySize} onValueChange={(value) => updateSetting('companySize', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1-10">1-10 employees</SelectItem>
                                                        <SelectItem value="11-50">11-50 employees</SelectItem>
                                                        <SelectItem value="51-100">51-100 employees</SelectItem>
                                                        <SelectItem value="100-500">100-500 employees</SelectItem>
                                                        <SelectItem value="500+">500+ employees</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="foundedYear">Founded Year</Label>
                                                <Input
                                                    id="foundedYear"
                                                    value={settings.foundedYear}
                                                    onChange={(e) => updateSetting('foundedYear', e.target.value)}
                                                    placeholder="e.g., 2010"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    id="website"
                                                    value={settings.website}
                                                    onChange={(e) => updateSetting('website', e.target.value)}
                                                    placeholder="www.yourcompany.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Mission & Vision */}
                                <div>
                                    <h3 className="font-medium mb-4">Mission & Vision</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyMission">Company Mission</Label>
                                            <Textarea
                                                id="companyMission"
                                                value={settings.companyMission}
                                                onChange={(e) => updateSetting('companyMission', e.target.value)}
                                                placeholder="Enter your company's mission statement..."
                                                rows={3}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Define your company's purpose and what you aim to achieve
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="companyVision">Company Vision</Label>
                                            <Textarea
                                                id="companyVision"
                                                value={settings.companyVision}
                                                onChange={(e) => updateSetting('companyVision', e.target.value)}
                                                placeholder="Enter your company's vision statement..."
                                                rows={3}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Describe your company's long-term aspirations and goals
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Legal Information */}
                                <div>
                                    <h3 className="font-medium mb-4">Legal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="registrationNumber">Registration Number</Label>
                                            <Input
                                                id="registrationNumber"
                                                value={settings.registrationNumber}
                                                onChange={(e) => updateSetting('registrationNumber', e.target.value)}
                                                placeholder="REG-2024-12345"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="taxId">Tax ID / EIN</Label>
                                            <Input
                                                id="taxId"
                                                value={settings.taxId}
                                                onChange={(e) => updateSetting('taxId', e.target.value)}
                                                placeholder="12-3456789"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Contact Information */}
                                <div>
                                    <h3 className="font-medium mb-4">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="primaryEmail">Primary Email</Label>
                                                <Input
                                                    id="primaryEmail"
                                                    type="email"
                                                    value={settings.primaryEmail}
                                                    onChange={(e) => updateSetting('primaryEmail', e.target.value)}
                                                    placeholder="info@company.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    value={settings.phoneNumber}
                                                    onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Street Address</Label>
                                            <Input
                                                id="address"
                                                value={settings.address}
                                                onChange={(e) => updateSetting('address', e.target.value)}
                                                placeholder="123 Business Street"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={settings.city}
                                                    onChange={(e) => updateSetting('city', e.target.value)}
                                                    placeholder="San Francisco"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state">State / Province</Label>
                                                <Input
                                                    id="state"
                                                    value={settings.state}
                                                    onChange={(e) => updateSetting('state', e.target.value)}
                                                    placeholder="California"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="postalCode">Postal Code</Label>
                                                <Input
                                                    id="postalCode"
                                                    value={settings.postalCode}
                                                    onChange={(e) => updateSetting('postalCode', e.target.value)}
                                                    placeholder="94102"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    id="country"
                                                    value={settings.country}
                                                    onChange={(e) => updateSetting('country', e.target.value)}
                                                    placeholder="United States"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Departments */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium">Departments</h3>
                                        <Button onClick={() => {
                                            resetDepartmentForm();
                                            setShowDepartmentDialog(true);
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Department
                                        </Button>
                                    </div>

                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Department Name</TableHead>
                                                    <TableHead>Manager</TableHead>
                                                    <TableHead>Employees</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {departments.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                            No departments added yet. Click "Add Department" to create one.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    departments.map((dept) => (
                                                        <TableRow key={dept.id}>
                                                            <TableCell className="font-medium">{dept.name}</TableCell>
                                                            <TableCell>{dept.manager}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">{dept.employeeCount}</Badge>
                                                            </TableCell>
                                                            <TableCell className="max-w-xs truncate">{dept.description}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditDepartment(dept)}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteDepartment(dept.id)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Configure security policies and access controls
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passwordPolicy">Password Policy</Label>
                                        <Select value={settings.passwordPolicy} onValueChange={(value) => updateSetting('passwordPolicy', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low - 6 characters minimum</SelectItem>
                                                <SelectItem value="medium">Medium - 8 characters, mixed case</SelectItem>
                                                <SelectItem value="high">High - 12 characters, special chars</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Two-Factor Authentication</Label>
                                            <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                                        </div>
                                        <Switch
                                            checked={settings.twoFactorAuth}
                                            onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Audit Logging</Label>
                                            <p className="text-sm text-muted-foreground">Log all system activities</p>
                                        </div>
                                        <Switch
                                            checked={settings.auditLogging}
                                            onCheckedChange={(checked) => updateSetting('auditLogging', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        User Management
                                    </CardTitle>
                                    <CardDescription>
                                        Manage system administrators and their access levels
                                    </CardDescription>
                                </div>
                                <Button onClick={() => {
                                    resetUserForm();
                                    setShowUserDialog(true);
                                }}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add User
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-6">
                                <Shield className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Important:</strong> Super Admin has full system access. Admin can manage employees, payroll, and attendance but cannot modify system settings.
                                </AlertDescription>
                            </Alert>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'Super Admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {user.createdAt}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {user.lastLogin}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{user.name}"? This action cannot be undone and will revoke all access for this user.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    Role Permissions Overview
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Super Admin:</span> Full system access including settings, user management, and all modules
                                    </div>
                                    <div>
                                        <span className="font-medium">Admin:</span> Employee management, payroll, attendance, leaves, recruitment, and reports
                                    </div>
                                    <div>
                                        <span className="font-medium">HR Manager:</span> Employee management, attendance, leaves, and recruitment (limited payroll access)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hr-policies">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Working Hours & Overtime
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="workingHours">Daily Working Hours</Label>
                                        <Input
                                            id="workingHours"
                                            type="number"
                                            value={settings.workingHours}
                                            onChange={(e) => updateSetting('workingHours', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lunchBreak">Lunch Break (hours)</Label>
                                        <Input
                                            id="lunchBreak"
                                            type="number"
                                            step="0.5"
                                            value={settings.lunchBreak}
                                            onChange={(e) => updateSetting('lunchBreak', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="overtimeRate">Overtime Rate Multiplier</Label>
                                        <Input
                                            id="overtimeRate"
                                            type="number"
                                            step="0.1"
                                            value={settings.overtimeRate}
                                            onChange={(e) => updateSetting('overtimeRate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Leave Policies
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="annualLeave">Annual Leave (days)</Label>
                                        <Input
                                            id="annualLeave"
                                            type="number"
                                            value={settings.annualLeave}
                                            onChange={(e) => updateSetting('annualLeave', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sickLeave">Sick Leave (days)</Label>
                                        <Input
                                            id="sickLeave"
                                            type="number"
                                            value={settings.sickLeave}
                                            onChange={(e) => updateSetting('sickLeave', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maternityLeave">Maternity Leave (weeks)</Label>
                                        <Input
                                            id="maternityLeave"
                                            type="number"
                                            value={settings.maternityLeave}
                                            onChange={(e) => updateSetting('maternityLeave', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paternityLeave">Paternity Leave (weeks)</Label>
                                        <Input
                                            id="paternityLeave"
                                            type="number"
                                            value={settings.paternityLeave}
                                            onChange={(e) => updateSetting('paternityLeave', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Attendance Settings
                            </CardTitle>
                            <CardDescription>
                                Configure attendance tracking and policies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
                                        <Input
                                            id="lateThreshold"
                                            type="number"
                                            value={settings.lateThreshold}
                                            onChange={(e) => updateSetting('lateThreshold', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="halfDayThreshold">Half Day Threshold (hours)</Label>
                                        <Input
                                            id="halfDayThreshold"
                                            type="number"
                                            value={settings.halfDayThreshold}
                                            onChange={(e) => updateSetting('halfDayThreshold', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Attendance Tracking</Label>
                                            <p className="text-sm text-muted-foreground">Enable automatic attendance tracking</p>
                                        </div>
                                        <Switch
                                            checked={settings.attendanceTracking}
                                            onCheckedChange={(checked) => updateSetting('attendanceTracking', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Geofencing</Label>
                                            <p className="text-sm text-muted-foreground">Restrict clock-in by location</p>
                                        </div>
                                        <Switch
                                            checked={settings.geofencing}
                                            onCheckedChange={(checked) => updateSetting('geofencing', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notification Settings
                            </CardTitle>
                            <CardDescription>
                                Configure system notifications and reminders
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                                    </div>
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Payroll Reminders</Label>
                                        <p className="text-sm text-muted-foreground">Remind managers about payroll processing</p>
                                    </div>
                                    <Switch
                                        checked={settings.payrollReminders}
                                        onCheckedChange={(checked) => updateSetting('payrollReminders', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Leave Approval Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Notify managers of pending leave requests</p>
                                    </div>
                                    <Switch
                                        checked={settings.leaveApprovals}
                                        onCheckedChange={(checked) => updateSetting('leaveApprovals', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Birthday Reminders</Label>
                                        <p className="text-sm text-muted-foreground">Send birthday notifications for employees</p>
                                    </div>
                                    <Switch
                                        checked={settings.birthdayReminders}
                                        onCheckedChange={(checked) => updateSetting('birthdayReminders', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                System Integrations
                            </CardTitle>
                            <CardDescription>
                                Manage external system integrations and APIs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">Accounting System</div>
                                        <div className="text-sm text-muted-foreground">QuickBooks Integration</div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Connected
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">Time Tracking</div>
                                        <div className="text-sm text-muted-foreground">Biometric Clock System</div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Connected
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">Email Service</div>
                                        <div className="text-sm text-muted-foreground">SMTP Configuration</div>
                                    </div>
                                    <Badge variant="secondary">
                                        Not Configured
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">Background Check</div>
                                        <div className="text-sm text-muted-foreground">Third-party verification service</div>
                                    </div>
                                    <Badge variant="secondary">
                                        Not Connected
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* User Dialog */}
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Update user information and access level' : 'Create a new system administrator account'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Full Name</Label>
                            <Input
                                id="userName"
                                value={userForm.name}
                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userEmail">Email Address</Label>
                            <Input
                                id="userEmail"
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                placeholder="admin@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userPassword">
                                {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                            </Label>
                            <Input
                                id="userPassword"
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                placeholder={editingUser ? 'Enter new password...' : 'Enter password...'}
                            />
                            {!editingUser && (
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 8 characters with mixed case and special characters
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userRole">Role</Label>
                            <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="HR Manager">HR Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userStatus">Status</Label>
                            <Select value={userForm.status} onValueChange={(value) => setUserForm({ ...userForm, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowUserDialog(false);
                            resetUserForm();
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>
                            {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Department Dialog */}
            <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            {editingDepartment ? 'Edit Department' : 'Add New Department'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingDepartment ? 'Update department information' : 'Create a new department in your organization'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="deptName">Department Name</Label>
                            <Input
                                id="deptName"
                                value={departmentForm.name}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                                placeholder="e.g., Engineering, Marketing"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deptManager">Department Manager</Label>
                            <Input
                                id="deptManager"
                                value={departmentForm.manager}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, manager: e.target.value })}
                                placeholder="e.g., John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deptEmployees">Number of Employees</Label>
                            <Input
                                id="deptEmployees"
                                type="number"
                                value={departmentForm.employeeCount}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, employeeCount: e.target.value })}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deptDescription">Description</Label>
                            <Textarea
                                id="deptDescription"
                                value={departmentForm.description}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                                placeholder="Brief description of the department's role and responsibilities"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowDepartmentDialog(false);
                            resetDepartmentForm();
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveDepartment}>
                            {editingDepartment ? 'Update Department' : 'Add Department'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SettingsComponent