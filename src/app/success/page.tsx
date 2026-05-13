"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "Management";

  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-4">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Application Submitted!</h1>
      <p className="text-xl text-muted-foreground leading-relaxed">
        Thank you for applying to Team Plenum's {domain} Domain. We have received your
        details and will review them shortly. Keep an eye on your email for further updates!
      </p>
      <div className="pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAdmin={false} />
      <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
