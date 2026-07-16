import { SEOHelmet } from "../seo/SEOHelmet";
import { getSEOData } from "../seo/seoData";
import CircleSlider from "../components/CircleSlider";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const Home = () => {
  const seo = getSEOData("home");
  return (
    <>
      <SEOHelmet
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />
      <CircleSlider />
      <PurityPromise />
      <OurStory />
      <Products />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
