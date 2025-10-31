import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    DollarSign,
    Calculator,
    FileText,
    Eye,
    Download,
    Building2,
    Calendar,
    User,
    TrendingUp,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

// Define Employee type with all properties and computed getters
interface Employee {
    id: string;
    name: string;
    department: string;
    position: string;
    baseSalary: number;
    hoursWorked: number;
    overtimeHours: number;
    overtimeRate: number;
    bonuses: number;
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    retirement401k: number;

    // Computed getters (TypeScript doesn't infer these unless defined)
    readonly monthlyBasePay: number;
    readonly overtimePay: number;
    readonly grossPay: number;
    readonly totalDeductions: number;
    readonly netPay: number;
}

// Employee payroll data (now properly typed)
const employees: Employee[] = [
    {
        id: "EMP001",
        name: "Alice Johnson",
        department: "Engineering",
        position: "Senior Developer",
        baseSalary: 95000,
        hoursWorked: 160,
        overtimeHours: 8,
        overtimeRate: 71.25,
        bonuses: 2500,
        federalTax: 1950,
        stateTax: 570,
        socialSecurity: 495,
        medicare: 115,
        healthInsurance: 425,
        retirement401k: 792,
        // Define getters as computed properties (they are evaluated on access)
        get monthlyBasePay() { return this.baseSalary / 12; },
        get overtimePay() { return this.overtimeHours * this.overtimeRate; },
        get grossPay() { return this.monthlyBasePay + this.overtimePay + this.bonuses; },
        get totalDeductions() {
            return this.federalTax + this.stateTax + this.socialSecurity + this.medicare +
                this.healthInsurance + this.retirement401k;
        },
        get netPay() { return this.grossPay - this.totalDeductions; }
    },
    {
        id: "EMP002",
        name: "Bob Chen",
        department: "Sales",
        position: "Sales Manager",
        baseSalary: 85000,
        hoursWorked: 160,
        overtimeHours: 0,
        overtimeRate: 0,
        bonuses: 3000,
        federalTax: 1700,
        stateTax: 500,
        socialSecurity: 443,
        medicare: 103,
        healthInsurance: 425,
        retirement401k: 708,
        get monthlyBasePay() { return this.baseSalary / 12; },
        get overtimePay() { return this.overtimeHours * this.overtimeRate; },
        get grossPay() { return this.monthlyBasePay + this.overtimePay + this.bonuses; },
        get totalDeductions() {
            return this.federalTax + this.stateTax + this.socialSecurity + this.medicare +
                this.healthInsurance + this.retirement401k;
        },
        get netPay() { return this.grossPay - this.totalDeductions; }
    },
    {
        id: "EMP003",
        name: "Carol Davis",
        department: "Marketing",
        position: "Marketing Specialist",
        baseSalary: 65000,
        hoursWorked: 160,
        overtimeHours: 4,
        overtimeRate: 48.75,
        bonuses: 1500,
        federalTax: 1300,
        stateTax: 380,
        socialSecurity: 341,
        medicare: 80,
        healthInsurance: 425,
        retirement401k: 542,
        get monthlyBasePay() { return this.baseSalary / 12; },
        get overtimePay() { return this.overtimeHours * this.overtimeRate; },
        get grossPay() { return this.monthlyBasePay + this.overtimePay + this.bonuses; },
        get totalDeductions() {
            return this.federalTax + this.stateTax + this.socialSecurity + this.medicare +
                this.healthInsurance + this.retirement401k;
        },
        get netPay() { return this.grossPay - this.totalDeductions; }
    }
];

