import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState , useEffect} from "react";
import "./App.css";

import Login from "./pages/auth/login";
import Layout from "./navbar/Layout";
import PrivateRoute from "./pages/auth/PrivateRoute";

// Providers
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";

// Pages
import AdminDashboard from "./AdminDashboard/dashboard";
import Leads from "./pages/Leads/Leads";
import CreateLeads from "./pages/Leads/CreateLeads";
import { AllDeals } from "./pages/Deals/allDeals";
import CreateDeal from "./pages/Deals/CreateDeal";
import Pipeline_view from "./pages/Pipeline_View/Pipelien_view";
import Pipeline_modal_view from "./pages/Pipeline_View/Pipeline_modal_view";
import ProposalHead from "./pages/proposal/ProposalHead";
import SendProposal from "./pages/proposal/SendProposal";
import DraftsPage from "./pages/proposal/DraftsPage";
import InvoiceHead from "./pages/invoice/InvoiceHead";
import InvoiceView from "./pages/invoice/InvoiceView";
import CalendarView from "./pages/activities/CalendarView";
import Activity from "./pages/activityList/Activity";
import UserManagement from "./pages/useroles/UserManagement";
import ReportsPage from "./pages/reports/ReportsPage";
import EmailChat from "./pages/Email_chat/EmailChat";
import MassEmail from "./pages/Email/MassEmail";
import CreateEmail from "./pages/Email/CreateEmail";
import ScheduledEmails from "./pages/Email/ScheduledEmails";
import EmailHistory from "./pages/Email/EmailHistory";
import Settings from "./pages/settings/Settings";
import NotificationsPage from "./pages/notification/NotificationsPage";
import ViewLead from "./pages/Leads/ViewLead";
import ViewProposal from "./pages/proposal/ViewProposal";

import DealIntelligenceDashboard from "./pages/Dealmetrics/pipeline";
import LostDealAnalytics from "./pages/LostDealModal/Lostdealreason";
import CLVDashboard from "./pages/Clv/CLVDashboard";
import ClientCLVDetails from "./pages/Clv/ClientCLVDetails";
import AllStreakLeaderboard from "./pages/streak/AllStreakLeaderboard";

import WebsiteContactForm from "./pages/website/WebsiteContactForm";
import ResetPassword from "./pages/password/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("token")) {
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <SocketProvider userId={user?._id}>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen">

            <Routes>

              {/* PUBLIC */}
              <Route path="/" element={<Login />} />
              <Route path="/contact" element={<WebsiteContactForm />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* PROTECTED */}
              <Route element={<PrivateRoute />}>
                <Route element={<Layout isModalOpen={isModalOpen} />}>

                  {/*  COMMON ROUTES (NO PERMISSION) */}
                  <Route path="/DealAnalysis" element={<DealIntelligenceDashboard />} />
                  <Route path="/LossAnalysis" element={<LostDealAnalytics />} />
                  <Route path="/cltv/dashboard" element={<CLVDashboard />} />
                  <Route path="/cltv/client/:companyName" element={<ClientCLVDetails />} />
                  <Route path="/leaderboard" element={<AllStreakLeaderboard />} />
                  <Route path="/dashboard/notifications" element={<NotificationsPage />} />

                  {/* Optional: make email global */}
                  <Route path="/mass-email" element={<MassEmail />} />
                  <Route path="/create-email" element={<CreateEmail />} />
                  <Route path="/create-email/:id" element={<CreateEmail />} />
                  <Route path="/scheduled-emails" element={<ScheduledEmails />} />
                  <Route path="/email-history" element={<EmailHistory />} />

                  {/*  PERMISSION ROUTES */}

                  <Route element={<PrivateRoute permission="dashboard" />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                  </Route>

                  {/* VIEW LEADS (Sales + Admin) */}
<Route element={<PrivateRoute permission="leads" />}>
  <Route path="/leads" element={<Leads />} />
  <Route path="/leads/view/:id" element={<ViewLead />} />
</Route>

{/* CREATE LEAD (Admin only) */}
<Route element={<PrivateRoute permission="create_lead" />}>
  <Route path="/createleads" element={<CreateLeads />} />
</Route>

                  {/* VIEW DEALS */}
<Route element={<PrivateRoute permission="deals_all" />}>
  <Route path="/deals" element={<AllDeals />} />
</Route>

{/* CREATE DEAL (Admin only) */}
<Route element={<PrivateRoute permission="create_deal" />}>
  <Route path="/createDeal" element={<CreateDeal />} />
  <Route path="/createDeal/:id" element={<CreateDeal />} />
</Route>

                  <Route element={<PrivateRoute permission="deals_pipeline" />}>
                    <Route path="/Pipelineview" element={<Pipeline_view />} />
                    <Route path="/Pipelineview/:dealId?" element={<Pipeline_modal_view />} />
                  </Route>

                  <Route element={<PrivateRoute permission="proposal" />}>
                    <Route path="/proposal" element={<ProposalHead />} />
                    <Route path="/proposal/sendproposal" element={<SendProposal />} />
                    <Route path="/proposal/drafts" element={<DraftsPage />} />
                    <Route path="/proposal/view/:id" element={<ViewProposal />} />
                  </Route>

                  <Route element={<PrivateRoute permission="invoices" />}>
                    <Route path="/invoices" element={<InvoiceHead />} />
                    <Route path="/invoices/:id" element={<InvoiceView />} />
                  </Route>

                  <Route element={<PrivateRoute permission="activities_calendar" />}>
                    <Route path="/calendar" element={<CalendarView />} />
                  </Route>

                  <Route element={<PrivateRoute permission="activities_list" />}>
                    <Route path="/list" element={<Activity />} />
                  </Route>

                  <Route element={<PrivateRoute permission="users_roles" />}>
                    <Route path="/user&roles" element={<UserManagement />} />
                  </Route>

                  <Route element={<PrivateRoute permission="reports" />}>
                    <Route path="/team-analytics" element={<ReportsPage />} />
                  </Route>

                  <Route element={<PrivateRoute permission="email_chat" />}>
                    <Route path="/emailchat" element={<EmailChat />} />
                  </Route>

                  <Route element={<PrivateRoute permission="settings" />}>
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                </Route>
              </Route>

            </Routes>

            <ToastContainer />
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;