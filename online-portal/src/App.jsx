import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from './pages/HomePage';
import NavBar from "./components/NavBar";
import StallMap from "./pages/StallMap";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Toaster position="top-center" reverseOrder={false} containerStyle={{
        top: 90,
      }} />
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/stallmap" element={<StallMap />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/*other protected pages */}
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
