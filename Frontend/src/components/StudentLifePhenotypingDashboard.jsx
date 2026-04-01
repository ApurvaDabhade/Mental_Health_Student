import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@sl/components/ui/sonner";
import { Toaster } from "@sl/components/ui/toaster";
import { TooltipProvider } from "@sl/components/ui/tooltip";
import Index from "@sl/pages/Index";

const queryClient = new QueryClient();

export default function StudentLifePhenotypingDashboard({ variant = "dark" }) {
  const scopeClass =
    variant === "light" ? "sl-phenotyping-scope-light" : "sl-phenotyping-scope";
  return (
    <div className={`${scopeClass} min-h-screen w-full`}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Index />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}
