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
    return <span className="text-xs text-pine-dark font-medium animate-pulse">Menugaskan...</span>;
  }

  return (
    <select 
      onChange={handleAssign}
      className="text-xs px-2 py-1.5 border border-line-strong rounded focus:outline-none focus:border-pine cursor-pointer bg-white"
    >
      <option value="">+ Assign Driver</option>
      {drivers.map(d => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  );
}
