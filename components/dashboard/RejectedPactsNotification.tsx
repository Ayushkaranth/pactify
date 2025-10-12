"use client";

import { useTransition } from "react";
import { Pact } from "./PactCard";
import { Button } from "../ui/button";
import { AlertTriangle, X } from "lucide-react";
import { dismissRejectedPactAction } from "@/app/dashboard/pacts/actions";

export function RejectedPactsNotification({ rejectedPacts }: { rejectedPacts: Pact[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDismiss = (pactId: string) => {
    startTransition(async () => {
      await dismissRejectedPactAction(pactId);
    });
  };

  return (
    <div className="space-y-2">
      {rejectedPacts.map(pact => (
        <div key={pact._id} className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3 flex items-center justify-between">
          {/* CORRECTED: The text content div needs to be flexible and not push the button */}
          <div className="flex items-center flex-grow min-w-0 pr-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-yellow-300 text-sm truncate">
              Your pact proposal, <span className="font-bold">"{pact.title}"</span>, was rejected by the partner.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-300 hover:bg-yellow-800/50 hover:text-yellow-200 flex-shrink-0"
            onClick={() => handleDismiss(pact._id)}
            disabled={isPending}
          >
            <X size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
}