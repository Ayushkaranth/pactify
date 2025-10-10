"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Clock, Zap, GripVertical, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDraggable } from '@dnd-kit/core'; // Use the simpler Draggable hook
import { CSS } from '@dnd-kit/utilities';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { updateGoalStatus } from "@/app/dashboard/goals/actions";
import { Button } from "../ui/button";

export type Goal = {
  _id: string; title: string; description?: string; deadline?: Date;
  status: 'active' | 'completed' | 'failed'; stakeAmount?: number;
};

export function GoalCard({ goal, isOverlay }: { goal: Goal; isOverlay?: boolean }) {
  // We now use the simpler 'useDraggable' hook
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: goal._id });
  const [isPending, startTransition] = useTransition();

  const style = { transform: CSS.Translate.toString(transform) };
  
  const isStaked = goal.stakeAmount && goal.stakeAmount > 0;
  const statusColors = {
    active: "border-l-orange-400 hover:bg-orange-900/20",
    completed: "border-l-green-400 hover:bg-green-900/20",
    failed: "border-l-red-400 hover:bg-red-900/20",
  };

  const handleFail = () => {
    startTransition(async () => {
      await updateGoalStatus(goal._id, 'failed');
    });
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && !isOverlay ? "opacity-30" : "opacity-100")}>
      <div className={cn("bg-slate-800/50 rounded-lg p-4 border border-slate-700 border-l-4 relative group transition-colors duration-300", statusColors[goal.status])}>
        <div {...listeners} {...attributes} className="absolute top-2 right-2 p-2 text-neutral-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={16} /></div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-white mb-2 pr-4">{goal.title}</h3>
        </div>
        
        {goal.description && <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{goal.description}</p>}
        
        <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-neutral-400">
          {goal.deadline ? <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /><span>{formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}</span></div> : <div />}
          {isStaked && <div className="flex items-center font-semibold text-purple-400 px-2 py-1 bg-purple-900/30 rounded"><Zap className="h-4 w-4 mr-1.5" /> {goal.stakeAmount} MATIC</div>}
        </div>

        {goal.status === 'active' && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900 hover:text-red-200">
                            <X className="mr-1.5 h-4 w-4" /> Fail
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-yellow-400 mr-2" />Confirm Failure</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                Are you sure you want to mark this goal as failed? This action cannot be undone and may result in forfeiting your stake.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleFail} className="bg-red-600 hover:bg-red-700">Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )}
      </div>
    </div>
  );
}