import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface HeaderProps {
    setViewMode: (mode: 'admin' | 'candidate') => void;
}

export function HeadbarComponent({ setViewMode }: HeaderProps) {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
                <SidebarTrigger />
                <div className="ml-auto flex items-center space-x-4">
                    <Button
                        onClick={() => setViewMode('candidate')}
                        variant="outline"
                        size="sm"
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        Candidate View
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Welcome back, Admin
                    </span>
                </div>
            </div>
        </div>
    );
}