import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper text-ink min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-[1200px] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
