"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay, // Import the overlay
} from "@/components/ui/dialog";
import { CreateGoalForm } from "@/components/dashboard/CreateGoalForm";

export default function GoalsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-screen text-white flex flex-col">
      <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold">My Goals</h1>
              <p className="text-sm text-neutral-400">Your personal accountability dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
               <Link href="/dashboard">
                <Button variant="ghost">Back to Navigator</Button>
               </Link>
               <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
                    </Button>
                </DialogTrigger>
                {/* The Overlay provides the blur effect */}
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
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-24 text-center">
                <p className="text-neutral-500">
                    Your staked and active goals will appear here.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}