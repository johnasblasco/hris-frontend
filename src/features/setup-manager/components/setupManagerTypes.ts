// Base entity interface
export interface BaseEntity {
    id: string;
}

// Company Information
export interface CompanyInfo {
    companyName: string;
    companyLogo: string;
    companyMission: string;
    companyVision: string;
    registrationNumber: string;
    taxId: string;
    foundedYear: string;
    industry: string;
    companySize: string;
    website: string;
    primaryEmail: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Department
export interface Department extends BaseEntity {
    name: string;
    description: string;
}

// Position
export interface Position extends BaseEntity {
    title: string;
    department: string;
    level: string;
    description: string;
}


// Leave Type
export interface LeaveType extends BaseEntity {
    name: string;
    defaultDays: number;
    requiresApproval: boolean;
    description: string;
}

// Benefit Type
export interface BenefitType extends BaseEntity {
    name: string;
    category: any;
    description: string;
}

// Employment Type
export interface EmploymentType extends BaseEntity {
    name: string;
    description: string;
}

// Work Location
export interface WorkLocation extends BaseEntity {
    name: string;
    address: string;
    isRemote: boolean;
    locationType: any;
}

// Holiday
export interface Holiday extends BaseEntity {
    name: string;
    date: string; // ISO string format YYYY-MM-DD
    type: string;
}


// Work Shift
export interface WorkShift extends BaseEntity {
    name: string;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    description: string;
}


// Main Setup Data Interface
export interface SetupData extends CompanyInfo {
    departments: Department[];
    positions: Position[];
    leaveTypes: LeaveType[];
    benefitTypes: BenefitType[];
    employmentTypes: EmploymentType[];
    workLocations: WorkLocation[];
    holidays: Holiday[];
    workShifts: WorkShift[];
}

// Step Component Props
export interface StepComponentProps {
    setupData: SetupData;
    setSetupData: (data: SetupData) => void;
}

// Setup Step Configuration
export interface SetupStep {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    description?: string;
}

// Form State for Individual Steps
export interface DepartmentFormData {
    name: string;
    description: string;
}

export interface PositionFormData {
    title: string;
    department: string;
    level: string;
}

export interface LeaveTypeFormData {
    name: string;
    defaultDays: number;
    requiresApproval: boolean;
}

export interface BenefitTypeFormData {
    name: string;
    category: any;
    description: string | undefined;
}

export interface EmploymentTypeFormData {
    name: string;
    description: string;
}

export interface WorkLocationFormData {
    name: string;
    address: string;
    isRemote: boolean;
}

export interface HolidayFormData {
    name: string;
    date: string;
    type: string;
}

export interface WorkShiftFormData {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
}

// Validation Types
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface StepValidation {
    [key: string]: ValidationResult;
}

// API Response Types (for future backend integration)
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

export interface SetupCompletionResponse {
    success: boolean;
    message: string;
    setupId?: string;
    completedAt?: string;
}

// Local Storage Types
export interface StoredSetupData {
    data: SetupData;
    completed: boolean;
    completedAt?: string;
    version: string;
}

// Progress Types
export interface SetupProgress {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    progressPercentage: number;
}

// Navigation Types
export interface NavigationState {
    canProceed: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    isLastStep: boolean;
}

// Export all form data types as a union for generic handling
export type FormDataTypes =
    | DepartmentFormData
    | PositionFormData
    | LeaveTypeFormData
    | BenefitTypeFormData
    | EmploymentTypeFormData
    | WorkLocationFormData
    | HolidayFormData
    | WorkShiftFormData;

// Utility types for component props
export type WithChildren = {
    children: React.ReactNode;
};

export type WithClassName = {
    className?: string;
};

// Table column configuration types
export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    render?: (item: T) => React.ReactNode;
}

// Select option types
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// Time range type for shifts
export interface TimeRange {
    start: string;
    end: string;
}

// Date range type for holidays
export interface DateRange {
    start: Date;
    end: Date;
}

// Filter types for tables
export interface TableFilter {
    key: string;
    value: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
}

// Pagination types
export interface PaginationState {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// Sort types
export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

// Search types
export interface SearchConfig {
    query: string;
    fields: string[];
}

// Bulk operations
export interface BulkOperationResult {
    successful: number;
    failed: number;
    errors: string[];
}

// Import/Export types
export interface ImportResult {
    imported: number;
    skipped: number;
    errors: string[];
}

export interface ExportConfig {
    format: 'json' | 'csv' | 'excel';
    includeMetadata: boolean;
}

// Settings and configuration
export interface SetupConfig {
    allowSkip: boolean;
    requireValidation: boolean;
    autoSave: boolean;
    showProgress: boolean;
    maxItemsPerStep: number;
}

// Error types
export interface SetupError {
    code: string;
    message: string;
    field?: string;
    step?: string;
}

// Event types
export interface SetupEvent {
    type: 'step_change' | 'data_update' | 'validation' | 'completion';
    timestamp: string;
    data?: any;
}

// Hook return types
export interface UseSetupManagerReturn {
    currentStep: number;
    setupData: SetupData;
    progress: number;
    navigation: NavigationState;
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    updateData: (updates: Partial<SetupData>) => void;
    validateStep: (step: number) => ValidationResult;
    completeSetup: () => Promise<SetupCompletionResponse>;
}

// Context types
export interface SetupContextType {
    setupData: SetupData;
    currentStep: number;
    updateSetupData: (data: Partial<SetupData>) => void;
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    isStepValid: (step: number) => boolean;
}

// Props for provider
export interface SetupProviderProps {
    children: React.ReactNode;
    initialData?: Partial<SetupData>;
    onSetupComplete?: (data: SetupData) => void;
}

// Custom hook options
export interface UseSetupOptions {
    autoSave?: boolean;
    validation?: boolean;
    persist?: boolean;
}

// Export all types with clear naming
export type {
    // Re-export for backward compatibility with clear names
    CompanyInfo as CompanyInfoData,
    Department as DepartmentData,
    Position as PositionData,
    LeaveType as LeaveTypeData,
    BenefitType as BenefitTypeData,
    EmploymentType as EmploymentTypeData,
    WorkLocation as WorkLocationData,
    Holiday as HolidayData,
    WorkShift as WorkShiftData,
};

