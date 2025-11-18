import Sidebar from "@/components/Dashboard/Sidebar"
import AuthGuard from "@/components/common/AuthGuard"
export default function DashboardLayout({children}){
    return (
        <div className="flex flex-col sm:flex-row relative min-h-[calc(100vh-3.5rem)]">
            <Sidebar/>
            <main className="w-full h-full bg-gray-900">
                <div className="mx-auto w-11/12 max-w-[1000px] py-6 sm:py-10 px-4 sm:px-0">
                   <AuthGuard>
                   {children}
                   </AuthGuard>
                </div>
            </main>
        </div>
    )
}
