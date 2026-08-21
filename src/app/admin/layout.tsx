import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper text-ink min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
