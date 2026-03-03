import Sidebar from "@/components/Dashboard/Sidebar"
import AuthGuard from "@/components/common/AuthGuard"

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col sm:flex-row relative min-h-screen bg-gray-900">
            <Sidebar />
            <main className="flex-1 h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
                <div className="mx-auto w-full max-w-7xl">
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </div>
            </main>
        </div>
    )
}
