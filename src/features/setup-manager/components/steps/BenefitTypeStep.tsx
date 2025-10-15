import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Gift, Save, Download } from 'lucide-react';
import type { StepComponentProps } from '../setupManagerTypes';
import { toast } from 'sonner';
import api from '@/utils/axios'

// Backend interface to match Laravel API response
interface BackendBenefitType {
    id: number;
    benefit_name: string;
    category: string;
    description: string;
    is_active: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

interface BenefitTypesResponse {
    isSuccess: boolean;
    message: string;
    benefit_types: BackendBenefitType[];
}

interface CreateBenefitTypeResponse {
    isSuccess: boolean;
    message: string;
    benefit_types: BackendBenefitType;
}

export const BenefitTypesStep: React.FC<StepComponentProps> = ({ setupData, setSetupData }) => {
    const [newBenefit, setNewBenefit] = useState({
        name: '',
        category: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [backendBenefitTypes, setBackendBenefitTypes] = useState<BackendBenefitType[]>([]);

    // Convert backend data to frontend format
    const backendToFrontendFormat = (backendData: BackendBenefitType[]) => {
        return backendData.map(benefitType => ({
            id: benefitType.id.toString(),
            name: benefitType.benefit_name,
            category: benefitType.category || 'Other',
            description: benefitType.description || '',
        }));
    };

    // Convert frontend data to backend format
    const frontendToBackendFormat = (frontendData: {
        name: string;
        category: string;
        description: string;
    }) => {
        return {
            benefit_name: frontendData.name,
            category: frontendData.category,
            description: frontendData.description,
            is_active: true,
        };
    };

    // Load benefit types from backend
    const loadBenefitTypes = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/benefit-types');
            const result: BenefitTypesResponse = response.data;

            if (result.isSuccess && result.benefit_types) {
                setBackendBenefitTypes(result.benefit_types);

                // Also update setupData with the loaded benefit types
                const frontendData = backendToFrontendFormat(result.benefit_types);
                setSetupData({
                    ...setupData,
                    benefitTypes: frontendData
                });

                toast.success('Benefit types loaded successfully');
            } else {
                toast.error('Failed to load benefit types');
            }

            return result.benefit_types;
        } catch (error: any) {
            console.error('Failed to load benefit types:', error);

            // Don't show error if it's 404 (no data yet)
            if (error.response?.status !== 404) {
                toast.error('Failed to load benefit types');
            }

            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Add benefit type to backend
    const addBenefitType = async () => {
        if (!newBenefit.name.trim()) {
            toast.error('Please enter a benefit name');
            return;
        }

        if (!newBenefit.category) {
            toast.error('Please select a category');
            return;
        }

        try {
            setIsSaving(true);
            const backendData = frontendToBackendFormat(newBenefit);

            const response = await api.post('/create/benefit-types', backendData);
            const result: CreateBenefitTypeResponse = response.data;

            if (result.isSuccess) {
                toast.success('Benefit type created successfully');

                // Clear the form
                setNewBenefit({
                    name: '',
                    category: '',
                    description: ''
                });

                // Reload benefit types from backend to get the updated list
                await loadBenefitTypes();

                return result;
            } else {
                throw new Error(result.message || 'Failed to create benefit type');
            }
        } catch (error: any) {
            console.error('Failed to create benefit type:', error);

            // Handle duplicate benefit name error
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors?.benefit_name) {
                    toast.error(`Benefit name already exists: ${errors.benefit_name[0]}`);
                } else {
                    toast.error('Validation error occurred');
                }
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to create benefit type';
                toast.error(errorMessage);
            }

            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    // Archive benefit type in backend
    const removeBenefitType = async (id: string) => {
        if (!confirm('Are you sure you want to archive this benefit type?')) {
            return;
        }

        try {
            const response = await api.post(`/benefit-types/${id}/archive`);

            if (response.data.isSuccess) {
                toast.success('Benefit type archived successfully');

                // Reload benefit types from backend to get the updated list
                await loadBenefitTypes();
            } else {
                throw new Error('Failed to archive benefit type');
            }
        } catch (error: any) {
            console.error('Failed to archive benefit type:', error);
            const errorMessage = error.response?.data?.message || 'Failed to archive benefit type';
            toast.error(errorMessage);
        }
    };

    // Add benefit type to local state only (for setup wizard)
    const addBenefitTypeToLocal = () => {
        if (newBenefit.name && newBenefit.category) {
            setSetupData({
                ...setupData,
                benefitTypes: [
                    ...setupData.benefitTypes,
                    {
                        id: Date.now().toString(),
                        name: newBenefit.name,
                        category: newBenefit.category,
                        description: newBenefit.description
                    }
                ]
            });
            setNewBenefit({ name: '', category: '', description: '' });
            toast.success('Benefit type added to setup (will be saved later)');
        }
    };

    // Remove benefit type from local state only
    const removeBenefitTypeFromLocal = (id: string) => {
        setSetupData({
            ...setupData,
            benefitTypes: setupData.benefitTypes.filter(b => b.id !== id)
        });
    };

    // Load benefit types when component mounts
    useEffect(() => {
        loadBenefitTypes();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Benefit Types
                </CardTitle>
                <CardDescription>
                    Define employee benefit packages and perks. Manage benefit types directly in your backend system.
                </CardDescription>

                {/* Backend Actions */}
                <div className="flex gap-2 mt-4">
                    <Button
                        onClick={loadBenefitTypes}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isLoading ? 'Loading...' : 'Refresh from Server'}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Add Benefit Form */}
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Benefit Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Benefit name"
                            value={newBenefit.name}
                            onChange={(e) => setNewBenefit({ ...newBenefit, name: e.target.value })}
                        />
                        <Select
                            value={newBenefit.category}
                            onValueChange={(value) => setNewBenefit({ ...newBenefit, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Retirement">Retirement</SelectItem>
                                <SelectItem value="Insurance">Insurance</SelectItem>
                                <SelectItem value="Wellness">Wellness</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Transportation">Transportation</SelectItem>
                                <SelectItem value="Housing">Housing</SelectItem>
                                <SelectItem value="Bonus">Bonus</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Description"
                            value={newBenefit.description}
                            onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={addBenefitType}
                            size="sm"
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save to Server'}
                        </Button>

                        <Button
                            onClick={addBenefitTypeToLocal}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Setup Only
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        "Save to Server" will create the benefit type in your database. "Add to Setup Only" will only add it to the current setup session.
                    </p>
                </div>

                {/* Server Benefit Types List */}
                {backendBenefitTypes.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Benefit Types from Server</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Benefit Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backendBenefitTypes.map((benefitType) => (
                                    <TableRow key={benefitType.id}>
                                        <TableCell className="font-medium">{benefitType.benefit_name}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                benefitType.category === 'Health' ? 'default' :
                                                    benefitType.category === 'Retirement' ? 'secondary' :
                                                        benefitType.category === 'Insurance' ? 'destructive' :
                                                            benefitType.category === 'Wellness' ? 'outline' :
                                                                'secondary'
                                            }>
                                                {benefitType.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {benefitType.description || 'No description'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${benefitType.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {benefitType.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeBenefitType(benefitType.id.toString())}
                                                title="Archive Benefit Type"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Local Setup Benefit Types List */}
                {setupData.benefitTypes.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Benefit Types in Current Setup</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Benefit Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {setupData.benefitTypes.map((benefit) => (
                                    <TableRow key={benefit.id}>
                                        <TableCell className="font-medium">{benefit.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                benefit.category === 'Health' ? 'default' :
                                                    benefit.category === 'Retirement' ? 'secondary' :
                                                        benefit.category === 'Insurance' ? 'destructive' :
                                                            benefit.category === 'Wellness' ? 'outline' :
                                                                'secondary'
                                            }>
                                                {benefit.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{benefit.description}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeBenefitTypeFromLocal(benefit.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {backendBenefitTypes.length === 0 && setupData.benefitTypes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No benefit types found. Add your first benefit type above.
                    </div>
                )}

                {/* Information Notice */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-800">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Benefit types are managed in your backend system. Use "Save to Server" to create permanent benefit types.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};