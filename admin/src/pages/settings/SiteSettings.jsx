import { useCallback, useEffect, useMemo, useState } from "react";
import { uploadImage } from "../../api/uploadApi";
import { getSettings, updateSettings } from "../../api/settingApi";
import NavbarSettingsSection from "./sections/NavbarSettingsSection";
import HomeAboutSettingsSection from "./sections/HomeAboutSettingsSection";
import HomeCompanySettingsSection from "./sections/HomeCompanySettingsSection";
import HomeOfferSettingsSection from "./sections/HomeOfferSettingsSection";
import HomeCommitmentSettingsSection from "./sections/HomeCommitmentSettingsSection";
import HomeTestimonialsSettingsSection from "./sections/HomeTestimonialsSettingsSection";
import HomeAuthenticSettingsSection from "./sections/HomeAuthenticSettingsSection";
import HomeBlogSettingsSection from "./sections/HomeBlogSettingsSection";
import FooterSettingsSection from "./sections/FooterSettingsSection";
import ProductSettingsSection from "./sections/ProductSettingsSection";
import ContactSettingsSection from "./sections/ContactSettingsSection";
import AboutSettingsSection from "./sections/AboutSettingsSection";
import BlogSettingsSection from "./sections/BlogSettingsSection";
import FieldRows from "./sections/FieldRows";
import { getBackendRoot } from "../../api/runtimeApi";

const homeSectionTabs = [
  { key: "about",        label: "Our Story"    },
  { key: "company",      label: "Collection"   },
  { key: "commitment",   label: "Commitment"   },
  { key: "testimonials", label: "Testimonials" },
  { key: "authentic",    label: "Authentic"    },
  // { key: "blog",         label: "Blog"         },
];

