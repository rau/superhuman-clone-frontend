import "@/globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { SharedLayout } from "@/components/SharedLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <ReactQueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>
          <ToastContainer />
          <SharedLayout />
        </TooltipProvider>
      </ThemeProvider>
    </ReactQueryClientProvider>
  );
}
