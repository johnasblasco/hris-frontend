import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceTracker from "./components/AttendanceTracker";
import LeaveManagement from "./components/LeaveManagement";
import { Clock, Calendar } from 'lucide-react';

const AttendanceLeaving = () => {
    const [activeTab, setActiveTab] = useState('attendance');

    return (
        <div className="p-6 space-y-0">
            <div>
                <h2 className="text-3xl font-bold">Attendance and Leaving </h2>
                <p className="text-muted-foreground">managing employee's daily attendance and leaving </p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
                <div className="border-b px-6 pt-6">
                    <div className="pb-4">
                        <h1>Attendance & Leave</h1>
                        <p className="text-muted-foreground">
                            Track attendance and manage leave requests
                        </p>
                    </div>
                    <TabsList>
                        <TabsTrigger value="attendance" className="gap-2">
                            <Clock className="w-4 h-4" />
                            Attendance
                        </TabsTrigger>
                        <TabsTrigger value="leave" className="gap-2">
                            <Calendar className="w-4 h-4" />
                            Leave
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="attendance" className="mt-0">
                    <AttendanceTracker />
                </TabsContent>

                <TabsContent value="leave" className="mt-0">
                    <LeaveManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
export default AttendanceLeaving;