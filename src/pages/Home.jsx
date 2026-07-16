import { Helmet } from "react-helmet-async";
import CircleSlider from "../components/CircleSlider";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Arion Organic Foods | Premium Honey, Ghee & Shilajit</title>
        <meta name="description" content="Discover pure, organic, A2 Cow Ghee, Wild Sidr Honey, and premium Himalayan Shilajit sourced directly from pristine valleys. Order online for nationwide delivery." />
      </Helmet>
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
