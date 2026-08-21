"use client";
import { useState } from "react";
import { assignDriverToOrder } from "@/app/actions/order";

interface Props {
  orderId: string;
  drivers: { id: string; name: string }[];
}

export function AssignDriverDropdown({ orderId, drivers }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = e.target.value;
    if (!driverId) return;
    
    setLoading(true);
    try {
      await assignDriverToOrder(orderId, driverId);
      // We don't need to set loading to false here because Next.js revalidatePath 
      // will completely refresh this row on the server and replace the component.
    } catch (err) {
      alert("Gagal menugaskan driver.");
      setLoading(false);
    }
  };

  if (loading) {
    return <span className="inline-flex items-center gap-2 rounded-md bg-beacon/20 px-3 py-2 text-xs font-semibold text-pine-dark animate-pulse">Menugaskan...</span>;
  }

  return (
    <select 
      onChange={handleAssign}
      aria-label="Assign driver"
      className="cursor-pointer rounded-md border border-line-strong bg-white px-3 py-2 text-xs font-semibold text-pine-dark transition-colors hover:border-pine hover:bg-mist focus:outline-none focus:ring-2 focus:ring-beacon/70"
    >
      <option value="">+ Assign Driver</option>
      {drivers.map(d => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  );
}
