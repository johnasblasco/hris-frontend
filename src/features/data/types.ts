

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    clockIn: string;
    clockOut: string;
    checkIn: string | null;
    checkOut: string | null;
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


// EMPLOYEE SECTION TYPES
export interface Department {
    id: number;
    name: string;
}

export interface PositionType {
    id: number;
    title: string;
}

export interface Employee {
    id: number;
    employee_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    department_id: number | null;
    position_id: number | null;
    base_salary: number;
    hire_date: string;
    is_active: boolean;
    manager_id: number | null;
    department?: Department;
    position?: PositionType;
    manager?: Employee;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T;
}
