import { useState } from 'react';
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


// Mock job data for candidates
const publicJobPostings = [
    {
        id: '1',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'New York, NY',
        type: 'Full-time',
        remote: 'Hybrid',
        salary: '$90,000 - $120,000',
        posted: '3 days ago',
        featured: true,
        description: 'Join our innovative engineering team and help build the next generation of HR technology solutions. You\'ll work with cutting-edge technologies and collaborate with talented professionals.',
        responsibilities: [
            'Design and develop scalable web applications using React and Node.js',
            'Collaborate with product managers and designers to implement new features',
            'Write clean, maintainable, and well-documented code',
            'Participate in code reviews and mentor junior developers',
            'Contribute to architectural decisions and technical strategy'
        ],
        requirements: [
            '5+ years of experience in software development',
            'Strong proficiency in React, TypeScript, and Node.js',
            'Experience with cloud platforms (AWS, Azure, or GCP)',
            'Knowledge of database systems (PostgreSQL, MongoDB)',
            'Excellent problem-solving and communication skills'
        ],
        benefits: [
            'Competitive salary and equity package',
            'Comprehensive health, dental, and vision insurance',
            'Flexible work arrangements and remote options',
            '20 days PTO plus holidays',
            'Professional development budget ($2,000/year)',
            'Modern office with free snacks and drinks'
        ]
    },
    {
        id: '2',
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'San Francisco, CA',
        type: 'Full-time',
        remote: 'On-site',
        salary: '$70,000 - $85,000',
        posted: '1 week ago',
        featured: false,
        description: 'Drive our marketing initiatives and help grow our brand presence in the HR technology space. Perfect opportunity for a creative marketing professional.',
        responsibilities: [
            'Develop and execute comprehensive marketing campaigns',
            'Manage social media presence and content strategy',
            'Collaborate with sales team to generate qualified leads',
            'Analyze marketing metrics and optimize campaigns',
            'Coordinate events, webinars, and trade shows'
        ],
        requirements: [
            '3+ years of experience in digital marketing',
            'Strong understanding of marketing analytics and tools',
            'Experience with marketing automation platforms',
            'Excellent written and verbal communication skills',
            'Creative mindset with attention to detail'
        ],
        benefits: [
            'Competitive salary with performance bonuses',
            'Health and wellness benefits',
            'Creative and collaborative work environment',
            'Professional development opportunities',
            'Flexible PTO policy'
        ]
    },
    {
        id: '3',
        title: 'UX Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Contract',
        remote: 'Remote',
        salary: '$60 - $80/hour',
        posted: '5 days ago',
        featured: true,
        description: 'Shape the user experience of our HR platform and create intuitive, beautiful interfaces that delight our users.',
        responsibilities: [
            'Create user-centered design solutions for web and mobile',
            'Conduct user research and usability testing',
            'Develop wireframes, prototypes, and high-fidelity designs',
            'Collaborate with product and engineering teams',
            'Maintain and evolve our design system'
        ],
        requirements: [
            'Portfolio demonstrating strong UX/UI design skills',
            'Proficiency in Figma, Sketch, or similar design tools',
            'Experience with user research methodologies',
            'Understanding of web and mobile design principles',
            'Strong communication and collaboration skills'
        ],
        benefits: [
            'Competitive hourly rate',
            'Fully remote position',
            'Flexible schedule',
            'Opportunity to work with cutting-edge design tools',
            'Collaborative and supportive team environment'
        ]
    },
    {
        id: '4',
        title: 'Sales Representative',
        department: 'Sales',
        location: 'Chicago, IL',
        type: 'Full-time',
        remote: 'Hybrid',
        salary: '$50,000 - $70,000 + Commission',
        posted: '2 weeks ago',
        featured: false,
        description: 'Join our growing sales team and help companies transform their HR operations with our innovative solutions.',
        responsibilities: [
            'Generate new business through prospecting and lead qualification',
            'Conduct product demonstrations and presentations',
            'Manage sales pipeline and forecast revenue',
            'Build and maintain customer relationships',
            'Collaborate with marketing team on lead generation'
        ],
        requirements: [
            '2+ years of B2B sales experience',
            'Strong communication and presentation skills',
            'Experience with CRM systems (Salesforce preferred)',
            'Self-motivated with a results-driven mindset',
            'Bachelor\'s degree preferred'
        ],
        benefits: [
            'Base salary plus uncapped commission',
            'Comprehensive benefits package',
            'Sales training and development programs',
            'Career advancement opportunities',
            'Team incentive trips and rewards'
        ]
    }
];

const companyInfo = {
    name: 'TechCorp Solutions',
    description: 'We\'re revolutionizing human resources technology with innovative solutions that help companies manage their most valuable asset - their people.',
    mission: 'To empower organizations with cutting-edge HR technology that simplifies people management and drives business success.',
    values: ['Innovation', 'Collaboration', 'Integrity', 'Growth', 'Customer Focus'],
    stats: {
        employees: '250+',
        offices: '5',
        founded: '2015',
        customers: '1000+'
    }
};

export function CandidatePortal() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);

    const filteredJobs = publicJobPostings.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter || locationFilter === 'all' || job.location.includes(locationFilter);
        const matchesDepartment = !departmentFilter || departmentFilter === 'all' || job.department === departmentFilter;
        return matchesSearch && matchesLocation && matchesDepartment;
    });

    const handleApplyNow = (job: any) => {
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

    const renderJobCard = (job: any) => (
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
                                {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                {job.remote}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{job.posted}</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Jobs</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Job title or keyword"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All departments</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All locations</SelectItem>
                                    <SelectItem value="New York">New York, NY</SelectItem>
                                    <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                                    <SelectItem value="Chicago">Chicago, IL</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearchTerm('');
                                    setLocationFilter('all');
                                    setDepartmentFilter('all');
                                }}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="container mx-auto px-4 pb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {filteredJobs.length} Open Position{filteredJobs.length !== 1 ? 's' : ''}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        Updated daily
                    </div>
                </div>

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
                                            {selectedJob.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {selectedJob.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {selectedJob.salary}
                                        </span>
                                    </DialogDescription>
                                </div>
                                {selectedJob.featured && <Badge className="bg-primary">Featured</Badge>}
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3">Job Description</h3>
                                <p className="text-muted-foreground">{selectedJob.description}</p>
                            </div>

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