import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./styles/App.css";

import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';

import 'draft-js/dist/Draft.css';
import VenueProfile from "./pages/Venues/VenueProfile";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme"; // Import your custom theme
import BandForm from "./pages/Bands/BandForm/BandForm";
import FullBandList from "./pages/Bands/FullBandList";
import BandProfile from "./pages/Bands/BandProfile";
import TCUPPeopleForm from "./pages/TCUPPeopleForm";
import TCUPPeopleTable from "./pages/TCUPPeopleTable";
import TCUPPeopleProfile from "./pages/TCUPPeopleProfile";
import ShowProfile from "./pages/Shows/ShowProfile";
import ShowForm from "./pages/Shows/ShowForm";
import EditShowPage from "./components/EditShowPage";
import Callback from "./components/Callback";
import UserProfile from "./pages/User/UserProfile";
import AuthTest from "./components/AuthTest";
import SessionMusiciansTable from "./pages/SessionMusicians/SessionMusiciansTable";
import SessionMusicianProfile from "./pages/SessionMusicians/SessionMusiciansProfile";
import useApi from "./hooks/useApi.js";
import { useAuth0 } from "@auth0/auth0-react";
import VenueForm from "./pages/Venues/VenueForm";
import CalendarEvents from "./components/CalendarEvents";
import MainChatPage from "./pages/Chat/MainChatPage";
import ViewSingleThread from "./pages/Chat/ViewSingleThread";
import LandingPage from "./pages/LandingPage";
import Privacy from "./pages/Privacy";
import AdminImportPost from "./pages/Chat/Components/OriginalAdminImportPost";
import VRCForm from "./pages/VRC/VRCForm";
import PowerPledgeForm from "./pages/PledgeAndAdvance/PowerPledge";
import ImageDisplayPage from "./pages/ImageDisplayPage";
import FlyeringForm from "./pages/Flyering/FlyeringForm";
import FlyeringTable from "./pages/Flyering/FlyeringTable";
import EditFlyeringForm from "./pages/Flyering/EditFlyeringForm";
import PledgePhotos from "./pages/PledgeAndAdvance/PledgePhotos";
import TCUPAdvance from "./pages/PledgeAndAdvance/TCUPAdvance";
import PledgeSuccess from "./pages/PledgeAndAdvance/PledgeSuccess";
import PledgeTracker from "./pages/PledgeAndAdvance/PledgeTracker";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/layout/Layout";
import AboutTCUP from "./pages/TCUP/AboutTCUP";
import NewUpdate from "./pages/TCUP/Updates/NewUpdate";
import UpdatesPage from "./pages/TCUP/Updates/UpdatesPage";
import SingleUpdatePost from "./pages/TCUP/Updates/SingleUpdatePost";
import UpdateEditForm from "./pages/TCUP/Updates/UpdateEditForm";
import ContactForm from "./pages/Contact/ContactForm";
import ProfileSync from "./pages/User/Components/ProfileSync";
import Resources from "./pages/Resources/Resources";
import ConversationDetail from "./pages/DirectMessages.js/ConversationDetail";
import ConversationList from "./pages/DirectMessages.js/ConversationList";
import WelcomePage from "./pages/Welcome";
import PwaUpdatePage from "./pages/PwaUpdatePage"; // Create this file
import ForumImportTool from "./pages/Chat/ForumImportTool";
import OriginalAdminImportPost from "./pages/Chat/Components/OriginalAdminImportPost";
import HistoricalReplyForm from "./pages/Chat/Components/HistoricalReplyForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ScraperAdminPanel from "./pages/Admin/ScraperAdminPanel";
import VenueReportCardPage from "./pages/VRC/VenueReportCardPage";
import JoinTCUP from "./pages/TCUP/JoinTCUP";
import Newsletter from "./pages/TCUP/Newsletter";
import { MessageProvider } from "./pages/DirectMessages.js/MessageBadge";
import PublicRoute from "./PublicRoute";
import DigitalZine from "./pages/DigitalZine";
import RadioResourcesPage from "./pages/Resources/RadioResources";
import PressResourcesPage from "./pages/Resources/PressResources";
import VenuesTableEmbed from "./pages/Venues/VenuesTableEmbed";
import DigitalZine3 from "./pages/DigitalZine3";
import usePlausiblePageViews from "./hooks/usePlausiblePageViews";

if (process.env.NODE_ENV === "production") {
    console.log = () => {};
}

