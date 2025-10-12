"use client";

import { useState, useTransition, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Upload } from "lucide-react";
import { submitPactWorkAction } from "@/app/dashboard/pacts/actions/submit-work-action";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { bytesToHex, stringToBytes } from "viem";
import { pactsContractAddress, pactsContractAbi } from "@/lib/pacts-contract";
import { updatePactCompletionStatus } from "@/app/dashboard/pacts/actions";

export function FileSubmissionForm({ pactId }: { pactId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmittingFile, startSubmissionTransition] = useTransition();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { data: txHash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash });
  
  const [isDbUpdating, startDbUpdateTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
        setFile(null);
      } else {
        setSubmissionError(result.error || "An unexpected error occurred.");
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      startDbUpdateTransition(async () => {
        const result = await updatePactCompletionStatus(pactId);
        if (!result.success) {
          setSubmissionError(result.error || "Database update failed after on-chain transaction.");
        } else {
          reset();
        }
      });
    }
  }, [isSuccess, pactId, reset]);

  const isButtonDisabled = isSubmittingFile || isPending || isConfirming || isDbUpdating || !file;
  let buttonText = "Submit Work";
  if (isSubmittingFile) buttonText = "Uploading...";
  if (isPending) buttonText = "Confirm in wallet...";
  if (isConfirming) buttonText = "Finalizing...";
  if (isSuccess) buttonText = "Success!";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Submit Your Work</h3>
      <p className="text-neutral-400 text-sm">Upload a file for the creator to review.</p>
      <div className="flex items-center space-x-2">
        <Input type="file" onChange={handleFileChange} className="flex-grow bg-slate-800 text-white border-slate-700" />
        <Button type="submit" disabled={isButtonDisabled} className="bg-green-600 hover:bg-green-700">
          {(isSubmittingFile || isPending || isConfirming) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </div>
      {submissionError && <p className="text-xs text-red-500">{submissionError}</p>}
    </form>
  );
}