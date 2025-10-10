import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Clock, DollarSign, Settings, Settings2, LogOut, BarChart3, UserPlus, Award, Building2 } from "lucide-react";

interface SidebarComponentProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: "/dashboard" },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'attendance-leave', label: 'Attendance & Leave', icon: Clock },
  { id: 'recruitment', label: 'Recruitment & Onboarding', icon: UserPlus },
  { id: 'talent', label: 'Talent Management', icon: Award },
  { id: 'payroll', label: 'Payroll & Benefits', icon: DollarSign },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, link: "/reports-analytics" },
  { id: 'setup', label: 'setup manager', icon: Settings2, link: "/setup-manager" },
];

export function SidebarComponent({ activeView, setActiveView }: SidebarComponentProps) {
  const navigate = useNavigate();

  const handleButton = (id: any, link: any) => {
    setActiveView(id)
    navigate(link)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">HRIS System</h2>
            <p className="text-xs text-muted-foreground">Human Resources</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>

              <SidebarMenuButton
                onClick={() => handleButton(item.id, item.link)}
                className={`w-full hover:cursor-pointer flex items-center gap-2 transition-colors ${activeView === item.id
                  ? " text-indigo-600 bg-neutral-200 hover:text-indigo-700"
                  : "text-muted-foreground  hover:tex\t-foreground"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Admin User</div>
              <div className="text-xs text-muted-foreground truncate">admin@company.com</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="settings">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setActiveView('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}