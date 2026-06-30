import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import CRM from "@/pages/dashboard/CRM";
import Pipeline from "@/pages/dashboard/Pipeline";
import ContentCalendar from "@/pages/dashboard/ContentCalendar";
import AIGenerator from "@/pages/dashboard/AIGenerator";
import Settings from "@/pages/dashboard/Settings";
import Projects from "@/pages/dashboard/Projects";
import Invoices from "@/pages/dashboard/Invoices";
import TeamTasks from "@/pages/dashboard/TeamTasks";
import Notes from "@/pages/dashboard/Notes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="crm" element={<CRM />} />
            <Route path="projects" element={<Projects />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="tasks" element={<TeamTasks />} />
            <Route path="notes" element={<Notes />} />
            <Route path="ai-generator" element={<AIGenerator />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
