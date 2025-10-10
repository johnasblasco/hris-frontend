import Login from '@/auth/Login'
import { useRoutes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/features/dashboard/Dashboard'
import SettingsComponent from '@/features/settings/SettingsComponent'
import ReportAnalytics from '@/features/report-analytics/ReportAnalytics'
import { SetupManager } from '@/features/setup-manager/SetupManager'
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

            ],
        },
    ])

    return routes
}

export default MainRoutes