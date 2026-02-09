import About from "./components/About_Components/About";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import ScrollToTop from "./components/ScrollToTop";

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      <Hero />
      <Philosophy />
      <ScrollToTop />
      <About />
    </div>
  );
};

export default LandingPage;