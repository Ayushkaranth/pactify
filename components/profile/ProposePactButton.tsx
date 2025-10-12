"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CreatePactForm } from "@/components/dashboard/CreatePactForm";
import { User } from "@clerk/nextjs/server";

export function ProposePactButton({ freelancer }: { freelancer: User }) {
  const [open, setOpen] = useState(false);

  // Find the primary email address from the full user object provided by the server
  const primaryEmail = freelancer.emailAddresses.find(
    (email) => email.id === freelancer.primaryEmailAddressId
  )?.emailAddress;

  // A failsafe in the rare case a user has no primary email.
  if (!primaryEmail) {
    return <Button disabled>Cannot Propose Pact (User has no primary email)</Button>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 text-lg px-8 py-6 rounded-full">
          <Users className="mr-2 h-5 w-5" /> Propose a Pact
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="bg-slate-900/80 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Propose a Pact to {freelancer.firstName}</DialogTitle>
          <DialogDescription>
            Define the terms of your agreement. The partner's email is pre-filled.
          </DialogDescription>
        </DialogHeader>
        {/* We pass the email down to the form to pre-fill the input */}
        <CreatePactForm setOpen={setOpen} prefilledPartnerEmail={primaryEmail} />
      </DialogContent>
    </Dialog>
  );
}
