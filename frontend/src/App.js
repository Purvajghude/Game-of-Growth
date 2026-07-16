import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import Studio from "@/pages/Studio";
import Store from "@/pages/Store";
import Contact from "@/pages/Contact";
import Audit from "@/pages/Audit";
import Login from "@/pages/Login";
import RequireAuth from "@/components/RequireAuth";
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
import Proposals from "@/pages/dashboard/Proposals";
import FollowUps from "@/pages/dashboard/FollowUps";
import Prospector from "@/pages/dashboard/Prospector";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/store" element={<Store />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="prospector" element={<Prospector />} />
            <Route path="crm" element={<CRM />} />
            <Route path="followups" element={<FollowUps />} />
            <Route path="proposals" element={<Proposals />} />
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
