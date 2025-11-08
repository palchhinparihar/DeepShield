import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Particles from "./components/common/Particles";
import Footer from "./components/common/Footer";

import Home from "./components/main/Home";
import About from "./components/main/About";
import FAQ from "./components/main/FAQ";
import PrivacyPolicy from "./components/main/PrivacyPolicy";
import UploadVideo from "./components/main/UploadVideo";

const App = () => {
  return (
    <Router>
      <Navbar />

      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
