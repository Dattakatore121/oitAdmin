import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Auth */
import Login from "./components/login/Login";
import Register from "./components/registration/Register";
import Logout from "./components/logout/Logout";

/* Layout */
import AdminLayout from "./components/AdminLayout";

/* Protected Route */
import ProtectedRoutes from "./ProtectedRoutes";

/* Admin Pages */
import Dashboard from "./components/dashboard/Dashboard";
import Blog from "./components/blog/Blog";
import NewBatch from "./components/batch/NewBatch";
import Contact from "./components/contact/Contact";
import About from "./components/about/About";
import Placement from "./components/placement/Placement";
import Career from "./components/career/Career";
import Enquiry from "./components/enquiry/Enquiry";
import Profile from "./components/profile/Profile";
import AddBatch from "./components/batch/AddBatch";
import Applied from "./components/applied/Applied";
import VideoReviews from "./components/reviews/VideoReviews";
import TextReviews from "./components/reviews/TextReviews";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC AUTH ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- LOGOUT ---------- */}
        <Route path="/logout" element={<Logout />} />

        {/* ---------- PROTECTED ADMIN ---------- */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blog" element={<Blog />} />
            <Route path="new-batch" element={<NewBatch />} />
            <Route path="new-batch/add" element={<AddBatch />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="placement" element={<Placement />} />
            <Route path="career" element={<Career />} />
            <Route path="enquiry" element={<Enquiry />} />
            <Route path="profile" element={<Profile />} />
            <Route path="applied" element={<Applied />} />
            <Route path="video-reviews" element={<VideoReviews />} />
            <Route path="text-reviews" element={<TextReviews />} />
           

          </Route>
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
