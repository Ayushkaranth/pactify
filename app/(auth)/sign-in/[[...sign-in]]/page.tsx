import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      afterSignInUrl="/dashboard"
      appearance={{
        // --- THIS IS THE KEY FIX ---
        // This removes Clerk's default light/dark theme, giving us a blank canvas.
        baseTheme: undefined, 
        elements: {
          // --- Main container for the entire component ---
          rootBox: "mx-auto w-full max-w-md",

          // --- Make the card blend in with our theme ---
          card: "bg-slate-900/50 border border-slate-700 shadow-2xl shadow-black/30",
          
          // --- Style the header text ---
          headerTitle: "text-white text-3xl font-bold",
          headerSubtitle: "text-neutral-400",

          // --- Style the Google/GitHub buttons ---
          socialButtonsBlockButton: "border-slate-700 hover:bg-slate-800 h-14",
          socialButtonsBlockButtonText: "text-white text-base",

          // --- Style the "or" divider ---
          dividerLine: "bg-slate-700",
          dividerText: "text-neutral-400",

          // --- Style the form fields ---
          formFieldLabel: "text-neutral-200",
          formFieldInput: "bg-slate-800 border-slate-700 text-white focus:ring-orange-500 h-12 text-base",

          // --- Style the primary button with our brand color ---
          formButtonPrimary: "bg-orange-500 hover:bg-orange-600 h-12 text-base font-semibold",

          // --- Style the footer link (e.g., "Don't have an account?") ---
          footerActionText: "text-neutral-400",
          footerActionLink: "text-orange-400 hover:text-orange-300 font-semibold",

          // --- Hide the default "Secured by Clerk" footer ---
          footer: "hidden", 
        },
      }}
    />
  );
}