function App() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const { callApi } = useApi();

  usePlausiblePageViews(); 

  console.log("NODE_ENV:", process.env.NODE_ENV);

  const hasAttemptedRegistration = React.useRef(false);

  useEffect(() => {
    console.log('Auth state changed:', {
      isLoading,
      isAuthenticated,
      user,
      hasAttempted: hasAttemptedRegistration.current
    });

    const registerUser = async () => {
      if (!hasAttemptedRegistration.current && isAuthenticated && user && !isLoading) {
        try {
          console.log('Attempting registration with user:', user);
          hasAttemptedRegistration.current = true;
          const response = await callApi(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST'
          });
          console.log('Registration response:', response);
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    };

    // registerUser();
  }, [isAuthenticated, user, isLoading, callApi]);

  useEffect(() => {
    const checkForPwa = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        // Instead of redirecting, just log that it's a PWA
        console.log('Running as PWA');
        // No redirect happens now
      }
    };
    
    if (isAuthenticated !== undefined) {
      checkForPwa();
    }
  }, [isAuthenticated]);

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return <div>Loading...</div>; // You might want to use a proper loading component here
  }

  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
      <ProfileSync />
      <Routes>
         {/* Public routes outside of any layout */}
         <Route path="/welcome" element={
          isAuthenticated ? <Navigate to="/" /> : <WelcomePage />
        } />
        <Route path="/pwa-update" element={<PwaUpdatePage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Public routes with layout */}
        <Route element={<Layout publicAccess={true} />}>
          <Route path="/" element={<MainChatPage />} />
          <Route path="/shows" element={<MainChatPage />} />
          <Route path="/shows/:id" element={<ShowProfile />} />
          <Route path="/bands" element={<FullBandList />} />
          <Route path="/bands/:bandSlug" element={<BandProfile />} />
          <Route path="/venues" element={<VenuesTableEmbed />} />
          <Route path="/venues/:id" element={<VenueProfile />} />
          <Route path="/about" element={<AboutTCUP />} />
          <Route path="/chat" element={<MainChatPage />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="contact" element={<ContactForm />} />
          <Route path="/venuereportcard" element={<VenueReportCardPage />} />
          <Route path="/join" element={<JoinTCUP />} />
          <Route path="/updates/:id" element={<SingleUpdatePost />} />
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="powerpledge" element={<PowerPledgeForm />} />
          <Route path="advance" element={<TCUPAdvance />} />
          <Route path="resources" element={<Resources />} />
          <Route path="vrc" element={<VRCForm />} />
          <Route path="newsletter" element={<DigitalZine3 />} />
          <Route path="calendar" element={<CalendarEvents />} />
          <Route path="flyering" element={<FlyeringTable />} />
          <Route path="sessionmusicians" element={<SessionMusiciansTable />} />
          <Route path="sessionmusicians/:id" element={<SessionMusicianProfile />} />
          <Route path="zine" element={<DigitalZine3 />} />
          <Route path="radio" element={<RadioResourcesPage />} />
          <Route path="press" element={<PressResourcesPage />} />




          {/* Add other routes you want to be public */}
        </Route>

        

      {/* Protected routes that require authentication */}
        <Route element={<Layout publicAccess={false} />}>
          {/* Admin*/}
          <Route path="admin" element={<AdminDashboard />} />          
          <Route path="/admin/updates" element={<NewUpdate />} />
          <Route path="/admin/scrapers" element={<ScraperAdminPanel />} />
          <Route path="/admin/import" element={<OriginalAdminImportPost />} />
          <Route path="updates/edit/:id" element={<UpdateEditForm />} />   
          {/* Resources */}

          <Route path="pledgesuccess" element={<PledgeSuccess />} />
          <Route path="pledgetracker" element={<PledgeTracker />} />          
          <Route path="shows/add" element={<ShowForm />} />
          <Route path="shows/:id/edit" element={<EditShowPage />} />

  
          {/* Forum/Thread */}
          <Route path="chat/:threadId" element={<ViewSingleThread />} />
          <Route path="import" element={<AdminImportPost />} />
          <Route path="test-auth" element={<AuthTest />} />

          <Route path="pledgephotos" element={<PledgePhotos />} />
  
          {/* Flyering */}
          <Route path="flyering/add" element={<FlyeringForm />} />
          <Route path="flyering/edit/:id" element={<EditFlyeringForm />} />
  
          {/* Bands */}
          <Route path="bands/add" element={<BandForm isEdit={false} />} />

          <Route path="bands/form/:draftId" element={<BandForm isDraft={true} />} />
          <Route path="bands/:bandSlug" element={<BandProfile />} />

          <Route path="bands/:bandid/edit" element={<BandForm isEdit />} />
  
          {/* Venues */}
          <Route path="venues/add" element={<VenueForm />} />
          <Route path="venues/edit/:id" element={<VenueForm />} />
  
          {/* Other routes */}
          <Route path="interviewtest" element={<ImageDisplayPage />} />
          <Route path="people/add" element={<TCUPPeopleForm />} />
          <Route path="people/:personId/edit" element={<TCUPPeopleForm isEdit />} />
          <Route path="people/:personID" element={<TCUPPeopleProfile />} />
          <Route path="people" element={<TCUPPeopleTable />} />

          {/* User */}
          <Route path="/profile/:userId" element={<UserProfile />} />

          {/* Direct Messages */}
          <Route path="/messages" element={<ConversationList />} />
          <Route path="/messages/:conversationId" element={<ConversationDetail />} />
  
        </Route>
  
    
          {/* Catch-all for unmatched paths */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "20px" }}>
                Page Not Found
              </div>
            }
          />
      </Routes>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default App;