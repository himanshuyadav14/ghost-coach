import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardWelcome />
      <DashboardOverview />
    </div>
  );
}
