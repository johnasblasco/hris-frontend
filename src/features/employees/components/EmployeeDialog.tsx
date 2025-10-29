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
import type { EmployeeFormData } from "../employeeTS";
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
    const [files201, setFiles201] = useState<File[]>([]);

    // Form state to preserve data when switching tabs
    const [formData, setFormData] = useState<EmployeeFormData>({
        // Personal Information
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        email: '',
        phone: '',
        date_of_birth: '',
        place_of_birth: '',
        sex: '',
        civil_status: '',
        height_m: '',
        weight_kg: '',
        blood_type: '',
        citizenship: '',
        password: 'TempPassword123!',

        // Government IDs
        gsis_no: '',
        pagibig_no: '',
        philhealth_no: '',
        sss_no: '',
        tin_no: '',
        agency_employee_no: '',

        // Address Information
        residential_address: '',
        residential_zipcode: '',
        residential_tel_no: '',
        permanent_address: '',
        permanent_zipcode: '',
        permanent_tel_no: '',

        // Family Information
        spouse_name: '',
        spouse_occupation: '',
        spouse_employer: '',
        spouse_business_address: '',
        spouse_tel_no: '',
        father_name: '',
        mother_name: '',
        parents_address: '',

        // Emergency Contact
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_relation: '',

        // Employment Information
        department_id: '',
        position_id: '',
        employment_type_id: '',
        manager_id: '',
        supervisor_id: '',
        base_salary: '',
        hire_date: '',
        role: 'employee',
        is_active: true,

        // Educational Background
        elementary_school_name: '',
        elementary_degree_course: '',
        elementary_year_graduated: '',
        elementary_highest_level: '',
        elementary_inclusive_dates: '',
        elementary_honors: '',

        secondary_school_name: '',
        secondary_degree_course: '',
        secondary_year_graduated: '',
        secondary_highest_level: '',
        secondary_inclusive_dates: '',
        secondary_honors: '',

        vocational_school_name: '',
        vocational_degree_course: '',
        vocational_year_graduated: '',
        vocational_highest_level: '',
        vocational_inclusive_dates: '',
        vocational_honors: '',

        college_school_name: '',
        college_degree_course: '',
        college_year_graduated: '',
        college_highest_level: '',
        college_inclusive_dates: '',
        college_honors: '',

        graduate_school_name: '',
        graduate_degree_course: '',
        graduate_year_graduated: '',
        graduate_highest_level: '',
        graduate_inclusive_dates: '',
        graduate_honors: '',
    });

    // Open edit dialog when editingEmployee changes
    useEffect(() => {
        if (editingEmployee) {
            setIsEditDialogOpen(true);
            setActiveTab("personal");
            // Pre-fill form data when editing
            setFormData({
                first_name: editingEmployee.first_name || '',
                middle_name: editingEmployee.middle_name || '',
                last_name: editingEmployee.last_name || '',
                suffix: editingEmployee.suffix || '',
                email: editingEmployee.email || '',
                phone: editingEmployee.phone || '',
                date_of_birth: editingEmployee.date_of_birth || '',
                place_of_birth: editingEmployee.place_of_birth || '',
                sex: editingEmployee.sex || '',
                civil_status: editingEmployee.civil_status || '',
                height_m: editingEmployee.height_m || '',
                weight_kg: editingEmployee.weight_kg || '',
                blood_type: editingEmployee.blood_type || '',
                citizenship: editingEmployee.citizenship || '',
                password: '', // Don't pre-fill password for security

                // Government IDs
                gsis_no: editingEmployee.gsis_no || '',
                pagibig_no: editingEmployee.pagibig_no || '',
                philhealth_no: editingEmployee.philhealth_no || '',
                sss_no: editingEmployee.sss_no || '',
                tin_no: editingEmployee.tin_no || '',
                agency_employee_no: editingEmployee.agency_employee_no || '',

                // Address Information
                residential_address: editingEmployee.residential_address || '',
                residential_zipcode: editingEmployee.residential_zipcode || '',
                residential_tel_no: editingEmployee.residential_tel_no || '',
                permanent_address: editingEmployee.permanent_address || '',
                permanent_zipcode: editingEmployee.permanent_zipcode || '',
                permanent_tel_no: editingEmployee.permanent_tel_no || '',

                // Family Information
                spouse_name: editingEmployee.spouse_name || '',
                spouse_occupation: editingEmployee.spouse_occupation || '',
                spouse_employer: editingEmployee.spouse_employer || '',
                spouse_business_address: editingEmployee.spouse_business_address || '',
                spouse_tel_no: editingEmployee.spouse_tel_no || '',
                father_name: editingEmployee.father_name || '',
                mother_name: editingEmployee.mother_name || '',
                parents_address: editingEmployee.parents_address || '',

                // Emergency Contact
                emergency_contact_name: editingEmployee.emergency_contact_name || '',
                emergency_contact_number: editingEmployee.emergency_contact_number || '',
                emergency_contact_relation: editingEmployee.emergency_contact_relation || '',

                // Employment Information
                department_id: editingEmployee.department_id?.toString() || '',
                position_id: editingEmployee.position_id?.toString() || '',
                employment_type_id: editingEmployee.employment_type_id?.toString() || '',
                manager_id: editingEmployee.manager_id?.toString() || '',
                supervisor_id: editingEmployee.supervisor_id?.toString() || '',
                base_salary: editingEmployee.base_salary?.toString() || '',
                hire_date: editingEmployee.hire_date || '',
                role: editingEmployee.role || 'employee',
                is_active: editingEmployee.is_active ?? true,

                // Educational Background
                elementary_school_name: editingEmployee.elementary_school_name || '',
                elementary_degree_course: editingEmployee.elementary_degree_course || '',
                elementary_year_graduated: editingEmployee.elementary_year_graduated || '',
                elementary_highest_level: editingEmployee.elementary_highest_level || '',
                elementary_inclusive_dates: editingEmployee.elementary_inclusive_dates || '',
                elementary_honors: editingEmployee.elementary_honors || '',

                secondary_school_name: editingEmployee.secondary_school_name || '',
                secondary_degree_course: editingEmployee.secondary_degree_course || '',
                secondary_year_graduated: editingEmployee.secondary_year_graduated || '',
                secondary_highest_level: editingEmployee.secondary_highest_level || '',
                secondary_inclusive_dates: editingEmployee.secondary_inclusive_dates || '',
                secondary_honors: editingEmployee.secondary_honors || '',

                vocational_school_name: editingEmployee.vocational_school_name || '',
                vocational_degree_course: editingEmployee.vocational_degree_course || '',
                vocational_year_graduated: editingEmployee.vocational_year_graduated || '',
                vocational_highest_level: editingEmployee.vocational_highest_level || '',
                vocational_inclusive_dates: editingEmployee.vocational_inclusive_dates || '',
                vocational_honors: editingEmployee.vocational_honors || '',

                college_school_name: editingEmployee.college_school_name || '',
                college_degree_course: editingEmployee.college_degree_course || '',
                college_year_graduated: editingEmployee.college_year_graduated || '',
                college_highest_level: editingEmployee.college_highest_level || '',
                college_inclusive_dates: editingEmployee.college_inclusive_dates || '',
                college_honors: editingEmployee.college_honors || '',

                graduate_school_name: editingEmployee.graduate_school_name || '',
                graduate_degree_course: editingEmployee.graduate_degree_course || '',
                graduate_year_graduated: editingEmployee.graduate_year_graduated || '',
                graduate_highest_level: editingEmployee.graduate_highest_level || '',
                graduate_inclusive_dates: editingEmployee.graduate_inclusive_dates || '',
                graduate_honors: editingEmployee.graduate_honors || '',
            });
        }
    }, [editingEmployee]);

    const resetForm = () => {
        setFormData({
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            email: '',
            phone: '',
            date_of_birth: '',
            place_of_birth: '',
            sex: '',
            civil_status: '',
            height_m: '',
            weight_kg: '',
            blood_type: '',
            citizenship: '',
            password: 'TempPassword123!',
            gsis_no: '',
            pagibig_no: '',
            philhealth_no: '',
            sss_no: '',
            tin_no: '',
            agency_employee_no: '',
            residential_address: '',
            residential_zipcode: '',
            residential_tel_no: '',
            permanent_address: '',
            permanent_zipcode: '',
            permanent_tel_no: '',
            spouse_name: '',
            spouse_occupation: '',
            spouse_employer: '',
            spouse_business_address: '',
            spouse_tel_no: '',
            father_name: '',
            mother_name: '',
            parents_address: '',
            emergency_contact_name: '',
            emergency_contact_number: '',
            emergency_contact_relation: '',
            department_id: '',
            position_id: '',
            employment_type_id: '',
            manager_id: '',
            supervisor_id: '',
            base_salary: '',
            hire_date: '',
            role: 'employee',
            is_active: true,
            elementary_school_name: '',
            elementary_degree_course: '',
            elementary_year_graduated: '',
            elementary_highest_level: '',
            elementary_inclusive_dates: '',
            elementary_honors: '',
            secondary_school_name: '',
            secondary_degree_course: '',
            secondary_year_graduated: '',
            secondary_highest_level: '',
            secondary_inclusive_dates: '',
            secondary_honors: '',
            vocational_school_name: '',
            vocational_degree_course: '',
            vocational_year_graduated: '',
            vocational_highest_level: '',
            vocational_inclusive_dates: '',
            vocational_honors: '',
            college_school_name: '',
            college_degree_course: '',
            college_year_graduated: '',
            college_highest_level: '',
            college_inclusive_dates: '',
            college_honors: '',
            graduate_school_name: '',
            graduate_degree_course: '',
            graduate_year_graduated: '',
            graduate_highest_level: '',
            graduate_inclusive_dates: '',
            graduate_honors: '',
        });
        setResumeFile(null);
        setFiles201([]);
        setError(null);
        setActiveTab("personal");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAddEmployee = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = new FormData();

            // Append all form data
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitData.append(key, value.toString());
                }
            });

            // Files
            if (resumeFile) {
                submitData.append('resume', resumeFile);
            }

            // Append multiple 201 files
            files201.forEach(file => {
                submitData.append('201_file[]', file);
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

        try {
            const submitData = new FormData();

            // Append all form data except password if empty
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    // Don't send password if it's empty (for edit)
                    if (key === 'password' && value === '') {
                        return;
                    }
                    submitData.append(key, value.toString());
                }
            });

            // Files - append multiple 201 files
            files201.forEach(file => {
                submitData.append('201_file[]', file);
            });

            if (resumeFile) {
                submitData.append('resume', resumeFile);
            }

            const response = await api.post(`/update/employees/${editingEmployee.id}`, submitData, {
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
        name: keyof EmployeeFormData,
        type: string = "text",
        placeholder: string = "",
        required: boolean = false,
        options?: { value: string; label: string }[]
    ) => {
        const value = formData[name] as string;

        if (type === "select" && options) {
            return (
                <div className="space-y-2">
                    <Label htmlFor={name}>{label}{required && " *"}</Label>
                    <Select
                        value={value}
                        onValueChange={(value) => handleSelectChange(name, value)}
                    >
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
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={handleInputChange}
                    />
                </div>
            );
        }

        if (type === "switch") {
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={formData[name] as boolean}
                        onCheckedChange={(checked) => handleSwitchChange(name, checked)}
                    />
                    <Label htmlFor={name}>{label}</Label>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{label}{required && " *"}</Label>
                <Input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    onChange={handleInputChange}
                />
            </div>
        );
    };

    const personalInfoFields = () => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("First Name", "first_name", "text", "John", true)}
            {renderFormField("Middle Name", "middle_name", "text", "Middle", false)}
            {renderFormField("Last Name", "last_name", "text", "Doe", true)}
            {renderFormField("Suffix", "suffix", "text", "Jr., Sr., III", false)}
            {renderFormField("Email", "email", "email", "john.doe@company.com", true)}
            {renderFormField("Phone", "phone", "tel", "+1-555-0101", false)}
            {renderFormField("Password", "password", "password", " ", !editingEmployee)}
            {renderFormField("Date of Birth", "date_of_birth", "date", "", false)}
            {renderFormField("Place of Birth", "place_of_birth", "text", "City, Country", false)}
            {renderFormField("Sex", "sex", "select", "", false, [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" }
            ])}
            {renderFormField("Civil Status", "civil_status", "select", "", false, [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" }
            ])}
            {renderFormField("Height (m)", "height_m", "number", "1.75", false)}
            {renderFormField("Weight (kg)", "weight_kg", "number", "70", false)}
            {renderFormField("Blood Type", "blood_type", "text", "O+", false)}
            {renderFormField("Citizenship", "citizenship", "text", "Filipino", false)}
        </div>
    );

    const educationInfoFields = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <h4 className="font-semibold">Elementary</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "elementary_school_name", "text", "", false)}
                    {renderFormField("Degree/Course", "elementary_degree_course", "text", "", false)}
                    {renderFormField("Year Graduated", "elementary_year_graduated", "text", "", false)}
                    {renderFormField("Highest Level", "elementary_highest_level", "text", "", false)}
                    {renderFormField("Inclusive Dates", "elementary_inclusive_dates", "text", "", false)}
                    {renderFormField("Honors", "elementary_honors", "text", "", false)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Secondary</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "secondary_school_name", "text", "", false)}
                    {renderFormField("Degree/Course", "secondary_degree_course", "text", "", false)}
                    {renderFormField("Year Graduated", "secondary_year_graduated", "text", "", false)}
                    {renderFormField("Highest Level", "secondary_highest_level", "text", "", false)}
                    {renderFormField("Inclusive Dates", "secondary_inclusive_dates", "text", "", false)}
                    {renderFormField("Honors", "secondary_honors", "text", "", false)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Vocational</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "vocational_school_name", "text", "", false)}
                    {renderFormField("Degree/Course", "vocational_degree_course", "text", "", false)}
                    {renderFormField("Year Graduated", "vocational_year_graduated", "text", "", false)}
                    {renderFormField("Highest Level", "vocational_highest_level", "text", "", false)}
                    {renderFormField("Inclusive Dates", "vocational_inclusive_dates", "text", "", false)}
                    {renderFormField("Honors", "vocational_honors", "text", "", false)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">College</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "college_school_name", "text", "", false)}
                    {renderFormField("Degree/Course", "college_degree_course", "text", "", false)}
                    {renderFormField("Year Graduated", "college_year_graduated", "text", "", false)}
                    {renderFormField("Highest Level", "college_highest_level", "text", "", false)}
                    {renderFormField("Inclusive Dates", "college_inclusive_dates", "text", "", false)}
                    {renderFormField("Honors", "college_honors", "text", "", false)}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold">Graduate</h4>
                <div className="grid grid-cols-2 gap-4">
                    {renderFormField("School Name", "graduate_school_name", "text", "", false)}
                    {renderFormField("Degree/Course", "graduate_degree_course", "text", "", false)}
                    {renderFormField("Year Graduated", "graduate_year_graduated", "text", "", false)}
                    {renderFormField("Highest Level", "graduate_highest_level", "text", "", false)}
                    {renderFormField("Inclusive Dates", "graduate_inclusive_dates", "text", "", false)}
                    {renderFormField("Honors", "graduate_honors", "text", "", false)}
                </div>
            </div>
        </div>
    );

    const employmentInfoFields = () => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("Department", "department_id", "select", "", true,
                departments.map(dept => ({ value: dept.id.toString(), label: dept.department_name }))
            )}
            {renderFormField("Position", "position_id", "select", "", true,
                positions.map(pos => ({ value: pos.id.toString(), label: pos.position_name }))
            )}
            {renderFormField("Manager", "manager_id", "select", "", false,
                managers.map(manager => ({
                    value: manager.id.toString(),
                    label: `${manager.first_name} ${manager.last_name}`
                }))
            )}
            {renderFormField("Supervisor", "supervisor_id", "select", "", false,
                managers.map(supervisor => ({
                    value: supervisor.id.toString(),
                    label: `${supervisor.first_name} ${supervisor.last_name}`
                }))
            )}
            {renderFormField("Base Salary", "base_salary", "number", "50000", true)}
            {renderFormField("Hire Date", "hire_date", "date", "", true)}
            {renderFormField("Role", "role", "select", "", false, [
                { value: "employee", label: "Employee" },
                { value: "manager", label: "Manager" },
                { value: "admin", label: "Admin" }
            ])}
            {renderFormField("Active Status", "is_active", "switch", "", false)}
        </div>
    );

    const governmentIdsFields = () => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("GSIS No.", "gsis_no", "text", "123456789", false)}
            {renderFormField("PAG-IBIG No.", "pagibig_no", "text", "123456789012", false)}
            {renderFormField("PhilHealth No.", "philhealth_no", "text", "123456789012", false)}
            {renderFormField("SSS No.", "sss_no", "text", "123456789", false)}
            {renderFormField("TIN No.", "tin_no", "text", "123-456-789-000", false)}
            {renderFormField("Agency Employee No.", "agency_employee_no", "text", "EMP-001", false)}
        </div>
    );

    const addressInfoFields = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h4 className="font-semibold">Residential Address</h4>
                    {renderFormField("Address", "residential_address", "textarea", "Street, Barangay, City", false)}
                    {renderFormField("Zip Code", "residential_zipcode", "text", "1000", false)}
                    {renderFormField("Telephone No.", "residential_tel_no", "tel", "+632-123-4567", false)}
                </div>
                <div className="space-y-4">
                    <h4 className="font-semibold">Permanent Address</h4>
                    {renderFormField("Address", "permanent_address", "textarea", "Street, Barangay, City", false)}
                    {renderFormField("Zip Code", "permanent_zipcode", "text", "1000", false)}
                    {renderFormField("Telephone No.", "permanent_tel_no", "tel", "+632-123-4567", false)}
                </div>
            </div>
        </div>
    );

    const emergencyContactFields = () => (
        <div className="grid grid-cols-2 gap-4">
            {renderFormField("Emergency Contact Name", "emergency_contact_name", "text", "Juan Dela Cruz", false)}
            {renderFormField("Emergency Contact Number", "emergency_contact_number", "tel", "+63-912-345-6789", false)}
            {renderFormField("Emergency Contact Relation", "emergency_contact_relation", "text", "Father, Mother, Spouse", false)}
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
                                    {personalInfoFields()}
                                    {governmentIdsFields()}
                                </TabsContent>

                                <TabsContent value="employment" className="space-y-4">
                                    {employmentInfoFields()}
                                    {emergencyContactFields()}
                                </TabsContent>

                                <TabsContent value="education" className="space-y-4">
                                    {educationInfoFields()}
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