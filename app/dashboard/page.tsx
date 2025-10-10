import { RotatingFeatures } from "@/components/dashboard/RotatingFeatures";
import { ProfileStatusCard } from "@/components/dashboard/ProfileStatusCard";

export default function DashboardPage() {
  return (
    <div className="w-full h-screen text-white flex flex-col p-4 overflow-hidden">
      {/* The new, improved, floating header card is placed at the top */}
      <div className="w-full pt-8 pb-4 flex-shrink-0">
        <ProfileStatusCard />
      </div>
      
      {/* Main content area that grows to fill the rest of the screen */}
      <div className="flex-grow w-full flex items-center justify-center relative">
        <RotatingFeatures />
      </div>
    </div>
  );
}