import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateDriver } from "@/app/actions/driver";
import { DriverForm } from "@/components/admin/DriverForm";

export default async function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await db.driver.findUnique({
    where: { id },
    include: { vehicle: true }
  });

  if (!driver) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center gap-4 border-b border-line pb-6">
        <Link href="/admin/drivers" className="flex h-10 w-10 items-center justify-center rounded border border-line text-ink transition-colors hover:bg-line-strong">←</Link>
        <div>
          <h1 className="font-display text-3xl text-pine-dark">Edit Driver</h1>
          <p className="text-ink-soft">Perbarui data akun dan kendaraan {driver.name}.</p>
        </div>
      </div>
      <DriverForm initialDriver={driver} action={updateDriver} />
    </div>
  );
}
