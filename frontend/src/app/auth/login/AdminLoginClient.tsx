"use client";

import BrokerAccessPanel from "@/components/BrokerAccessPanel";

export default function AdminLoginClient({ nextPath }: { nextPath: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f2] px-5 py-10 text-[#14213d]">
      <div className="w-full max-w-xl">
        <div className="mb-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1687b8]">Opsivio control plane</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Open your workspace</h1>
          <p className="mt-2 text-sm text-[#53657d]">Sign in to manage broker data, WhatsApp ingestion, and white-label publishing.</p>
        </div>
        <BrokerAccessPanel nextPath={nextPath} onClose={() => window.history.back()} />
      </div>
    </main>
  );
}
