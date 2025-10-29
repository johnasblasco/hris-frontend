import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Employee, Department, PositionType } from '../employeeTS';
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
    const [activeTab, setActiveTab] = useState("personal");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [files201, setFiles201] = useState<File[]>([]); // For multiple 201 files

    // Open edit dialog when editingEmployee changes
    useEffect(() => {
        if (editingEmployee) {
            setIsEditDialogOpen(true);
            setActiveTab("personal");
        }
    }, [editingEmployee]);

    const resetForm = () => {
        setResumeFile(null);
        setFiles201([]);
        setError(null);
        setActiveTab("personal");
    };

    const handleAddEmployee = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const submitData = new FormData();

            // 🔹 Basic Info
            submitData.append('first_name', formData.get('first_name') as string);
            submitData.append('middle_name', formData.get('middle_name') as string || '');
            submitData.append('last_name', formData.get('last_name') as string);
            submitData.append('suffix', formData.get('suffix') as string || '');
            submitData.append('email', formData.get('email') as string);
            submitData.append('phone', formData.get('phone') as string || '');
            submitData.append('date_of_birth', formData.get('date_of_birth') as string || '');
            submitData.append('place_of_birth', formData.get('place_of_birth') as string || '');
            submitData.append('sex', formData.get('sex') as string || '');
            submitData.append('civil_status', formData.get('civil_status') as string || '');
            submitData.append('height_m', formData.get('height_m') as string || '');
            submitData.append('weight_kg', formData.get('weight_kg') as string || '');
            submitData.append('blood_type', formData.get('blood_type') as string || '');
            submitData.append('citizenship', formData.get('citizenship') as string || '');

            // 🔹 Password (required by backend)
            submitData.append('password', formData.get('password') as string || 'TempPassword123!');

            // 🔹 Government IDs
            submitData.append('gsis_no', formData.get('gsis_no') as string || '');
            submitData.append('pagibig_no', formData.get('pagibig_no') as string || '');
            submitData.append('philhealth_no', formData.get('philhealth_no') as string || '');
            submitData.append('sss_no', formData.get('sss_no') as string || '');
            submitData.append('tin_no', formData.get('tin_no') as string || '');
            submitData.append('agency_employee_no', formData.get('agency_employee_no') as string || '');

            // 🔹 Address Information
            submitData.append('residential_address', formData.get('residential_address') as string || '');
            submitData.append('residential_zipcode', formData.get('residential_zipcode') as string || '');
            submitData.append('residential_tel_no', formData.get('residential_tel_no') as string || '');
            submitData.append('permanent_address', formData.get('permanent_address') as string || '');
            submitData.append('permanent_zipcode', formData.get('permanent_zipcode') as string || '');
            submitData.append('permanent_tel_no', formData.get('permanent_tel_no') as string || '');

            // 🔹 Family Information
            submitData.append('spouse_name', formData.get('spouse_name') as string || '');
            submitData.append('spouse_occupation', formData.get('spouse_occupation') as string || '');
            submitData.append('spouse_employer', formData.get('spouse_employer') as string || '');
            submitData.append('spouse_business_address', formData.get('spouse_business_address') as string || '');
            submitData.append('spouse_tel_no', formData.get('spouse_tel_no') as string || '');
            submitData.append('father_name', formData.get('father_name') as string || '');
            submitData.append('mother_name', formData.get('mother_name') as string || '');
            submitData.append('parents_address', formData.get('parents_address') as string || '');

            // 🔹 Emergency Contact
            submitData.append('emergency_contact_name', formData.get('emergency_contact_name') as string || '');
            submitData.append('emergency_contact_number', formData.get('emergency_contact_number') as string || '');
            submitData.append('emergency_contact_relation', formData.get('emergency_contact_relation') as string || '');

            // 🔹 Employment Information
            submitData.append('department_id', formData.get('department_id') as string || '');
            submitData.append('position_id', formData.get('position_id') as string || '');
            submitData.append('employment_type_id', formData.get('employment_type_id') as string || '');
            submitData.append('manager_id', formData.get('manager_id') as string || '');
            submitData.append('supervisor_id', formData.get('supervisor_id') as string || '');
            submitData.append('base_salary', formData.get('base_salary') as string);
            submitData.append('hire_date', formData.get('hire_date') as string);
            submitData.append('role', formData.get('role') as string || 'employee');
            submitData.append('is_active', formData.get('is_active') ? 'true' : 'false');

            // 🔹 Educational Background - Elementary
            submitData.append('elementary_school_name', formData.get('elementary_school_name') as string || '');
            submitData.append('elementary_degree_course', formData.get('elementary_degree_course') as string || '');
            submitData.append('elementary_year_graduated', formData.get('elementary_year_graduated') as string || '');
            submitData.append('elementary_highest_level', formData.get('elementary_highest_level') as string || '');
            submitData.append('elementary_inclusive_dates', formData.get('elementary_inclusive_dates') as string || '');
            submitData.append('elementary_honors', formData.get('elementary_honors') as string || '');

            // 🔹 Educational Background - Secondary
            submitData.append('secondary_school_name', formData.get('secondary_school_name') as string || '');
            submitData.append('secondary_degree_course', formData.get('secondary_degree_course') as string || '');
            submitData.append('secondary_year_graduated', formData.get('secondary_year_graduated') as string || '');
            submitData.append('secondary_highest_level', formData.get('secondary_highest_level') as string || '');
            submitData.append('secondary_inclusive_dates', formData.get('secondary_inclusive_dates') as string || '');
            submitData.append('secondary_honors', formData.get('secondary_honors') as string || '');

            // 🔹 Educational Background - Vocational
            submitData.append('vocational_school_name', formData.get('vocational_school_name') as string || '');
            submitData.append('vocational_degree_course', formData.get('vocational_degree_course') as string || '');
            submitData.append('vocational_year_graduated', formData.get('vocational_year_graduated') as string || '');
            submitData.append('vocational_highest_level', formData.get('vocational_highest_level') as string || '');
            submitData.append('vocational_inclusive_dates', formData.get('vocational_inclusive_dates') as string || '');
            submitData.append('vocational_honors', formData.get('vocational_honors') as string || '');

            // 🔹 Educational Background - College
            submitData.append('college_school_name', formData.get('college_school_name') as string || '');
            submitData.append('college_degree_course', formData.get('college_degree_course') as string || '');
            submitData.append('college_year_graduated', formData.get('college_year_graduated') as string || '');
            submitData.append('college_highest_level', formData.get('college_highest_level') as string || '');
            submitData.append('college_inclusive_dates', formData.get('college_inclusive_dates') as string || '');
            submitData.append('college_honors', formData.get('college_honors') as string || '');

            // 🔹 Educational Background - Graduate
            submitData.append('graduate_school_name', formData.get('graduate_school_name') as string || '');
            submitData.append('graduate_degree_course', formData.get('graduate_degree_course') as string || '');
            submitData.append('graduate_year_graduated', formData.get('graduate_year_graduated') as string || '');
            submitData.append('graduate_highest_level', formData.get('graduate_highest_level') as string || '');
            submitData.append('graduate_inclusive_dates', formData.get('graduate_inclusive_dates') as string || '');
            submitData.append('graduate_honors', formData.get('graduate_honors') as string || '');

            // 🔹 Files
            if (resumeFile) {
                submitData.append('resume', resumeFile);
            }

            // Append multiple 201 files
            files201.forEach(file => {
                submitData.append('201_file[]', file); // Backend expects array
            });

            const response = await api.post('/create/employees', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.isSuccess) {
                onEmployeeAdded();
                setIsAddDialogOpen(false);
                resetForm();
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
            const submitData = new FormData();

            // Personal Information
            submitData.append('first_name', formData.get('first_name') as string);
            submitData.append('middle_name', formData.get('middle_name') as string || '');
            submitData.append('last_name', formData.get('last_name') as string);
            submitData.append('suffix', formData.get('suffix') as string || '');
            submitData.append('email', formData.get('email') as string);
            submitData.append('phone', formData.get('phone') as string || '');
            submitData.append('date_of_birth', formData.get('date_of_birth') as string || '');
            submitData.append('place_of_birth', formData.get('place_of_birth') as string || '');
            submitData.append('sex', formData.get('sex') as string || '');
            submitData.append('civil_status', formData.get('civil_status') as string || '');
            submitData.append('height_m', formData.get('height_m') as string || '');
            submitData.append('weight_kg', formData.get('weight_kg') as string || '');
            submitData.append('blood_type', formData.get('blood_type') as string || '');
            submitData.append('citizenship', formData.get('citizenship') as string || '');

            // Employment Information
            submitData.append('department_id', formData.get('department_id') as string || '');
            submitData.append('position_id', formData.get('position_id') as string || '');
            submitData.append('employment_type_id', formData.get('employment_type_id') as string || '');
            submitData.append('manager_id', formData.get('manager_id') as string || '');
            submitData.append('supervisor_id', formData.get('supervisor_id') as string || '');
            submitData.append('base_salary', formData.get('base_salary') as string);
            submitData.append('hire_date', formData.get('hire_date') as string);
            submitData.append('is_active', formData.get('is_active') ? 'true' : 'false');

            // Files - append multiple 201 files
            files201.forEach(file => {
                submitData.append('201_file[]', file);
            });

            if (resumeFile) {
                submitData.append('resume', resumeFile);
            }

            // Use PUT or PATCH depending on your API
            const response = await api.post(`/employees/${editingEmployee.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.isSuccess) {
                onEmployeeUpdated();
                setIsEditDialogOpen(false);
                setEditingEmployee(null);
                resetForm();
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
            resetForm();
        }
    };

    const handleAddDialogOpenChange = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) {
            resetForm();
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'resume' | '201_file') => {
        const files = event.target.files;
        if (!files) return;

        if (type === 'resume') {
            setResumeFile(files[0]);
        } else {
            // For 201 files, handle multiple files
            const newFiles = Array.from(files);
            setFiles201(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (type: 'resume' | '201_file', index?: number) => {
        if (type === 'resume') {
            setResumeFile(null);
        } else if (index !== undefined) {
            setFiles201(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleNext = () => {
        const tabOrder = ["personal", "education", "employment", "government", "address", "files"];
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex < tabOrder.length - 1) {
            setActiveTab(tabOrder[currentIndex + 1]);
        }
    };

    const renderFormField = (
        label: string,
        name: string,
        type: string = "text",
        placeholder: string = "",
        required: boolean = false,
        defaultValue: any = "",
        options?: { value: string; label: string }[]
    ) => {
        if (type === "select" && options) {
            return (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}{required && " *"}</Label>
                    <Select name={name} required={required} defaultValue={defaultValue?.toString()}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        if (type === "textarea") {
            return (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}{required && " *"}</Label>
                    <Textarea
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        defaultValue={defaultValue}
                    />
                </div>
            );
        }

        if (type === "switch") {
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        name={name}
                        defaultChecked={defaultValue}
                    />
                    <Label htmlFor={name}>{label}</Label>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{label}{required && " *"}</Label>
                <Input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    defaultValue={defaultValue}
                />
            </div>
        );
    };

    const personalInfoFields = (employee?: Employee | null) => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("First Name", "first_name", "text", "John", true, employee?.first_name)}
            {renderFormField("Middle Name", "middle_name", "text", "Middle", false, employee?.middle_name)}
            {renderFormField("Last Name", "last_name", "text", "Doe", true, employee?.last_name)}
            {renderFormField("Suffix", "suffix", "text", "Jr., Sr., III", false, employee?.suffix)}
            {renderFormField("Email", "email", "email", "john.doe@company.com", true, employee?.email)}
            {renderFormField("Phone", "phone", "tel", "+1-555-0101", false, employee?.phone)}
            {renderFormField("Password", "password", "password", "********", !employee, "")}
            {renderFormField("Date of Birth", "date_of_birth", "date", "", false, employee?.date_of_birth)}
            {renderFormField("Place of Birth", "place_of_birth", "text", "City, Country", false, employee?.place_of_birth)}
            {renderFormField("Sex", "sex", "select", "", false, employee?.sex, [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" }
            ])}
            {renderFormField("Civil Status", "civil_status", "select", "", false, employee?.civil_status, [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" }
            ])}
            {renderFormField("Height (m)", "height_m", "number", "1.75", false, employee?.height_m)}
            {renderFormField("Weight (kg)", "weight_kg", "number", "70", false, employee?.weight_kg)}
            {renderFormField("Blood Type", "blood_type", "text", "O+", false, employee?.blood_type)}
            {renderFormField("Citizenship", "citizenship", "text", "Filipino", false, employee?.citizenship)}
        </div>
    );

    const educationInfoFields = (employee?: Employee | null) => (
        <div className="space-y-6">
            <div className="space-y-4">
                <h4 className="font-semibold">Elementary</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "elementary_school_name", "text", "", false, employee?.elementary_school_name)}
                    {renderFormField("Degree/Course", "elementary_degree_course", "text", "", false, employee?.elementary_degree_course)}
                    {renderFormField("Year Graduated", "elementary_year_graduated", "text", "", false, employee?.elementary_year_graduated)}
                    {renderFormField("Highest Level", "elementary_highest_level", "text", "", false, employee?.elementary_highest_level)}
                    {renderFormField("Inclusive Dates", "elementary_inclusive_dates", "text", "", false, employee?.elementary_inclusive_dates)}
                    {renderFormField("Honors", "elementary_honors", "text", "", false, employee?.elementary_honors)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Secondary</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "secondary_school_name", "text", "", false, employee?.secondary_school_name)}
                    {renderFormField("Degree/Course", "secondary_degree_course", "text", "", false, employee?.secondary_degree_course)}
                    {renderFormField("Year Graduated", "secondary_year_graduated", "text", "", false, employee?.secondary_year_graduated)}
                    {renderFormField("Highest Level", "secondary_highest_level", "text", "", false, employee?.secondary_highest_level)}
                    {renderFormField("Inclusive Dates", "secondary_inclusive_dates", "text", "", false, employee?.secondary_inclusive_dates)}
                    {renderFormField("Honors", "secondary_honors", "text", "", false, employee?.secondary_honors)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Vocational</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "vocational_school_name", "text", "", false, employee?.vocational_school_name)}
                    {renderFormField("Degree/Course", "vocational_degree_course", "text", "", false, employee?.vocational_degree_course)}
                    {renderFormField("Year Graduated", "vocational_year_graduated", "text", "", false, employee?.vocational_year_graduated)}
                    {renderFormField("Highest Level", "vocational_highest_level", "text", "", false, employee?.vocational_highest_level)}
                    {renderFormField("Inclusive Dates", "vocational_inclusive_dates", "text", "", false, employee?.vocational_inclusive_dates)}
                    {renderFormField("Honors", "vocational_honors", "text", "", false, employee?.vocational_honors)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">College</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "college_school_name", "text", "", false, employee?.college_school_name)}
                    {renderFormField("Degree/Course", "college_degree_course", "text", "", false, employee?.college_degree_course)}
                    {renderFormField("Year Graduated", "college_year_graduated", "text", "", false, employee?.college_year_graduated)}
                    {renderFormField("Highest Level", "college_highest_level", "text", "", false, employee?.college_highest_level)}
                    {renderFormField("Inclusive Dates", "college_inclusive_dates", "text", "", false, employee?.college_inclusive_dates)}
                    {renderFormField("Honors", "college_honors", "text", "", false, employee?.college_honors)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Graduate</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "graduate_school_name", "text", "", false, employee?.graduate_school_name)}
                    {renderFormField("Degree/Course", "graduate_degree_course", "text", "", false, employee?.graduate_degree_course)}
                    {renderFormField("Year Graduated", "graduate_year_graduated", "text", "", false, employee?.graduate_year_graduated)}
                    {renderFormField("Highest Level", "graduate_highest_level", "text", "", false, employee?.graduate_highest_level)}
                    {renderFormField("Inclusive Dates", "graduate_inclusive_dates", "text", "", false, employee?.graduate_inclusive_dates)}
                    {renderFormField("Honors", "graduate_honors", "text", "", false, employee?.graduate_honors)}
                </div>
            </div>
        </div>
    );

    const employmentInfoFields = (employee?: Employee | null) => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("Department", "department_id", "select", "", true, employee?.department_id,
                departments.map(dept => ({ value: dept.id.toString(), label: dept.department_name }))
            )}
            {renderFormField("Position", "position_id", "select", "", true, employee?.position_id,
                positions.map(pos => ({ value: pos.id.toString(), label: pos.position_name }))
            )}

            {renderFormField("Manager", "manager_id", "select", "", false, employee?.manager_id,
                managers.map(manager => ({
                    value: manager.id.toString(),
                    label: `${manager.first_name} ${manager.last_name}`
                }))
            )}
            {renderFormField("Supervisor", "supervisor_id", "select", "", false, employee?.supervisor_id,
                managers.map(supervisor => ({
                    value: supervisor.id.toString(),
                    label: `${supervisor.first_name} ${supervisor.last_name}`
                }))
            )}
            {renderFormField("Base Salary", "base_salary", "number", "50000", true, employee?.base_salary)}
            {renderFormField("Hire Date", "hire_date", "date", "", true, employee?.hire_date)}
            {renderFormField("Role", "role", "select", "", false, employee?.role || "employee", [
                { value: "employee", label: "Employee" },
                { value: "manager", label: "Manager" },
                { value: "admin", label: "Admin" }
            ])}
            {renderFormField("Active Status", "is_active", "switch", "", false, employee?.is_active ?? true)}
        </div>
    );

    const governmentIdsFields = (employee?: Employee | null) => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("GSIS No.", "gsis_no", "text", "123456789", false, employee?.gsis_no)}
            {renderFormField("PAG-IBIG No.", "pagibig_no", "text", "123456789012", false, employee?.pagibig_no)}
            {renderFormField("PhilHealth No.", "philhealth_no", "text", "123456789012", false, employee?.philhealth_no)}
            {renderFormField("SSS No.", "sss_no", "text", "123456789", false, employee?.sss_no)}
            {renderFormField("TIN No.", "tin_no", "text", "123-456-789-000", false, employee?.tin_no)}
            {renderFormField("Agency Employee No.", "agency_employee_no", "text", "EMP-001", false, employee?.agency_employee_no)}
        </div>
    );

    const addressInfoFields = (employee?: Employee | null) => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h4 className="font-semibold">Residential Address</h4>
                    {renderFormField("Address", "residential_address", "textarea", "Street, Barangay, City", false, employee?.residential_address)}
                    {renderFormField("Zip Code", "residential_zipcode", "text", "1000", false, employee?.residential_zipcode)}
                    {renderFormField("Telephone No.", "residential_tel_no", "tel", "+632-123-4567", false, employee?.residential_tel_no)}
                </div>
                <div className="space-y-4">
                    <h4 className="font-semibold">Permanent Address</h4>
                    {renderFormField("Address", "permanent_address", "textarea", "Street, Barangay, City", false, employee?.permanent_address)}
                    {renderFormField("Zip Code", "permanent_zipcode", "text", "1000", false, employee?.permanent_zipcode)}
                    {renderFormField("Telephone No.", "permanent_tel_no", "tel", "+632-123-4567", false, employee?.permanent_tel_no)}
                </div>
            </div>
        </div>
    );

    const emergencyContactFields = (employee?: Employee | null) => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("Emergency Contact Name", "emergency_contact_name", "text", "Juan Dela Cruz", false, employee?.emergency_contact_name)}
            {renderFormField("Emergency Contact Number", "emergency_contact_number", "tel", "+63-912-345-6789", false, employee?.emergency_contact_number)}
            {renderFormField("Emergency Contact Relation", "emergency_contact_relation", "text", "Father, Mother, Spouse", false, employee?.emergency_contact_relation)}
        </div>
    );

    const fileUploadFields = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Resume</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                        className="flex-1"
                    />
                    {resumeFile && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                            {resumeFile.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeFile('resume')} />
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX (max 2MB)
                </p>
            </div>

            <div className="space-y-2">
                <Label>201 Files (Multiple)</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpeg,.png,.xlsx"
                        onChange={(e) => handleFileUpload(e, '201_file')}
                        className="flex-1"
                        multiple
                    />
                </div>
                <div className="space-y-2 mt-2">
                    {files201.map((file, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1 mr-2 mb-2">
                            {file.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeFile('201_file', index)} />
                        </Badge>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPEG, PNG, XLSX (max 2MB per file)
                </p>
            </div>
        </div>
    );

    const renderNavigationButtons = (isLastTab: boolean = false) => (
        <div className="flex justify-between mt-6">
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    const tabOrder = ["personal", "education", "employment", "government", "address", "files"];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    if (currentIndex > 0) {
                        setActiveTab(tabOrder[currentIndex - 1]);
                    }
                }}
                disabled={activeTab === "personal"}
            >
                Previous
            </Button>
            {!isLastTab ? (
                <Button type="button" onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <Button type="submit" disabled={loading}>
                    {loading ? 'Adding Employee...' : 'Add Employee'}
                </Button>
            )}
        </div>
    );

    return (
        <div>
            {/* ADD DIALOG */}
            <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>
                            Enter the employee's complete information below.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="education">Education</TabsTrigger>
                            <TabsTrigger value="employment">Employment</TabsTrigger>
                            <TabsTrigger value="government">Government IDs</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                            <TabsTrigger value="files">Add Employee</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleAddEmployee}>
                            <TabsContent value="personal" className="space-y-4">
                                {personalInfoFields()}
                                {renderNavigationButtons()}
                            </TabsContent>

                            <TabsContent value="education" className="space-y-4">
                                {educationInfoFields()}
                                {renderNavigationButtons()}
                            </TabsContent>

                            <TabsContent value="employment" className="space-y-4">
                                {employmentInfoFields()}
                                {emergencyContactFields()}
                                {renderNavigationButtons()}
                            </TabsContent>

                            <TabsContent value="government" className="space-y-4">
                                {governmentIdsFields()}
                                {renderNavigationButtons()}
                            </TabsContent>

                            <TabsContent value="address" className="space-y-4">
                                {addressInfoFields()}
                                {renderNavigationButtons()}
                            </TabsContent>

                            <TabsContent value="files" className="space-y-4">
                                {fileUploadFields()}
                                {renderNavigationButtons(true)}
                            </TabsContent>
                        </form>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* EDIT DIALOG */}
            <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
                <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Employee {editingEmployee && `- ${editingEmployee.first_name} ${editingEmployee.last_name}`}
                        </DialogTitle>
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
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="employment">Employment</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="files">Files</TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleEditEmployee}>
                                <TabsContent value="personal" className="space-y-4">
                                    {personalInfoFields(editingEmployee)}
                                    {governmentIdsFields(editingEmployee)}
                                </TabsContent>

                                <TabsContent value="employment" className="space-y-4">
                                    {employmentInfoFields(editingEmployee)}
                                    {emergencyContactFields(editingEmployee)}
                                </TabsContent>

                                <TabsContent value="education" className="space-y-4">
                                    {educationInfoFields(editingEmployee)}
                                </TabsContent>

                                <TabsContent value="files" className="space-y-4">
                                    {fileUploadFields()}
                                    <div className="text-sm text-muted-foreground">
                                        <p>Current Resume: {editingEmployee.resume ? 'Uploaded' : 'Not provided'}</p>
                                        <p>Current 201 Files: {editingEmployee.files && editingEmployee.files.length > 0 ? `${editingEmployee.files.length} files` : 'No files'}</p>
                                    </div>
                                </TabsContent>

                                <DialogFooter className="mt-6 flex gap-2">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Employee'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => handleArchiveEmployee(editingEmployee.id)}
                                        disabled={loading}
                                    >
                                        {editingEmployee.is_archived ? 'Unarchive' : 'Archive'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmployeeDialog