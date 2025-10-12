import { BookOpen, Users, ExternalLink } from "lucide-react";
import { format } from "date-fns";

// A small helper to create the Etherscan link
const getTxLink = (txHash: string) => `https://sepolia.etherscan.io/tx/${txHash}`;

export function ProofOfWorkTimeline({ events }: { events: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Proof-of-Work Timeline</h2>
      <div className="relative border-l-2 border-slate-700 ml-6">
        {events.length > 0 ? (
            events.map((event, index) => (
                <div key={index} className="mb-10 ml-12">
                    <span className="absolute -left-[25px] flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full ring-8 ring-slate-900">
                        {event.type === 'journal' ? <BookOpen className="text-orange-400"/> : <Users className="text-blue-400"/>}
                    </span>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-white">{event.data.title}</h3>
                            <time className="text-sm font-normal text-neutral-500">{format(new Date(event.data.createdAt), "PPP")}</time>
                        </div>
                        <p className="text-base font-normal text-neutral-400 mb-4">{event.data.description}</p>
                        {(event.data.stakeTxHash || event.data.acceptanceTxHash) && (
                            <a href={getTxLink(event.data.stakeTxHash || event.data.acceptanceTxHash)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-orange-400 hover:text-orange-300">
                                View On-Chain Proof <ExternalLink className="w-3 h-3 ml-1.5" />
                            </a>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <p className="ml-12 text-neutral-500">This user has not completed any public work yet.</p>
        )}
      </div>
    </div>
  );
}