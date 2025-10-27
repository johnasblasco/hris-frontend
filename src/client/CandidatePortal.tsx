import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, Building2, Users, Search, Filter, ArrowRight, CheckCircle, Upload, Star, Globe, Heart, Award } from 'lucide-react';
const api = 'https://api-hris.slarenasitsolutions.com/public/api'
// Types for our API data
interface Department {
    id: string;
    department_name: string;
}

interface WorkLocation {
    id: string;
    location_name: string;
}

interface JobPosting {
    id: string;
    title: string;
    department_id: string;
    department?: Department;
    location: string;
    salary_range: string;
    status: string;
    is_archived: boolean;
    created_at: string;
    description?: string;
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    type?: string;
    remote?: string;
    featured?: boolean;
}

interface PaginationInfo {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

interface JobPostingsResponse {
    isSuccess: boolean;
    message: string;
    job_postings: JobPosting[];
    pagination: PaginationInfo;
}

// Mock company info (you might want to fetch this from API too)
const companyInfo = {
    name: 'SNL IT Solutions',
    description: 'We\'re revolutionizing human resources technology with innovative solutions that help companies manage their most valuable asset - their people.',
    mission: 'SnL Virtual Partner’s mission is to provide businesses with high-quality virtual outsourcing services that let them concentrate on their core competencies and meet their strategic goals. Delivering cutting-edge solutions that improve clients’ operations, cut costs, and sharpen their competitive edge in the virtual market, is part of our mission to offer them exceptional value. We at SnL Virtual Partners are dedicated to building enduring relationships with our clients and providing exceptional value that fuels their success and growth.',
    values: ['Innovation', 'Collaboration', 'Integrity', 'Growth', 'Customer Focus'],
    stats: {
        employees: '10+',
        offices: '2',
        founded: '2014',
        customers: '1000+'
    }
};

export function CandidatePortal() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);

    // API states
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [workLocations, setWorkLocations] = useState<WorkLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);

    // Fetch job postings from API
    const fetchJobPostings = async (search = '', departmentId = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (departmentId && departmentId !== 'all') params.append('department_id', departmentId);
            params.append('per_page', '12');

            const response = await fetch(`${api}/job-postings?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch job postings');
            }

            const data: JobPostingsResponse = await response.json();

            if (data.isSuccess) {
                setJobs(data.job_postings);
                setPagination(data.pagination);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching job postings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch departments from dropdown API
    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${api}/dropdown/departments`);
            if (response.ok) {
                const data = await response.json();
                if (data.isSuccess) {
                    setDepartments(data.data || []);
                }
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    // Fetch work locations from dropdown API
    const fetchWorkLocations = async () => {
        try {
            const response = await fetch(`${api}/dropdown/work-locations`);
            if (response.ok) {
                const data = await response.json();
                if (data.isSuccess) {
                    setWorkLocations(data.data || []);
                }
            }
        } catch (err) {
            console.error('Error fetching work locations:', err);
        }
    };

    useEffect(() => {
        fetchJobPostings();
        fetchDepartments();
        fetchWorkLocations();
    }, []);

    // Enhanced job filtering on the client side for location and other filters
    const filteredJobs = jobs.filter(job => {
        const matchesLocation = !locationFilter || locationFilter === 'all' ||
            job.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesDepartment = !departmentFilter || departmentFilter === 'all' ||
            job.department_id === departmentFilter;
        return matchesLocation && matchesDepartment;
    });

    // Handle search with API
    const handleSearch = () => {
        fetchJobPostings(searchTerm, departmentFilter);
    };

    // Handle filter changes
    const handleDepartmentFilterChange = (value: string) => {
        setDepartmentFilter(value);
        fetchJobPostings(searchTerm, value);
    };

    // Handle location filter (client-side only since API doesn't support it)
    const handleLocationFilterChange = (value: string) => {
        setLocationFilter(value);
    };

    const handleApplyNow = (job: JobPosting) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
    };

    const handleSubmitApplication = () => {
        setApplicationSubmitted(true);
        setShowApplicationForm(false);
        // Simulate application submission
        setTimeout(() => {
            setApplicationSubmitted(false);
        }, 3000);
    };

    // Format date to relative time (e.g., "3 days ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    // Get unique locations from jobs for fallback filter options
    const getUniqueJobLocations = () => {
        const locations = jobs.map(job => job.location).filter(Boolean);
        return [...new Set(locations)];
    };

    // Enhanced job card renderer with API data
    const renderJobCard = (job: JobPosting) => {
        const department = departments.find(dept => dept.id === job.department_id);
        const departmentName = department?.department_name || 'Unknown Department';
        const postedTime = formatRelativeTime(job.created_at);

        return (
            <Card key={job.id} className={`relative ${job.featured ? 'ring-2 ring-primary' : ''}`}>
                {job.featured && (
                    <div className="absolute -top-2 left-4">
                        <Badge className="bg-primary">Featured</Badge>
                    </div>
                )}
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {departmentName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {job.type || 'Full-time'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    {job.remote || 'Hybrid'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-primary font-semibold">
                                <DollarSign className="w-4 h-4" />
                                {job.salary_range}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{postedTime}</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description || 'Join our team and contribute to exciting projects in a dynamic environment.'}
                    </p>
                    <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setSelectedJob(job)}>
                            View Details
                        </Button>
                        <Button onClick={() => handleApplyNow(job)}>
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4">Join Our Amazing Team</h1>
                        <p className="text-xl mb-8 opacity-90">
                            Discover exciting career opportunities at {companyInfo.name} and help us shape the future of HR technology.
                        </p>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>{companyInfo.stats.employees} Employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                <span>{companyInfo.stats.offices} Offices</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                <span>Founded {companyInfo.stats.founded}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                <span>{companyInfo.stats.customers} Happy Customers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-card rounded-lg border p-6 -mt-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Jobs</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Job title or keyword"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.department_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Select value={locationFilter} onValueChange={handleLocationFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All locations</SelectItem>
                                    {workLocations.map((location) => (
                                        <SelectItem key={location.id} value={location.location_name}>
                                            {location.location_name}
                                        </SelectItem>
                                    ))}
                                    {/* Fallback for locations that might be in jobs but not in workLocations API */}
                                    {getUniqueJobLocations().map((location, index) => (
                                        !workLocations.some(wl => wl.location_name === location) && (
                                            <SelectItem key={`fallback-${index}`} value={location}>
                                                {location}
                                            </SelectItem>
                                        )
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={handleSearch}
                                className="w-full"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearchTerm('');
                                    setLocationFilter('all');
                                    setDepartmentFilter('all');
                                    fetchJobPostings(); // Reset to initial state
                                }}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="container mx-auto px-4 pb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {loading ? 'Loading...' : `${filteredJobs.length} Open Position${filteredJobs.length !== 1 ? 's' : ''}`}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        {pagination && `Page ${pagination.current_page} of ${pagination.last_page}`}
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
                        <p>Error: {error}</p>
                        <Button variant="outline" size="sm" onClick={() => fetchJobPostings()} className="mt-2">
                            Try Again
                        </Button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading job opportunities...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6">
                            {filteredJobs.map(renderJobCard)}
                        </div>

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search criteria or check back later for new opportunities.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => {
                                        // You would need to implement pagination in your API call
                                        console.log('Previous page');
                                    }}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => {
                                        // You would need to implement pagination in your API call
                                        console.log('Next page');
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Company Info Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
                        <p className="text-lg text-muted-foreground mb-8">{companyInfo.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center">
                                    <Award className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h3 className="font-semibold">Innovation First</h3>
                                <p className="text-sm text-muted-foreground">
                                    Work with cutting-edge technology and contribute to innovative solutions.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h3 className="font-semibold">Great Culture</h3>
                                <p className="text-sm text-muted-foreground">
                                    Join a supportive, inclusive environment where everyone can thrive.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center">
                                    <Star className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h3 className="font-semibold">Growth Opportunities</h3>
                                <p className="text-sm text-muted-foreground">
                                    Advance your career with continuous learning and development programs.
                                </p>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border p-6">
                            <h3 className="font-semibold mb-4">Our Values</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {companyInfo.values.map((value, index) => (
                                    <Badge key={index} variant="outline" className="text-sm">
                                        {value}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details Dialog */}
            {selectedJob && (
                <Dialog open={!!selectedJob && !showApplicationForm} onOpenChange={() => setSelectedJob(null)}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                                    <DialogDescription className="flex items-center gap-4 mt-2 text-base">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="w-4 h-4" />
                                            {departments.find(dept => dept.id === selectedJob.department_id)?.department_name || 'Unknown Department'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {selectedJob.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {selectedJob.salary_range}
                                        </span>
                                    </DialogDescription>
                                </div>
                                {selectedJob.featured && <Badge className="bg-primary">Featured</Badge>}
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3">Job Description</h3>
                                <p className="text-muted-foreground">
                                    {selectedJob.description || 'No description available.'}
                                </p>
                            </div>

                            {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Key Responsibilities</h3>
                                        <ul className="space-y-2">
                                            {selectedJob.responsibilities.map((resp: any, index: any) => (
                                                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                    {resp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Requirements</h3>
                                        <ul className="space-y-2">
                                            {selectedJob.requirements.map((req: any, index: any) => (
                                                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Benefits & Perks</h3>
                                        <ul className="space-y-2">
                                            {selectedJob.benefits.map((benefit: any, index: any) => (
                                                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                                    <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter className="flex gap-3">
                            <Button variant="outline" onClick={() => setSelectedJob(null)}>
                                Close
                            </Button>
                            <Button onClick={() => handleApplyNow(selectedJob)}>
                                Apply for This Position
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Application Form Dialog */}
            <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to submit your application. We'll review it and get back to you soon.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input id="firstName" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input id="lastName" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" placeholder="john.doe@email.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+1 (555) 123-4567" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resume">Resume/CV *</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Drag and drop your resume or click to browse
                                </p>
                                <Button variant="outline" size="sm">
                                    Choose File
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter</Label>
                            <Textarea
                                id="coverLetter"
                                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn Profile</Label>
                            <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio/Website</Label>
                            <Input id="portfolio" placeholder="https://yourportfolio.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary Expectations</Label>
                            <Input id="salary" placeholder="$80,000 - $100,000" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="availability">Available Start Date</Label>
                            <Input id="availability" placeholder="Immediately / 2 weeks notice / etc." />
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitApplication}>
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Message */}
            {applicationSubmitted && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Application submitted successfully!</span>
                </div>
            )}
        </div>
    );
}