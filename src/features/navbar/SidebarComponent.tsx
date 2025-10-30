import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Clock,
  DollarSign,
  Settings,
  Settings2,
  LogOut,
  BarChart3,
  UserPlus,
  BookUser,
  Building2,
} from "lucide-react";

interface SidebarComponentProps {
  activeView: string;
  setActiveView: (view: string) => void;
}


const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
  { id: "employees", label: "Employees", icon: Users, link: "/employees" },
  { id: "recruitment", label: "Recruitment & Onboarding", icon: UserPlus, link: "/recruitment-onboarding" },
  { id: "jobposting", label: "Job Posting", icon: BookUser, link: "/job-posting" },
  { id: "attendance-leave", label: "Attendance & Leave", icon: Clock, link: "/attendance-leaving" },
  { id: "payroll", label: "Payroll & Benefits", icon: DollarSign },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, link: "/reports-analytics" },
  { id: "setup", label: "Setup Manager", icon: Settings2, link: "/setup-manager" },
];

export function SidebarComponent({ activeView, setActiveView }: SidebarComponentProps) {
  const navigate = useNavigate();

  const handleButton = (id: any, link: any) => {
    setActiveView(id);
    navigate(link);
  };

  return (
    <Sidebar className="bg-indigo-600 text-white flex flex-col justify-between">
      <SidebarHeader className="bg-indigo-600">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-white">HRIS System</h2>
            <p className="text-xs text-indigo-200">Human Resources</p>
          </div>
        </div>
      </SidebarHeader >

      <SidebarContent className="p-3 bg-indigo-600">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleButton(item.id, item.link)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 transition-colors
                  ${activeView === item.id
                    ? "bg-white text-indigo-600 font-semibold"
                    : "text-white hover:bg-indigo-500"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="bg-indigo-600">
        <div className="px-4 py-3 space-y-3 border-t border-indigo-500">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 bg-white text-indigo-600 font-bold">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-white">Admin User</div>
              <div className="text-xs text-indigo-200 truncate">admin@company.com</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="settings" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white text-indigo-600 hover:bg-indigo-100"
                onClick={() => setActiveView("settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white text-indigo-600 hover:bg-indigo-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar >
  );
}
