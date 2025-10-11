export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Panel: Branding & Value Proposition */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-slate-900 text-white border-r border-slate-700">
        <div className="text-left max-w-md">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Beyond Promises.
            <br />
            Verifiable Proof.
          </h1>
          <p className="text-lg text-neutral-400">
            Join a community of ambitious professionals who turn their goals, agreements, and outreach into tangible, on-chain commitments.
          </p>
        </div>
      </div>
      
      {/* Right Panel: The Form */}
      <div className="flex items-center justify-center p-8 bg-slate-950">
        {children}
      </div>
    </div>
  );
}