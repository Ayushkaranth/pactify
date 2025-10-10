"use client";

import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDroppable, DragOverlay } from '@dnd-kit/core';
import { Goal, GoalCard } from './GoalCard';
import { updateGoalStatus } from '@/app/dashboard/goals/actions';
import { Loader, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// This component no longer needs SortableContext
const GoalColumn = ({ title, id, goals, icon, color, isDroppable = true }: { title: string; id: string; goals: Goal[]; icon: React.ReactNode, color: string, isDroppable?: boolean }) => {
    const { setNodeRef, isOver } = useDroppable({ id, disabled: !isDroppable });

    return (
        <div ref={setNodeRef} className={`flex-shrink-0 w-full md:w-[380px] bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex flex-col transition-colors duration-300 ${isOver ? 'bg-green-900/20' : ''}`}>
            <div className="flex items-center gap-3 mb-4 px-2 flex-shrink-0">
                {icon}
                <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
                <span className="text-sm font-medium bg-slate-700 text-neutral-300 rounded-full px-2.5 py-0.5">{goals.length}</span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                {goals.length > 0 ? (
                    goals.map(goal => <GoalCard key={goal._id} goal={goal} />)
                ) : (
                     <div className="text-center text-neutral-500 pt-16 border-2 border-dashed border-slate-700 rounded-lg h-48 flex items-center justify-center"><p>{isDroppable ? "Drag active cards here" : "No failed goals"}</p></div>
                )}
            </div>
        </div>
    );
};

export function KanbanBoard({ initialGoals }: { initialGoals: Goal[] }) {
    const [goals, setGoals] = useState(initialGoals);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingMove, setPendingMove] = useState<{ activeId: string; overId: string } | null>(null);

    const activeGoal = activeId ? goals.find(g => g._id === activeId) : null;

    const handleDragStart = (event: any) => setActiveId(event.active.id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        // THE FIX: 'over.id' is now guaranteed to be the column ID.
        if (over && over.id === 'completed' && activeGoal?.status === 'active') {
            setPendingMove({ activeId: active.id as string, overId: 'completed' });
            setIsConfirmOpen(true);
        }
    };
    
    const handleConfirmMove = () => {
        if (!pendingMove) return;
        const { activeId, overId } = pendingMove;
        setGoals(currentGoals => currentGoals.map(goal => goal._id === activeId ? { ...goal, status: overId as 'completed' } : goal));
        updateGoalStatus(activeId, overId as 'completed');
        setIsConfirmOpen(false);
        setPendingMove(null);
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-8 h-full">
                <GoalColumn id="active" title="Active" goals={goals.filter(g => g.status === 'active')} icon={<Loader size={20} className="text-orange-400 animate-spin"/>} color="text-orange-400" />
                <GoalColumn id="completed" title="Completed" goals={goals.filter(g => g.status === 'completed')} icon={<CheckCircle2 size={20} className="text-green-400"/>} color="text-green-400" />
                <GoalColumn id="failed" title="Failed" goals={goals.filter(g => g.status === 'failed')} icon={<XCircle size={20} className="text-red-400"/>} color="text-red-400" isDroppable={false} />
            </div>

            <DragOverlay>{activeId && activeGoal ? <GoalCard goal={activeGoal} isOverlay /> : null}</DragOverlay>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center"><CheckCircle2 className="text-green-400 mr-2" />Confirm Completion</AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-400">Are you sure you want to mark this goal as completed? This action is permanent.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingMove(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmMove} className="bg-green-600 hover:bg-green-700">Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DndContext>
    );
}