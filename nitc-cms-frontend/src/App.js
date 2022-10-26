import "bootstrap/dist/css/bootstrap.min.css";
import { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import BootstrapNavbar from "./components/Navbar";
import StudentEvents from "./components/StudentEvents";
import ClubAdminPanel from "./components/ClubAdminPanel";
import ClubDetailsPanel from "./components/ClubDetailsPanel";
import SysAdminPanel from "./components/SysAdminPanel";
import SysAdminMakeClub from "./components/SysClubPanel";
import SysAdminMakeVenue from "./components/SysVenuePanel";
import HomePage from "./components/HomePage";
import ClubEventPanel from "./components/ClubEventPanel";
import StudentDetails from "./components/StudentDetails";
import Events from "./components/Events";

export const AppContext = createContext();

function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  return (
    <AppContext.Provider value={{ userToken, setUserToken, userType, setUserType }}>
      <Router>
        <BootstrapNavbar />
        <Routes>
          {/* for unauthenticated users. contains all common data*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/clubs/:clubname" element={<ClubDetailsPanel />} />
          {/* see all events + registered events as student */}
          <Route path="/events" element={<Events />} />
          <Route path="/student" element={<StudentDetails />} />
          <Route path="/student/events" element={<StudentEvents />} />
          {/* club admin page */}
          <Route path="/clubadmin" element={<ClubAdminPanel />} />
          {/* club admin see data for an event */}
          <Route path="/clubadmin/:eventId" element={<ClubEventPanel />} />
          {/* sys admin page */}
          <Route path="/admin" element={<SysAdminPanel />} />
          <Route path="/admin/createclub" element={<SysAdminMakeClub />} />
          <Route path="/admin/createvenue" element={<SysAdminMakeVenue />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
