import { Building2, Users, Briefcase, Calendar, Gift, MapPin, Award, GraduationCap } from 'lucide-react';

export const setupSteps = [
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Users },
    { id: 'positions', label: 'Job Positions', icon: Briefcase },
    { id: 'leave', label: 'Leave Types', icon: Calendar },
    { id: 'benefits', label: 'Benefits', icon: Gift },
    { id: 'employment', label: 'Employment Types', icon: Users },
    { id: 'locations', label: 'Work Locations', icon: MapPin },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'performance', label: 'Performance Ratings', icon: Award },
];

export const defaultSetupData = {
    companyName: 'Acme Corporation',
    industry: 'Technology',
    companySize: '100-500',
    timezone: 'America/New_York',
    currency: 'USD',
    departments: [
        { id: '1', name: 'Engineering', description: 'Software development and technical operations' },
        { id: '2', name: 'Marketing', description: 'Brand management and customer engagement' },
        { id: '3', name: 'Sales', description: 'Revenue generation and client relations' },
        { id: '4', name: 'Human Resources', description: 'Employee management and organizational development' },
        { id: '5', name: 'Finance', description: 'Financial planning and accounting' },
    ],
    positions: [
        { id: '1', title: 'Software Engineer', department: 'Engineering', level: 'Mid-Level' },
        { id: '2', title: 'Senior Software Engineer', department: 'Engineering', level: 'Senior' },
        { id: '3', title: 'Marketing Manager', department: 'Marketing', level: 'Manager' },
        { id: '4', title: 'Sales Representative', department: 'Sales', level: 'Entry' },
        { id: '5', title: 'HR Manager', department: 'Human Resources', level: 'Manager' },
    ],
    leaveTypes: [
        { id: '1', name: 'Annual Leave', defaultDays: 15, requiresApproval: true },
        { id: '2', name: 'Sick Leave', defaultDays: 10, requiresApproval: false },
        { id: '3', name: 'Personal Leave', defaultDays: 5, requiresApproval: true },
        { id: '4', name: 'Maternity Leave', defaultDays: 90, requiresApproval: true },
        { id: '5', name: 'Paternity Leave', defaultDays: 14, requiresApproval: true },
    ],
    benefitTypes: [
        { id: '1', name: 'Health Insurance', category: 'Health', description: 'Comprehensive health coverage' },
        { id: '2', name: 'Dental Insurance', category: 'Health', description: 'Dental care coverage' },
        { id: '3', name: '401(k) Match', category: 'Retirement', description: 'Company 401k matching' },
        { id: '4', name: 'Life Insurance', category: 'Insurance', description: 'Life insurance coverage' },
        { id: '5', name: 'Gym Membership', category: 'Wellness', description: 'Fitness center access' },
    ],
    employmentTypes: [
        { id: '1', name: 'Full-Time', description: 'Regular full-time employment' },
        { id: '2', name: 'Part-Time', description: 'Part-time employment' },
        { id: '3', name: 'Contract', description: 'Fixed-term contract' },
        { id: '4', name: 'Intern', description: 'Internship position' },
        { id: '5', name: 'Consultant', description: 'External consultant' },
    ],
    workLocations: [
        { id: '1', name: 'Headquarters', address: '123 Main St, New York, NY', isRemote: false },
        { id: '2', name: 'West Coast Office', address: '456 Tech Ave, San Francisco, CA', isRemote: false },
        { id: '3', name: 'Remote', address: 'Various Locations', isRemote: true },
    ],
    skills: [
        { id: '1', name: 'JavaScript', category: 'Technical' },
        { id: '2', name: 'React', category: 'Technical' },
        { id: '3', name: 'Project Management', category: 'Management' },
        { id: '4', name: 'Communication', category: 'Soft Skills' },
        { id: '5', name: 'Leadership', category: 'Soft Skills' },
    ],
    performanceRatings: [
        { id: '1', label: 'Exceptional', value: 5, description: 'Exceeds all expectations' },
        { id: '2', label: 'Exceeds Expectations', value: 4, description: 'Consistently exceeds goals' },
        { id: '3', label: 'Meets Expectations', value: 3, description: 'Meets all job requirements' },
        { id: '4', label: 'Needs Improvement', value: 2, description: 'Performance below expectations' },
        { id: '5', label: 'Unsatisfactory', value: 1, description: 'Significant performance issues' },
    ],
};