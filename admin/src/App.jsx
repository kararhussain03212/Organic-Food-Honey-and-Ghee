import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProductList from "./pages/product/ProductList";
import ProductForm from "./pages/product/ProductForm";
import SliderList from "./pages/slider/SliderList";
import SliderForm from "./pages/slider/SliderForm";
import SiteSettings from "./pages/settings/SiteSettings";
import TestimonialList from "./pages/testimonial/TestimonialList";
import TestimonialForm from "./pages/testimonial/TestimonialForm";
import BlogList from "./pages/blog/BlogList";
import BlogForm from "./pages/blog/BlogForm";
import UserManagement from "./pages/users/UserManagement";
import ContactMessages from "./pages/contact/ContactMessages";
import { useAuth } from "./context/useAuth";
import { normalizeUserRole } from "./modules/users/constants";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function AdminOnlyPage({ children }) {
  const { user } = useAuth();
  const isAdmin = normalizeUserRole(user?.role) === "admin";

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

export default function App() {
  const basename =
    typeof window !== "undefined"
      ? (() => {
          const { pathname } = window.location;
          const adminIndex = pathname.indexOf("/admin");
          if (adminIndex === -1) return undefined;
          return pathname.slice(0, adminIndex + "/admin".length);
        })()
      : undefined;

  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedPage>
                <ProductList />
              </ProtectedPage>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedPage>
                <ProductForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedPage>
                <ProductForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/sliders"
            element={
              <ProtectedPage>
                <SliderList />
              </ProtectedPage>
            }
          />
          <Route
            path="/sliders/new"
            element={
              <ProtectedPage>
                <SliderForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/sliders/edit/:id"
            element={
              <ProtectedPage>
                <SliderForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/testimonials"
            element={
              <ProtectedPage>
                <TestimonialList />
              </ProtectedPage>
            }
          />
          <Route
            path="/testimonials/new"
            element={
              <ProtectedPage>
                <TestimonialForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/testimonials/edit/:id"
            element={
              <ProtectedPage>
                <TestimonialForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedPage>
                <BlogList />
              </ProtectedPage>
            }
          />
          <Route
            path="/blogs/new"
            element={
              <ProtectedPage>
                <BlogForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/blogs/edit/:id"
            element={
              <ProtectedPage>
                <BlogForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedPage>
                <Navigate to="/settings/navbar" replace />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/navbar"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="navbar" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-about"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="about" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-company"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="company" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-offer"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="offer" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-testimonials"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="testimonials" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-newsletter"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="newsletter" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-video"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="video" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/home-blog"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="home" forcedHomeSection="blog" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/footer"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="footer" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/product"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="product" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/contact"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="contact" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/blog"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="blog" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="hero" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about-hero"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="hero" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about-info"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="info" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about-company"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="company" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about-category"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="category" />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings/about-process"
            element={
              <ProtectedPage>
                <SiteSettings forcedMainSection="about" forcedAboutSection="process" />
              </ProtectedPage>
            }
          />
          <Route
            path="/contact-messages"
            element={
              <ProtectedPage>
                <ContactMessages />
              </ProtectedPage>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedPage>
                <AdminOnlyPage>
                  <UserManagement />
                </AdminOnlyPage>
              </ProtectedPage>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
