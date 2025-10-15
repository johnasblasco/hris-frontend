import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar } from 'lucide-react';
import type { StepComponentProps } from '../setupManagerTypes';

export const HolidaysStep: React.FC<StepComponentProps> = ({ setupData, setSetupData }) => {
    const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Public' });

    const addHoliday = () => {
        if (newHoliday.name && newHoliday.date) {
            setSetupData({
                ...setupData,
                holidays: [
                    ...setupData.holidays,
                    { id: Date.now().toString(), ...newHoliday }
                ]
            });
            setNewHoliday({ name: '', date: '', type: 'Public' });
        }
    };

    const removeHoliday = (id: string) => {
        setSetupData({
            ...setupData,
            holidays: setupData.holidays.filter(h => h.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Company Holidays
                </CardTitle>
                <CardDescription>
                    Define public holidays and company-specific days off
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Holiday</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Holiday name"
                            value={newHoliday.name}
                            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        />
                        <Input
                            type="date"
                            value={newHoliday.date}
                            onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        />
                        <Select value={newHoliday.type} onValueChange={(value) => setNewHoliday({ ...newHoliday, type: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Public">Public Holiday</SelectItem>
                                <SelectItem value="Company">Company Holiday</SelectItem>
                                <SelectItem value="Optional">Optional Holiday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={addHoliday} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Holiday
                    </Button>
                </div>

                {setupData.holidays.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Holiday Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.holidays.map((holiday) => (
                                <TableRow key={holiday.id}>
                                    <TableCell className="font-medium">{holiday.name}</TableCell>
                                    <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge>{holiday.type}</Badge></TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeHoliday(holiday.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {setupData.holidays.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No holidays added yet. Add your first holiday above.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};