const textFieldConfig = [
  { key: "navbar_brand_title", section: "navbar" },
  { key: "navbar_brand_subtitle", section: "navbar" },
  { key: "navbar_phone", section: "navbar" },
  { key: "navbar_email", section: "navbar" },
  { key: "navbar_welcome_text", section: "navbar" },
  { key: "nav_cart_icon", section: "navbar" },
  { key: "nav_logo", section: "navbar" },
  { key: "nav_logo_alt", section: "navbar" },
  { key: "home_about_kicker", section: "home.about" },
  { key: "home_about_title", section: "home.about" },
  { key: "home_about_description", section: "home.about" },
  { key: "home_about_button_text", section: "home.about" },
  { key: "home_about_button_link", section: "home.about" },
  { key: "home_about_image", section: "home.about" },
  { key: "home_about_properties_title", section: "home.about" },
  // { key: "home_company_kicker", section: "home.company" },
  // { key: "home_company_title", section: "home.company" },
  // { key: "home_company_accent", section: "home.company" },
  // { key: "home_company_suffix", section: "home.company" },
  // { key: "home_company_text", section: "home.company" },
  // { key: "home_company_button_text", section: "home.company" },
  // { key: "home_company_button_link", section: "home.company" },
  // { key: "home_company_image", section: "home.company" },
  // { key: "home_products_title", section: "home.company" },
  // { key: "home_products_description", section: "home.company" },
  { key: "home_offer_title", section: "home.offer" },
  { key: "home_offer_accent", section: "home.offer" },
  { key: "home_offer_description", section: "home.offer" },
  { key: "home_offer_button_text", section: "home.offer" },
  { key: "home_offer_button_link", section: "home.offer" },
  { key: "home_offer_image", section: "home.offer" },
  // { key: "home_testimonials_title", section: "home.testimonials" },
  // { key: "home_testimonials_description", section: "home.testimonials" },
  { key: "home_newsletter_title", section: "home.newsletter" },
  { key: "home_newsletter_description", section: "home.newsletter" },
  { key: "home_newsletter_button_text", section: "home.newsletter" },
  { key: "home_newsletter_placeholder", section: "home.newsletter" },
  { key: "home_newsletter_success", section: "home.newsletter" },
  { key: "home_newsletter_error", section: "home.newsletter" },
  { key: "home_video_title", section: "home.video" },
  { key: "home_video_description", section: "home.video" },
  { key: "home_video_url", section: "home.video" },
  { key: "home_blog_kicker", section: "home.blog" },
  { key: "home_blog_title", section: "home.blog" },
  { key: "home_blog_description", section: "home.blog" },
  { key: "home_blog_button_text", section: "home.blog" },
  { key: "nav_cart_alt", section: "navbar" },
  { key: "footer_logo", section: "footer" },
  { key: "footer_logo_alt", section: "footer" },
  { key: "product_page_hero_image", section: "product" },
  { key: "product_page_title", section: "product" },
  { key: "product_page_breadcrumb_home", section: "product" },
  { key: "product_page_breadcrumb_current", section: "product" },
  { key: "product_showcase_kicker", section: "product" },
  { key: "product_showcase_title", section: "product" },
  { key: "product_showcase_text", section: "product" },
  { key: "product_catalog_title", section: "product" },
  { key: "product_catalog_title_highlight", section: "product" },
  { key: "product_catalog_description", section: "product" },
  { key: "product_video_title", section: "product" },
  { key: "product_video_description", section: "product" },
  { key: "product_video_url", section: "product" },
  // Contact & WhatsApp (Arion)
  { key: "contact_email",             section: "contact" },
  { key: "contact_phone",             section: "contact" },
  { key: "contact_whatsapp",          section: "contact" },
  { key: "contact_address",           section: "contact" },
  { key: "contact_facebook",          section: "contact" },
  { key: "contact_instagram",         section: "contact" },
  { key: "contact_youtube",           section: "contact" },
  { key: "contact_tiktok",            section: "contact" },
  { key: "contact_availability_text", section: "contact" },
  { key: "whatsapp_number",           section: "contact" },
  // About page (Arion)
  { key: "about_hero_title",          section: "about" },
  { key: "about_hero_subtitle",       section: "about" },
  { key: "about_hero_quote",          section: "about" },
  { key: "about_hero_image",          section: "about" },
  { key: "about_story_headline",      section: "about" },
  { key: "about_story_paragraphs",    section: "about" },
  { key: "about_story_keywords",      section: "about" },
  { key: "about_timeline",            section: "about" },
  { key: "about_mission",             section: "about" },
  { key: "about_traditional",         section: "about" },
  { key: "about_modern",              section: "about" },
  // Home — Our Story (About Us)
  { key: "home_story_eyebrow",        section: "home.about" },
  { key: "home_story_heading",        section: "home.about" },
  { key: "home_story_heading_accent", section: "home.about" },
  { key: "home_story_text",           section: "home.about" },
  { key: "home_story_image",          section: "home.about" },
  { key: "home_story_bullets",        section: "home.about" },
  { key: "home_story_btn_text",       section: "home.about" },
  { key: "home_story_btn_link",       section: "home.about" },
  // Home — Our Collection (products section heading)
  { key: "home_collection_eyebrow",          section: "home.company" },
  { key: "home_collection_heading",          section: "home.company" },
  { key: "home_collection_heading_accent",   section: "home.company" },
  { key: "home_collection_subtext",          section: "home.company" },
  { key: "home_collection_btn_text",         section: "home.company" },
  { key: "home_collection_btn_link",         section: "home.company" },

  // Home — Commitment section heading
  { key: "home_commitment_eyebrow",         section: "home.commitment" },
  { key: "home_commitment_heading",         section: "home.commitment" },
  { key: "home_commitment_heading_accent",  section: "home.commitment" },
  { key: "home_commitment_subtext",         section: "home.commitment" },
  // Home — Testimonials / Customer Stories heading
  { key: "home_testimonials_eyebrow",          section: "home.testimonials" },
  { key: "home_testimonials_heading",          section: "home.testimonials" },
  { key: "home_testimonials_heading_accent",   section: "home.testimonials" },
  { key: "home_testimonials_subtext",          section: "home.testimonials" },
  // Home — Authentic / CTA section
  { key: "home_cta_eyebrow",        section: "home.authentic" },
  { key: "home_cta_heading",        section: "home.authentic" },
  { key: "home_cta_heading_accent", section: "home.authentic" },
  { key: "home_cta_subtext",        section: "home.authentic" },
  { key: "home_cta_btn_text",       section: "home.authentic" },
  { key: "home_cta_btn_link",       section: "home.authentic" },
  { key: "home_cta_btn2_text",      section: "home.authentic" },
  { key: "home_cta_btn2_link",      section: "home.authentic" },
  { key: "home_cta_badge_text",     section: "home.authentic" },
  // Navbar/Footer (Arion)
  { key: "navbar_logo",               section: "navbar" },
  { key: "footer_brand_title",        section: "footer" },
  { key: "footer_brand_subtitle",     section: "footer" },
  { key: "footer_about_text",         section: "footer" },
  { key: "footer_phone",              section: "footer" },
  { key: "footer_email",              section: "footer" },
  { key: "footer_address",            section: "footer" },
  { key: "footer_social_facebook",    section: "footer" },
  { key: "footer_social_instagram",   section: "footer" },
  { key: "footer_social_youtube",     section: "footer" },
  { key: "footer_social_tiktok",      section: "footer" },
  { key: "footer_copyright",          section: "footer" },
  { key: "footer_timings_heading",    section: "footer" },
  { key: "footer_timings_days",       section: "footer" },
  { key: "footer_timings_time",       section: "footer" },
  { key: "blog_page_hero_image", section: "blog" },
  { key: "blog_page_title", section: "blog" },
  { key: "blog_page_breadcrumb_home", section: "blog" },
  { key: "blog_page_breadcrumb_current", section: "blog" },
  // Blog page hero
  { key: "blog_badge_text",          section: "blog" },
  { key: "blog_hero_title",          section: "blog" },
  { key: "blog_hero_title_accent",   section: "blog" },
  { key: "blog_hero_description",    section: "blog" },
  { key: "blog_search_placeholder",  section: "blog" },
  { key: "seo_home_meta_description", section: "home.seo" },
  { key: "seo_about_meta_description", section: "about.seo" },
  { key: "seo_product_meta_description", section: "product.seo" },
  { key: "seo_blog_meta_description", section: "blog.seo" },
  { key: "seo_contact_meta_description", section: "contact.seo" },
  { key: "seo_order_meta_description", section: "contact.seo" },
];

