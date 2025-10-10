"use client"; // This is the most important line

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CreateGoalForm } from "@/components/dashboard/CreateGoalForm";

export function CreateGoalDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
                </Button>
            </DialogTrigger>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="bg-slate-900/80 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Commit to a New Goal</DialogTitle>
                    <DialogDescription>
                        Follow the steps below to define your objective and raise the stakes.
                    </DialogDescription>
                </DialogHeader>
                <CreateGoalForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}