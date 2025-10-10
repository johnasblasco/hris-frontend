export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    status: 'active' | 'inactive';
    manager?: string;
    avatar?: string;
}

export interface Department {
    id: string;
    name: string;
    manager: string;
    employeeCount: number;
    budget: number;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    clockIn: string;
    clockOut: string;
    hoursWorked: number;
    status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
    startDate: string;
    endDate: string;
    days: number;
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    appliedDate: string;
}

export interface PayrollSummary {
    employeeId: string;
    employeeName: string;
    baseSalary: number;
    overtime: number;
    bonuses: number;
    deductions: number;
    netPay: number;
    payPeriod: string;
}