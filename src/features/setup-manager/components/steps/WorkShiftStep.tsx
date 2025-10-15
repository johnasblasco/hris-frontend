import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Clock } from 'lucide-react';
import type { StepComponentProps } from '../setupManagerTypes';

export const WorkShiftsStep: React.FC<StepComponentProps> = ({ setupData, setSetupData }) => {
    const [newShift, setNewShift] = useState({ name: '', startTime: '', endTime: '', description: '' });

    const addShift = () => {
        if (newShift.name && newShift.startTime && newShift.endTime) {
            setSetupData({
                ...setupData,
                workShifts: [
                    ...setupData.workShifts,
                    { id: Date.now().toString(), ...newShift }
                ]
            });
            setNewShift({ name: '', startTime: '', endTime: '', description: '' });
        }
    };

    const removeShift = (id: string) => {
        setSetupData({
            ...setupData,
            workShifts: setupData.workShifts.filter(s => s.id !== id)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Work Shifts
                </CardTitle>
                <CardDescription>
                    Define work shift schedules for attendance tracking
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3 bg-slate-50">
                    <h4 className="font-medium">Add New Shift</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <Input
                            placeholder="Shift name"
                            value={newShift.name}
                            onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                        />
                        <Input
                            type="time"
                            placeholder="Start time"
                            value={newShift.startTime}
                            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                        />
                        <Input
                            type="time"
                            placeholder="End time"
                            value={newShift.endTime}
                            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                        />
                        <Input
                            placeholder="Description"
                            value={newShift.description}
                            onChange={(e) => setNewShift({ ...newShift, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={addShift} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Shift
                    </Button>
                </div>

                {setupData.workShifts.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shift Name</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {setupData.workShifts.map((shift) => (
                                <TableRow key={shift.id}>
                                    <TableCell className="font-medium">{shift.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{shift.startTime}</Badge></TableCell>
                                    <TableCell><Badge variant="secondary">{shift.endTime}</Badge></TableCell>
                                    <TableCell>{shift.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeShift(shift.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {setupData.workShifts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No work shifts added yet. Add your first shift above.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};