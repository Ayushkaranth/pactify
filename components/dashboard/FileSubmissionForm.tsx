"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Upload, FileText, X, Send } from "lucide-react";
import { submitPactWorkAction } from "@/app/dashboard/pacts/actions/submit-work-action";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { bytesToHex, stringToBytes } from "viem";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import { updatePactCompletionStatus } from "@/app/dashboard/pacts/actions";

export function FileSubmissionForm({ pactId }: { pactId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmittingFile, startSubmissionTransition] = useTransition();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: txHash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });

  const [isDbUpdating, startDbUpdateTransition] = useTransition();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setSubmissionError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setSubmissionError("Please select a file to submit.");
      return;
    }

    setSubmissionError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pactId", pactId);

    // Step 1: Upload the file and update the database off-chain
    startSubmissionTransition(async () => {
      const result = await submitPactWorkAction(formData);
      if (result.success) {
        // Step 2: Once the file is uploaded, trigger the on-chain action
        writeContract({
          address: pactsContractAddress,
          abi: pactsContractAbi,
          functionName: 'signalCompletion',
          args: [bytesToHex(stringToBytes(pactId.padEnd(32, '\0')))],
        });
        // Do NOT clear file state here. Wait for confirmation.
      } else {
        setSubmissionError(result.error || "An unexpected error occurred.");
      }
    });
  };

  // Effect to update the database after the on-chain transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      startDbUpdateTransition(async () => {
        const result = await updatePactCompletionStatus(pactId);
        if (!result.success) {
          setSubmissionError(result.error || "Database update failed after on-chain transaction.");
        } else {
          setFile(null); // Clear file state ONLY after full success
          reset();
        }
      });
    }
  }, [isSuccess, pactId, reset]);

  // UI state logic for the button
  const isButtonDisabled = isSubmittingFile || isPending || isConfirming || isDbUpdating || !file;
  let buttonText = "Submit Work";
  if (isSubmittingFile) buttonText = "Uploading...";
  if (isPending) buttonText = "Confirm in wallet...";
  if (isConfirming) buttonText = "Finalizing...";
  if (isSuccess) buttonText = "Submission Confirmed!";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Submit Your Work</h3>

      {/* DRAG-AND-DROP AREA */}
      <div 
        className={`p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer 
                   ${file ? 'border-green-500 bg-slate-700/50' : 'border-slate-600 hover:border-blue-500 bg-slate-800'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Input 
            type="file" 
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} 
            className="hidden"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.pdf"
        />
        
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            >
              <X className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        ) : (
          <div className="text-center text-neutral-400">
            <Upload className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs mt-1">PNG, JPG, or PDF (Max 5MB)</p>
          </div>
        )}
      </div>

      {submissionError && <p className="text-xs text-red-500">{submissionError}</p>}
            
      <Button type="submit" disabled={isButtonDisabled} className="w-full bg-green-600 hover:bg-green-700">
        {(isSubmittingFile || isPending || isConfirming || isDbUpdating) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {buttonText}
      </Button>
    </form>
  );
}