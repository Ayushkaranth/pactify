import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      afterSignUpUrl="/dashboard"
      appearance={{
        baseTheme: undefined,
        elements: {
          rootBox: "mx-auto w-full max-w-md",
          card: "bg-slate-900/50 border border-slate-700 shadow-2xl shadow-black/30",
          headerTitle: "text-white text-3xl font-bold",
          headerSubtitle: "text-neutral-400",
          socialButtonsBlockButton: "border-slate-700 hover:bg-slate-800 h-14",
          socialButtonsBlockButtonText: "text-white text-base",
          dividerLine: "bg-slate-700",
          dividerText: "text-neutral-400",
          formFieldLabel: "text-neutral-200",
          formFieldInput: "bg-slate-800 border-slate-700 text-white focus:ring-orange-500 h-12 text-base",
          formButtonPrimary: "bg-orange-500 hover:bg-orange-600 h-12 text-base font-semibold",
          footerActionText: "text-neutral-400",
          footerActionLink: "text-orange-400 hover:text-orange-300 font-semibold",
          footer: "hidden",
        },
      }}
    />
  );
}