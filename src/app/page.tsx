import Footer from "@/components/footer";
import Home from "@/components/home";
import Navigation from "@/components/navigation";
import FAQ from "@/components/faq";
import About from "@/components/about";
import Banner from "@/components/banner";

const page = () => {
  return (
    <div className="flex flex-col w-full bg-hero-gradient">
      <Navigation />
      <Home />
      <Banner />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
};

export default page;
