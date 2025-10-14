import Login from '@/auth/Login'
import { useRoutes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/features/dashboard/Dashboard'
import SettingsComponent from '@/features/settings/SettingsComponent'
import ReportAnalytics from '@/features/report-analytics/ReportAnalytics'
import AttendanceLeaving from '@/features/attendance-leaving/AttendanceLeaving'
import { SetupManager } from '@/features/setup-manager/SetupManager'
import Employees from '@/features/employees/Employees'
import RecruitmentOnboarding from '@/features/recruitment-onboarding/RecuitmentOnboarding'
const MainRoutes = () => {
    const routes = useRoutes([

        //BASE
        { path: "/", element: <Login /> },

        //HOME
        {
            path: "/", // parent wrapper
            element: <Layout />,
            children: [
                { path: "dashboard", element: <Dashboard /> },
                { path: "settings", element: <SettingsComponent /> },
                { path: "reports-analytics", element: <ReportAnalytics /> },
                { path: "setup-manager", element: <SetupManager /> },
                { path: "attendance-leaving", element: <AttendanceLeaving /> },
                { path: "employees", element: <Employees /> },
                { path: "recruitment-onboarding", element: <RecruitmentOnboarding /> },
            ],
        },
    ])

    return routes
}

export default MainRoutes