export function PayrollProcessing() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showPayStub, setShowPayStub] = useState<Employee | null>(null);

    // Calculate totals
    const totalGrossPay = employees.reduce((sum, emp) => sum + emp.grossPay, 0);
    const totalDeductions = employees.reduce((sum, emp) => sum + emp.totalDeductions, 0);
    const totalNetPay = employees.reduce((sum, emp) => sum + emp.netPay, 0);

    const handleDownloadPayStub = (employee: Employee) => {
        toast.success(`Pay stub for ${employee.name} downloaded successfully!`);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div>
                <h2 className="text-3xl font-bold">Payroll Management</h2>
                <p className="text-muted-foreground">Payroll is automatically calculated based on the salary and benefits</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Employees</p>
                                <p className="text-2xl font-bold">{employees.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Gross Pay</p>
                                <p className="text-2xl font-bold">${totalGrossPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Deductions</p>
                                <p className="text-2xl font-bold">${totalDeductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <Calculator className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                                <p className="text-2xl font-bold">${totalNetPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Payroll Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Employee Payroll Overview</CardTitle>
                    <CardDescription>Current month payroll details for all employees</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Base Pay</TableHead>
                                <TableHead>Overtime</TableHead>
                                <TableHead>Bonuses</TableHead>
                                <TableHead>Gross Pay</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{employee.name}</div>
                                                <div className="text-sm text-muted-foreground">{employee.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{employee.department}</div>
                                            <div className="text-sm text-muted-foreground">{employee.position}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        ${employee.monthlyBasePay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell>
                                        {employee.overtimeHours > 0 ? (
                                            <span className="text-green-600">
                                                +${employee.overtimePay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">$0</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {employee.bonuses > 0 ? (
                                            <span className="text-green-600">
                                                +${employee.bonuses.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">$0</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${employee.grossPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell className="text-red-600">
                                        -${employee.totalDeductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell className="font-bold text-green-600">
                                        ${employee.netPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedEmployee(employee)}
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowPayStub(employee)}
                                            >
                                                <FileText className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Employee Detail Modal */}
            {selectedEmployee && (
                <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
                    <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Payroll Breakdown - {selectedEmployee.name}</DialogTitle>
                            <DialogDescription>Detailed earnings and deductions</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* Employee Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Employee ID</p>
                                    <p className="font-medium">{selectedEmployee.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{selectedEmployee.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Position</p>
                                    <p className="font-medium">{selectedEmployee.position}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Annual Salary</p>
                                    <p className="font-medium">${selectedEmployee.baseSalary.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Earnings */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        Earnings
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Monthly Base Pay:</span>
                                            <span className="font-medium">${selectedEmployee.monthlyBasePay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Overtime Pay:</span>
                                            <span className="font-medium text-green-600">+${selectedEmployee.overtimePay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Bonuses:</span>
                                            <span className="font-medium text-green-600">+${selectedEmployee.bonuses.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Gross Pay:</span>
                                            <span className="font-bold">${selectedEmployee.grossPay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-red-600" />
                                        Deductions
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Federal Tax:</span>
                                            <span>-${selectedEmployee.federalTax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>State Tax:</span>
                                            <span>-${selectedEmployee.stateTax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Social Security:</span>
                                            <span>-${selectedEmployee.socialSecurity.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Medicare:</span>
                                            <span>-${selectedEmployee.medicare.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Health Insurance:</span>
                                            <span>-${selectedEmployee.healthInsurance.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>401(k) Retirement:</span>
                                            <span>-${selectedEmployee.retirement401k.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Total Deductions:</span>
                                            <span className="font-bold text-red-600">-${selectedEmployee.totalDeductions.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                                <p className="text-sm text-green-700 mb-1">Net Pay</p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${selectedEmployee.netPay.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                                Close
                            </Button>
                            <Button onClick={() => {
                                setShowPayStub(selectedEmployee);
                                setSelectedEmployee(null);
                            }}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Pay Stub
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Pay Stub Modal */}
            {showPayStub && (
                <Dialog open={!!showPayStub} onOpenChange={() => setShowPayStub(null)}>
                    <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Official Pay Stub</DialogTitle>
                            <DialogDescription>Payment statement for the current period</DialogDescription>
                        </DialogHeader>

                        {/* Pay Stub Design */}
                        <div className="bg-white p-8 border-2 rounded-lg">
                            {/* Header */}
                            <div className="text-center mb-6 border-b-2 pb-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Building2 className="w-8 h-8 text-primary" />
                                    <h2 className="text-2xl font-bold">Sellora Corporation</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">123 Business Avenue, Tech City, TC 12345</p>
                                <h3 className="text-xl font-semibold mt-3 text-primary">EARNINGS STATEMENT</h3>
                            </div>

                            {/* Employee & Pay Period Info */}
                            <div className="grid grid-cols-2 gap-8 mb-6 p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <User className="w-4 h-4" />
                                        Employee Information
                                    </h4>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span className="font-medium">{showPayStub.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ID:</span>
                                            <span className="font-medium">{showPayStub.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Department:</span>
                                            <span className="font-medium">{showPayStub.department}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Position:</span>
                                            <span className="font-medium">{showPayStub.position}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Calendar className="w-4 h-4" />
                                        Pay Period Details
                                    </h4>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Period:</span>
                                            <span className="font-medium">Oct 1 - Oct 31, 2025</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Pay Date:</span>
                                            <span className="font-medium">Nov 1, 2025</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Regular Hours:</span>
                                            <span className="font-medium">{showPayStub.hoursWorked} hrs</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Overtime Hours:</span>
                                            <span className="font-medium">{showPayStub.overtimeHours} hrs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Earnings and Deductions */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Earnings */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-4 bg-green-50 text-green-800 p-2 rounded flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        EARNINGS
                                    </h4>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between">
                                            <span>Regular Pay:</span>
                                            <span className="font-medium">${showPayStub.monthlyBasePay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Overtime Pay:</span>
                                            <span className="font-medium">${showPayStub.overtimePay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bonuses:</span>
                                            <span className="font-medium">${showPayStub.bonuses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between pt-2">
                                            <span className="font-bold">GROSS PAY:</span>
                                            <span className="font-bold text-lg">${showPayStub.grossPay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-4 bg-red-50 text-red-800 p-2 rounded flex items-center gap-2">
                                        <Calculator className="w-4 h-4" />
                                        DEDUCTIONS
                                    </h4>
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex justify-between">
                                            <span>Federal Tax:</span>
                                            <span className="font-medium">${showPayStub.federalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>State Tax:</span>
                                            <span className="font-medium">${showPayStub.stateTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Social Security:</span>
                                            <span className="font-medium">${showPayStub.socialSecurity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Medicare:</span>
                                            <span className="font-medium">${showPayStub.medicare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Health Insurance:</span>
                                            <span className="font-medium">${showPayStub.healthInsurance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>401(k) Retirement:</span>
                                            <span className="font-medium">${showPayStub.retirement401k.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between pt-2">
                                            <span className="font-bold">TOTAL DEDUCTIONS:</span>
                                            <span className="font-bold text-lg text-red-600">${showPayStub.totalDeductions.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay Highlight */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl text-center border-2 border-green-300 shadow-sm">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">NET PAY</h3>
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    ${showPayStub.netPay.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-sm text-green-700">
                                    Amount deposited to your account
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t-2 text-center text-xs text-muted-foreground space-y-1">
                                <p className="font-medium">This is an electronically generated pay stub. Please retain for your records.</p>
                                <p>For questions regarding this statement, contact HR at hr@sellora.com or call (555) 123-4567</p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowPayStub(null)}>
                                Close
                            </Button>
                            <Button onClick={() => handleDownloadPayStub(showPayStub)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}