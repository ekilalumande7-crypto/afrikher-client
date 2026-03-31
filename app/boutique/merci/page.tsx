import { Suspense } from "react";
import MerciClient from "./MerciClient";
import Navbar from "@/components/layout/Navbar";

function MerciLoading() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />
      <div className="flex items-center justify-center h-[40vh]">
        <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    </main>
  );
}

export default function MerciPage() {
  return (
    <Suspense fallback={<MerciLoading />}>
      <MerciClient />
    </Suspense>
  );
}
