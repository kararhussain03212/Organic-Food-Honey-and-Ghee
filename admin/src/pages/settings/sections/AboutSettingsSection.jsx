import ImageUpload from "../../../components/ImageUpload";

function SectionCard({ title, description, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4 shadow-sm">
      <div className="border-b border-[var(--admin-border)] pb-3">
        <h4 className="text-sm font-semibold text-[var(--admin-ink)]">{title}</h4>
        {description ? <p className="mt-1 text-xs text-[var(--admin-muted)]">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function StackRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[240px_1fr] md:items-start">
      <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">{label}</label>
      {children}
    </div>
  );
}

function FormField({ value, onChange, placeholder, textarea = false, rows = 3 }) {
  const className =
    "w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]";

  if (textarea) {
    return <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} className={className} />;
  }

  return <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={className} />;
}

export default function AboutSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
  aboutPageProperties,
  setAboutPageProperties,
  aboutPageCategories,
  setAboutPageCategories,
  aboutPageProcessCards,
  setAboutPageProcessCards,
  uploadAboutCategoryIcon,
  uploadAboutProcessIcon,
  activeAboutSection = "all",
}) {
  const heroTextKeys = fieldKeys.filter((key) =>
    [
      "about_page_title",
      "about_page_breadcrumb_home",
      "about_page_breadcrumb_current",
    ].includes(key),
  );
  const infoTextKeys = fieldKeys.filter((key) =>
    ["about_page_info_kicker", "about_page_info_title", "about_page_info_description", "about_page_properties_title"].includes(
      key,
    ),
  );
  const companyTextKeys = fieldKeys.filter((key) =>
    [
      "about_page_company_kicker",
      "about_page_company_title",
      "about_page_company_accent",
      "about_page_company_suffix",
      "about_page_company_description",
    ].includes(key),
  );
  const categoryTextKeys = fieldKeys.filter((key) =>
    ["about_page_category_title", "about_page_category_description"].includes(key),
  );

  const renderVerticalFields = (keys) =>
    keys.map((key) => {
      const isTextarea =
        key.includes("description") ||
        key.includes("_text") ||
        key.includes("_success") ||
        key.includes("_error");

      return (
        <div key={key} className="space-y-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-3">
          <label className="block text-sm font-semibold text-[var(--admin-ink)]">{toLabel(key)}</label>
          {isTextarea ? (
            <textarea
              rows={4}
              value={form[key] || ""}
              onChange={(event) => setField(key, event.target.value)}
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
            />
          ) : (
            <input
              type="text"
              value={form[key] || ""}
              onChange={(event) => setField(key, event.target.value)}
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
            />
          )}
        </div>
      );
    });

  return (
    <>
      {(activeAboutSection === "all" || activeAboutSection === "hero") ? <SectionCard
        title="Hero Section"
        description="Top About page heading and breadcrumb text."
      >
        <div className="space-y-3">{renderVerticalFields(heroTextKeys)}</div>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "hero") ? <SectionCard
        title="Hero Image"
        description="Banner image used at the top of the About page."
      >
        <StackRow label="About Hero Image">
          <ImageUpload
            value={toImageUrl(form.about_page_hero_image)}
            onFileSelect={(file) => uploadToSetting("about_page_hero_image", file, "settings")}
            label="Upload About Hero Image"
            helperText="Banner image for About page header"
          />
        </StackRow>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "info") ? <SectionCard
        title="Info Section"
        description="Text and image that introduce the main About content block."
      >
        <div className="space-y-3">{renderVerticalFields(infoTextKeys)}</div>
        <StackRow label="About Info Image">
          <ImageUpload
            value={toImageUrl(form.about_page_info_image)}
            onFileSelect={(file) => uploadToSetting("about_page_info_image", file, "settings")}
            label="Upload About Info Image"
            helperText="Main image for About information section"
          />
        </StackRow>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "company") ? <SectionCard
        title="Company Section"
        description="Company text and its supporting image are edited here together."
      >
        <div className="space-y-3">{renderVerticalFields(companyTextKeys)}</div>
        <StackRow label="About Company Image">
          <ImageUpload
            value={toImageUrl(form.about_page_company_image)}
            onFileSelect={(file) => uploadToSetting("about_page_company_image", file, "settings")}
            label="Upload About Company Image"
            helperText="Main image for company section"
          />
        </StackRow>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "category") ? <SectionCard
        title="Category Banner"
        description="This image sits with the honey category section.">
        <div className="space-y-3">{renderVerticalFields(categoryTextKeys)}</div>
        <StackRow label="About Category Image">
          <ImageUpload
            value={toImageUrl(form.about_page_category_image)}
            onFileSelect={(file) => uploadToSetting("about_page_category_image", file, "settings")}
            label="Upload About Category Image"
            helperText="Image shown in honey category section"
          />
        </StackRow>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "info") ? <SectionCard
        title="About Properties"
        description="Each property is saved as one list item and appears in order."
      >
        {aboutPageProperties.map((item, index) => (
          <div key={`about-prop-${index}`} className="flex flex-col gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-3 md:flex-row md:items-center">
            <div className="flex-1">
              <input
                type="text"
                value={item}
                onChange={(event) =>
                  setAboutPageProperties((prev) => prev.map((x, i) => (i === index ? event.target.value : x)))
                }
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setAboutPageProperties((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
              }
              className="rounded-xl border border-red-500 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAboutPageProperties((prev) => [...prev, ""])}
          className="rounded-xl bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Property
        </button>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "category") ? <SectionCard
        title="About Categories"
        description="Keep the title, icon key, description, and icon upload together for each category."
      >
        {aboutPageCategories.map((item, index) => (
          <div key={`about-category-${index}`} className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--admin-ink)]">Category {index + 1}</p>
                <p className="text-xs text-[var(--admin-muted)]">One block for the category title, icon, description, and upload.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAboutPageCategories((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
                }
                className="w-full rounded-xl border border-red-500 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 md:w-auto"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                value={item.title}
                placeholder="Title"
                onChange={(event) =>
                  setAboutPageCategories((prev) =>
                    prev.map((x, i) => (i === index ? { ...x, title: event.target.value } : x)),
                  )
                }
              />
              <FormField
                value={item.icon}
                placeholder="Icon key (optional)"
                onChange={(event) =>
                  setAboutPageCategories((prev) =>
                    prev.map((x, i) => (i === index ? { ...x, icon: event.target.value } : x)),
                  )
                }
              />
            </div>

            <FormField
              value={item.description}
              placeholder="Description"
              textarea
              rows={3}
              onChange={(event) =>
                setAboutPageCategories((prev) =>
                  prev.map((x, i) => (i === index ? { ...x, description: event.target.value } : x)),
                )
              }
            />

            <StackRow label="Category Icon Upload">
              <ImageUpload
                value={toImageUrl(item.icon_url)}
                onFileSelect={(file) => uploadAboutCategoryIcon(index, file)}
                label="Upload Category Icon"
                helperText="Optional icon image for this category"
              />
            </StackRow>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setAboutPageCategories((prev) => [...prev, { icon: "", icon_url: "", title: "", description: "" }])
          }
          className="rounded-xl bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Category
        </button>
      </SectionCard>
      : null}

      {(activeAboutSection === "all" || activeAboutSection === "process") ? <SectionCard
        title="About Process Cards"
        description="Each process card is edited in one self-contained block so the relationship stays clear."
      >
        {aboutPageProcessCards.map((item, index) => (
          <div key={`about-process-${index}`} className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--admin-ink)]">Process {index + 1}</p>
                <p className="text-xs text-[var(--admin-muted)]">Title, description, and icon stay inside the same card.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAboutPageProcessCards((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
                }
                className="w-full rounded-xl border border-red-500 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 md:w-auto"
              >
                Remove
              </button>
            </div>

            <FormField
              value={item.title}
              placeholder="Title"
              onChange={(event) =>
                setAboutPageProcessCards((prev) =>
                  prev.map((x, i) => (i === index ? { ...x, title: event.target.value } : x)),
                )
              }
            />

            <FormField
              value={item.description}
              placeholder="Description"
              textarea
              rows={3}
              onChange={(event) =>
                setAboutPageProcessCards((prev) =>
                  prev.map((x, i) => (i === index ? { ...x, description: event.target.value } : x)),
                )
              }
            />

            <StackRow label="Process Icon Upload">
              <ImageUpload
                value={toImageUrl(item.icon_url)}
                onFileSelect={(file) => uploadAboutProcessIcon(index, file)}
                label="Upload Process Icon"
                helperText="Icon image for this process card"
              />
            </StackRow>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAboutPageProcessCards((prev) => [...prev, { icon_url: "", title: "", description: "" }])}
          className="rounded-xl bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Process Card
        </button>
      </SectionCard>
      : null}
    </>
  );
}