const imageSettingKeys = new Set([
  "nav_logo",
  "nav_cart_icon",
  "footer_logo",
  "product_page_hero_image",
  "contact_page_hero_image",
  "home_about_image",
  "home_story_image",
  "home_company_image",
  "home_offer_image",
  "about_page_hero_image",
  "about_page_info_image",
  "about_page_company_image",
  "about_page_category_image",
  "blog_page_hero_image",
]);

const createEmptyTextForm = () =>
  textFieldConfig.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});

const parseJsonArray = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const decodeHtmlEntities = (value) =>
  String(value ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");

const toLabel = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const defaultSectionStatus = {
  navbar: "active",
  home_about: "active",
  home_company: "active",
  home_commitment: "active",
  home_offer: "active",
  home_testimonials: "active",
  home_authentic: "active",
  home_blog: "active",
  footer: "active",
  product: "active",
  contact: "active",
  about: "active",
  blog: "active",
};

export default function SiteSettings({ forcedMainSection = "", forcedHomeSection = "", forcedAboutSection = "" }) {
  const [activeMainSection, setActiveMainSection] = useState(forcedMainSection || "navbar");
  const [activeHomeSection, setActiveHomeSection] = useState(forcedHomeSection || "about");
  const [activeAboutSection, setActiveAboutSection] = useState(forcedAboutSection || "hero");
  const [form, setForm] = useState(createEmptyTextForm);
  const [navLinks, setNavLinks] = useState([{ label: "", path: "" }]);
  const [aboutProperties, setAboutProperties] = useState([""]);
  const [gheeCards, setGheeCards] = useState([{ icon: "cow", icon_url: "", title: "", description: "" }]);
  const [footerLinks, setFooterLinks] = useState([{ label: "", path: "" }]);
  const [footerQuickLinks, setFooterQuickLinks] = useState([{ label: "", path: "" }]);
  const [footerSocialLinks, setFooterSocialLinks] = useState([{ label: "", url: "", icon: "facebook" }]);
  const [aboutPageProperties, setAboutPageProperties] = useState([""]);
  const [aboutPageCategories, setAboutPageCategories] = useState([
    { icon: "", icon_url: "", title: "", description: "" },
  ]);
  const [aboutPageProcessCards, setAboutPageProcessCards] = useState([
    { icon_url: "", title: "", description: "" },
  ]);
  const [storyBullets, setStoryBullets] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [loadedOk, setLoadedOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sectionStatus, setSectionStatus] = useState(defaultSectionStatus);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const fieldSectionMap = useMemo(
    () => textFieldConfig.reduce((acc, field) => ({ ...acc, [field.key]: field.section }), {}),
    [],
  );

  const headerTitle = useMemo(() => {
    if (activeMainSection === "home") {
      if (activeHomeSection === "about")       return "Home - Our Story Settings";
      if (activeHomeSection === "company")     return "Home - Collection Settings";
      if (activeHomeSection === "commitment")  return "Home - Commitment Settings";
      if (activeHomeSection === "offer")       return "Home - Purity Promise Settings";
      if (activeHomeSection === "testimonials") return "Home - Testimonials Settings";
      if (activeHomeSection === "authentic")   return "Home - Authentic / CTA Settings";
      if (activeHomeSection === "blog")        return "Home - Blog Settings";
    }
    if (activeMainSection === "navbar") return "Navbar Settings";
    if (activeMainSection === "footer") return "Footer Settings";
    if (activeMainSection === "product") return "Product Page Settings";
    if (activeMainSection === "contact") return "Contact & WhatsApp Settings";
    if (activeMainSection === "blog") return "Blog Page Settings";
    if (activeMainSection === "about") {
      if (activeAboutSection === "hero")     return "About - Hero Settings";
      if (activeAboutSection === "info")     return "About - Story Settings";
      if (activeAboutSection === "company")  return "About - Timeline Settings";
      if (activeAboutSection === "category") return "About - Mission Settings";
      if (activeAboutSection === "process")  return "About - Duality Settings";
      return "About Page Settings";
    }
    return "Site Settings";
  }, [activeAboutSection, activeHomeSection, activeMainSection]);

  const currentStatusKey = useMemo(() => {
    if (activeMainSection === "home") return `home_${activeHomeSection}`;
    if (["navbar", "footer", "product", "contact", "about", "blog"].includes(activeMainSection)) return activeMainSection;
    return "navbar";
  }, [activeHomeSection, activeMainSection]);

  const toImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return apiRoot + value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    if (forcedMainSection) setActiveMainSection(forcedMainSection);
    if (forcedHomeSection) setActiveHomeSection(forcedHomeSection);
    if (forcedAboutSection) setActiveAboutSection(forcedAboutSection);
  }, [forcedAboutSection, forcedHomeSection, forcedMainSection]);

  useEffect(() => {
    if (success) setSuccess("");
  }, [activeMainSection, activeHomeSection, activeAboutSection]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getSettings();
        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (!rows.length) {
          // Never leave the form blank over live data: saving an unloaded form
          // would overwrite every setting in the database with empty strings.
          setLoadedOk(false);
          setError("Settings could not be loaded from the backend. Saving is disabled to prevent wiping existing data — reload the page and try again.");
          return;
        }

        const next = createEmptyTextForm();
        let nextNavLinks = [{ label: "", path: "" }];
        let nextAboutProperties = [""];
        let nextGheeCards = [{ icon: "cow", icon_url: "", title: "", description: "" }];
        let nextFooterLinks = [{ label: "", path: "" }];
        let nextFooterQuickLinks = [{ label: "", path: "" }];
        let nextFooterSocialLinks = [{ label: "", url: "", icon: "facebook" }];
        let nextAboutPageProperties = [""];
        let nextAboutPageCategories = [{ icon: "", icon_url: "", title: "", description: "" }];
        let nextAboutPageProcessCards = [{ icon_url: "", title: "", description: "" }];
        let nextStoryBullets = [""];
        const nextSectionStatus = { ...defaultSectionStatus };

        // PHP's BaseModel::normalizeUploadColumns auto-decodes JSON arrays/objects,
        // so setting_value may arrive as an array instead of a string.
        const asArray = (val, fallback = []) => {
          if (Array.isArray(val)) return val;
          return parseJsonArray(String(val ?? ""), fallback);
        };

        rows.forEach((row) => {
          const key = String(row?.setting_key || "").trim();
          if (!key) return;

          const sv = row?.setting_value;
          // Only call decodeHtmlEntities when the value is still a plain string.
          const rawValue = typeof sv === "object" && sv !== null ? sv : decodeHtmlEntities(sv ?? "");

          if (key.startsWith("section_status_")) {
            const statusKey = key.replace("section_status_", "");
            nextSectionStatus[statusKey] = ["inactive", "unactive"].includes(String(rawValue).toLowerCase()) ? "inactive" : "active";
            return;
          }

          if (key === "nav_links") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({ label: String(item?.label || ""), path: String(item?.path || "") }))
              .filter((item) => item.label || item.path);
            if (normalized.length) nextNavLinks = normalized;
            return;
          }

          if (key === "home_about_properties") {
            const parsed = asArray(rawValue);
            const normalized = parsed.map((item) => String(item || "")).filter(Boolean);
            if (normalized.length) nextAboutProperties = normalized;
            return;
          }

          if (key === "home_ghee_cards") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({
                icon: String(item?.icon || "cow"),
                icon_url: String(item?.icon_url || ""),
                title: String(item?.title || ""),
                description: String(item?.description || ""),
              }))
              .filter((item) => item.title || item.description || item.icon_url);
            if (normalized.length) nextGheeCards = normalized;
            return;
          }

          if (key === "footer_links") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({ label: String(item?.label || ""), path: String(item?.path || "") }))
              .filter((item) => item.label || item.path);
            if (normalized.length) nextFooterLinks = normalized;
            return;
          }

          if (key === "footer_quick_links") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({ label: String(item?.label || ""), path: String(item?.path || "") }))
              .filter((item) => item.label || item.path);
            if (normalized.length) nextFooterQuickLinks = normalized;
            return;
          }

          if (key === "footer_social_links") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({
                label: String(item?.label || ""),
                url: String(item?.url || ""),
                icon: String(item?.icon || "facebook"),
              }))
              .filter((item) => item.label || item.url);
            if (normalized.length) nextFooterSocialLinks = normalized;
            return;
          }

          // Migrate old individual social settings to new format
          if (key === "footer_social_facebook") {
            if (!nextFooterSocialLinks.some(l => l.label === "facebook") && rawValue) {
              nextFooterSocialLinks.push({
                label: "facebook",
                url: String(rawValue),
                icon: "facebook",
              });
            }
            return;
          }
          if (key === "footer_social_instagram") {
            if (!nextFooterSocialLinks.some(l => l.label === "instagram") && rawValue) {
              nextFooterSocialLinks.push({
                label: "instagram",
                url: String(rawValue),
                icon: "instagram",
              });
            }
            return;
          }
          if (key === "footer_social_youtube") {
            if (!nextFooterSocialLinks.some(l => l.label === "youtube") && rawValue) {
              nextFooterSocialLinks.push({
                label: "youtube",
                url: String(rawValue),
                icon: "youtube",
              });
            }
            return;
          }
          if (key === "footer_social_tiktok") {
            if (!nextFooterSocialLinks.some(l => l.label === "tiktok") && rawValue) {
              nextFooterSocialLinks.push({
                label: "tiktok",
                url: String(rawValue),
                icon: "tiktok",
              });
            }
            return;
          }

          if (key === "about_page_properties") {
            const parsed = asArray(rawValue);
            const normalized = parsed.map((item) => String(item || "")).filter(Boolean);
            if (normalized.length) nextAboutPageProperties = normalized;
            return;
          }

          if (key === "about_page_categories") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({
                icon: String(item?.icon || ""),
                icon_url: String(item?.icon_url || ""),
                title: String(item?.title || ""),
                description: String(item?.description || ""),
              }))
              .filter((item) => item.title || item.description || item.icon_url || item.icon);
            if (normalized.length) nextAboutPageCategories = normalized;
            return;
          }

          if (key === "about_page_process_cards") {
            const parsed = asArray(rawValue);
            const normalized = parsed
              .map((item) => ({
                icon_url: String(item?.icon_url || ""),
                title: String(item?.title || ""),
                description: String(item?.description || ""),
              }))
              .filter((item) => item.title || item.description || item.icon_url);
            if (normalized.length) nextAboutPageProcessCards = normalized;
            return;
          }

          if (key === "home_story_bullets") {
            const parsed = asArray(rawValue);
            const normalized = parsed.map((item) => String(item || "")).filter(Boolean);
            if (normalized.length) nextStoryBullets = normalized;
            return;
          }

          // JSON-typed settings arrive auto-decoded as arrays/objects; re-serialize
          // them for text inputs instead of blanking them (blank would get saved back).
          if (Object.prototype.hasOwnProperty.call(next, key)) {
            next[key] = typeof rawValue === "object" && rawValue !== null ? JSON.stringify(rawValue) : String(rawValue);
          }
        });

        setForm(next);
        setNavLinks(nextNavLinks);
        setAboutProperties(nextAboutProperties);
        setGheeCards(nextGheeCards);
        setFooterLinks(nextFooterLinks);
        setFooterQuickLinks(nextFooterQuickLinks);
        setFooterSocialLinks(nextFooterSocialLinks);
        setAboutPageProperties(nextAboutPageProperties);
        setAboutPageCategories(nextAboutPageCategories);
        setAboutPageProcessCards(nextAboutPageProcessCards);
        setStoryBullets(nextStoryBullets);
        setSectionStatus(nextSectionStatus);
        setLoadedOk(true);
      } catch (err) {
        console.error(err);
        setLoadedOk(false);
        setError("Failed to load settings from backend. Saving is disabled to prevent wiping existing data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const uploadToSetting = async (settingKey, file, folder = "settings") => {
    try {
      setUploading(true);
      const oldPath = String(form[settingKey] || "");
      const path = await uploadImage(file, folder, oldPath);
      if (path) setField(settingKey, path);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const uploadCardIcon = async (index, file) => {
    try {
      setUploading(true);
      const oldPath = String(gheeCards[index]?.icon_url || "");
      const path = await uploadImage(file, "icons", oldPath);
      if (!path) return;
      setGheeCards((prev) =>
        prev.map((item, i) => (i === index ? { ...item, icon_url: path } : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Icon upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const uploadAboutCategoryIcon = async (index, file) => {
    try {
      setUploading(true);
      const oldPath = String(aboutPageCategories[index]?.icon_url || "");
      const path = await uploadImage(file, "icons", oldPath);
      if (!path) return;
      setAboutPageCategories((prev) =>
        prev.map((item, i) => (i === index ? { ...item, icon_url: path } : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Icon upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const uploadAboutProcessIcon = async (index, file) => {
    try {
      setUploading(true);
      const oldPath = String(aboutPageProcessCards[index]?.icon_url || "");
      const path = await uploadImage(file, "icons", oldPath);
      if (!path) return;
      setAboutPageProcessCards((prev) =>
        prev.map((item, i) => (i === index ? { ...item, icon_url: path } : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Icon upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!loadedOk) {
      setError("Settings were not loaded successfully, so saving is disabled to prevent wiping existing data. Reload the page and try again.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        payload[key] = String(form[key] ?? "");
      });

      payload.nav_links = JSON.stringify(
        navLinks
          .map((item) => ({ label: String(item.label || "").trim(), path: String(item.path || "").trim() }))
          .filter((item) => item.label && item.path),
      );
      payload.home_about_properties = JSON.stringify(
        aboutProperties.map((item) => String(item || "").trim()).filter(Boolean),
      );
      payload.home_ghee_cards = JSON.stringify(
        gheeCards
          .map((item) => ({
            icon: String(item.icon || "cow").trim(),
            icon_url: String(item.icon_url || "").trim(),
            title: String(item.title || "").trim(),
            description: String(item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description || item.icon_url),
      );
      payload.footer_links = JSON.stringify(
        footerLinks
          .map((item) => ({ label: String(item.label || "").trim(), path: String(item.path || "").trim() }))
          .filter((item) => item.label && item.path),
      );
      payload.footer_quick_links = JSON.stringify(
        footerQuickLinks
          .map((item) => ({ label: String(item.label || "").trim(), path: String(item.path || "").trim() }))
          .filter((item) => item.label && item.path),
      );
      payload.footer_social_links = JSON.stringify(
        footerSocialLinks
          .map((item) => ({
            label: String(item.label || "").trim(),
            url: String(item.url || "").trim(),
            icon: String(item.icon || "facebook").trim(),
          }))
          .filter((item) => item.label && item.url),
      );
      payload.about_page_properties = JSON.stringify(
        aboutPageProperties.map((item) => String(item || "").trim()).filter(Boolean),
      );
      payload.about_page_categories = JSON.stringify(
        aboutPageCategories
          .map((item) => ({
            icon: String(item.icon || "").trim(),
            icon_url: String(item.icon_url || "").trim(),
            title: String(item.title || "").trim(),
            description: String(item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description || item.icon_url || item.icon),
      );
      payload.about_page_process_cards = JSON.stringify(
        aboutPageProcessCards
          .map((item) => ({
            icon_url: String(item.icon_url || "").trim(),
            title: String(item.title || "").trim(),
            description: String(item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description || item.icon_url),
      );
      payload.home_story_bullets = JSON.stringify(
        storyBullets.map((item) => String(item || "").trim()).filter(Boolean),
      );
      Object.entries(sectionStatus).forEach(([statusKey, statusValue]) => {
        payload[`section_status_${statusKey}`] = statusValue;
      });

      await updateSettings(payload);
      setSuccess("Settings saved successfully.");

      // Refetch settings from database to verify save
      await new Promise(resolve => setTimeout(resolve, 500));
      const res = await getSettings();
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

      // Only rebuild the form when the refetch returned data; otherwise keep
      // the current form so a failed refetch can't blank out the inputs.
      if (rows.length) {
        const next = createEmptyTextForm();
        rows.forEach((row) => {
          const key = String(row?.setting_key || "").trim();
          if (Object.prototype.hasOwnProperty.call(next, key)) {
            const sv = row?.setting_value;
            if (typeof sv === "object" && sv !== null) {
              next[key] = JSON.stringify(sv);
            } else {
              next[key] = String(decodeHtmlEntities(sv ?? ""));
            }
          }
        });
        setForm(next);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [
    loadedOk,
    form,
    navLinks,
    aboutProperties,
    gheeCards,
    footerLinks,
    footerQuickLinks,
    footerSocialLinks,
    aboutPageProperties,
    aboutPageCategories,
    aboutPageProcessCards,
    storyBullets,
    sectionStatus,
  ]);

  const updateCurrentSectionStatus = async (nextStatus) => {
    const normalized = nextStatus === "inactive" ? "inactive" : "active";
    const statusSettingKey = `section_status_${currentStatusKey}`;
    const previousStatus = sectionStatus[currentStatusKey] === "inactive" ? "inactive" : "active";

    setSectionStatus((prev) => ({ ...prev, [currentStatusKey]: normalized }));
    setSavingStatus(true);
    setError("");
    setSuccess("");

    try {
      await updateSettings({ [statusSettingKey]: normalized });
      setSuccess("Section status updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update section status.");
      setSectionStatus((prev) => ({ ...prev, [currentStatusKey]: previousStatus }));
    } finally {
      setSavingStatus(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSaveCombo = (event.ctrlKey || event.metaKey) && String(event.key || "").toLowerCase() === "s";
      if (!isSaveCombo) return;
      event.preventDefault();
      if (!loading && !saving && !uploading) handleSave();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    loading,
    saving,
    uploading,
    form,
    navLinks,
    aboutProperties,
    gheeCards,
    footerLinks,
    footerQuickLinks,
    footerSocialLinks,
    aboutPageProperties,
    aboutPageCategories,
    aboutPageProcessCards,
    storyBullets,
    handleSave,
  ]);

  if (loading) return <p className="text-white/70">Loading settings...</p>;

  const getKeysFor = (sectionName) =>
    Object.keys(form).filter((key) => {
      if (imageSettingKeys.has(key)) return false;
      return fieldSectionMap[key] === sectionName;
    });

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-white">{headerTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateCurrentSectionStatus("active")}
              className={
                sectionStatus[currentStatusKey] === "active"
                  ? "rounded-lg border border-[var(--admin-accent)] bg-[var(--admin-accent)] px-3 py-1.5 text-sm font-semibold text-black"
                  : "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-1.5 text-sm font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-card-elevated)]"
              }
              disabled={savingStatus}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => updateCurrentSectionStatus("inactive")}
              className={
                sectionStatus[currentStatusKey] === "inactive"
                  ? "rounded-lg border border-red-900 bg-red-900 px-3 py-1.5 text-sm font-semibold text-red-200"
                  : "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-1.5 text-sm font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-card-elevated)]"
              }
              disabled={savingStatus}
            >
              Inactive
            </button>
          </div>
        </div>
        {/* {activeMainSection === "home" ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {homeSectionTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveHomeSection(tab.key)}
                className={
                  activeHomeSection === tab.key
                    ? "rounded-lg border border-[var(--admin-accent)] bg-[var(--admin-accent)] px-3 py-1.5 text-sm font-semibold text-black"
                    : "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-1.5 text-sm font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-card-elevated)]"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null} */}
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-green-700">{success}</div>
      ) : null}

      <article className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm md:p-5">
        {activeMainSection === "home" ? (
          <FieldRows
            keys={getKeysFor("home.seo")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "navbar" ? (
          <NavbarSettingsSection
            fieldKeys={getKeysFor("navbar")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            navLinks={navLinks}
            setNavLinks={setNavLinks}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "about" ? (
          <HomeAboutSettingsSection
            form={form}
            setField={setField}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            storyBullets={storyBullets}
            setStoryBullets={setStoryBullets}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "company" ? (
          <HomeCompanySettingsSection
            fieldKeys={getKeysFor("home.company")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "offer" ? (
          <HomeOfferSettingsSection
            fieldKeys={getKeysFor("home.offer")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "commitment" ? (
          <HomeCommitmentSettingsSection
            fieldKeys={getKeysFor("home.commitment")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "testimonials" ? (
          <HomeTestimonialsSettingsSection
            fieldKeys={getKeysFor("home.testimonials")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "authentic" ? (
          <HomeAuthenticSettingsSection
            fieldKeys={getKeysFor("home.authentic")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "newsletter" ? (
          <FieldRows 
            keys={getKeysFor("home.newsletter")} 
            form={form} 
            setField={setField} 
            toLabel={toLabel} 
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "video" ? (
          <FieldRows
            keys={getKeysFor("home.video")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "blog" ? (
          <HomeBlogSettingsSection
            fieldKeys={getKeysFor("home.blog")}
            form={form}
            setField={setField}
            toLabel={toLabel}
          />
        ) : null}

        {activeMainSection === "footer" ? (
          <FooterSettingsSection
            fieldKeys={getKeysFor("footer")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            footerLinks={footerLinks}
            setFooterLinks={setFooterLinks}
            footerQuickLinks={footerQuickLinks}
            setFooterQuickLinks={setFooterQuickLinks}
            footerSocialLinks={footerSocialLinks}
            setFooterSocialLinks={setFooterSocialLinks}
          />
        ) : null}

        {activeMainSection === "product" ? (
          <>
            <FieldRows
              keys={getKeysFor("product.seo")}
              form={form}
              setField={setField}
              toLabel={toLabel}
            />
            <ProductSettingsSection
              fieldKeys={getKeysFor("product")}
              form={form}
              setField={setField}
              toLabel={toLabel}
              toImageUrl={toImageUrl}
              uploadToSetting={uploadToSetting}
            />
          </>
        ) : null}

        {activeMainSection === "contact" ? (
          <>
            <FieldRows
              keys={getKeysFor("contact.seo")}
              form={form}
              setField={setField}
              toLabel={toLabel}
            />
            <ContactSettingsSection
              fieldKeys={getKeysFor("contact")}
              form={form}
              setField={setField}
              toLabel={toLabel}
              toImageUrl={toImageUrl}
              uploadToSetting={uploadToSetting}
            />
          </>
        ) : null}

        {activeMainSection === "about" ? (
          <>
            <FieldRows
              keys={getKeysFor("about.seo")}
              form={form}
              setField={setField}
              toLabel={toLabel}
            />
            <AboutSettingsSection
              fieldKeys={getKeysFor("about")}
              form={form}
              setField={setField}
              toLabel={toLabel}
              toImageUrl={toImageUrl}
              uploadToSetting={uploadToSetting}
              aboutPageProperties={aboutPageProperties}
              setAboutPageProperties={setAboutPageProperties}
              aboutPageCategories={aboutPageCategories}
              setAboutPageCategories={setAboutPageCategories}
              aboutPageProcessCards={aboutPageProcessCards}
              setAboutPageProcessCards={setAboutPageProcessCards}
              uploadAboutCategoryIcon={uploadAboutCategoryIcon}
              uploadAboutProcessIcon={uploadAboutProcessIcon}
              activeAboutSection={activeAboutSection}
            />
          </>
        ) : null}

        {activeMainSection === "blog" ? (
          <>
            <FieldRows
              keys={getKeysFor("blog.seo")}
              form={form}
              setField={setField}
              toLabel={toLabel}
            />
            <BlogSettingsSection
              form={form}
              setField={setField}
              toImageUrl={toImageUrl}
              uploadToSetting={uploadToSetting}
            />
          </>
        ) : null}
      </article>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading || loading || !loadedOk}
          className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : uploading ? "Uploading..." : loading ? "Loading..." : !loadedOk ? "Save Disabled" : "Save Settings"}
        </button>
      </div>
    </section>
  );
}
