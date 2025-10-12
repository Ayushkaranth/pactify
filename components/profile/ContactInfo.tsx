"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ContactInfo({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
        <p className="text-neutral-300 font-mono text-sm md:text-base break-all">{email}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="ml-4 flex-shrink-0"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-400" />
          ) : (
            <Copy className="h-5 w-5 text-neutral-400" />
          )}
        </Button>
      </div>
      <Link href="/dashboard/pacts">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 font-bold">
          <Users className="mr-2 h-5 w-5" /> Go to Pacts Dashboard to Propose
        </Button>
      </Link>
    </div>
  );
}