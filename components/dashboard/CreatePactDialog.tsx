"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react"; // Changed icon
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CreatePactForm } from "@/components/dashboard/CreatePactForm"; // Changed form component

export function CreatePactDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Changed button style and text */}
                <Button className="bg-blue-500 hover:bg-blue-600">
                    <Users className="mr-2 h-4 w-4" /> Create New Pact
                </Button>
            </DialogTrigger>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="bg-slate-900/80 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                    {/* Changed title and description */}
                    <DialogTitle className="text-2xl">Propose a New Pact</DialogTitle>
                    <DialogDescription>
                        Define the terms and invite a partner to a verifiable, on-chain agreement.
                    </DialogDescription>
                </DialogHeader>
                {/* Render the CreatePactForm instead of CreateGoalForm */}
                <CreatePactForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
