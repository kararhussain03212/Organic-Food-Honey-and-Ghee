const PolicyPage = ({ title, updatedOn, sections }) => {
  const supportEmail = "info@arionorganicfood.com";
  const mailtoHref = `mailto:${supportEmail}`;

  const renderParagraph = (paragraph) => {
    if (!paragraph.includes(supportEmail)) return paragraph;
    const [before, after] = paragraph.split(supportEmail);
    return (
      <>
        {before}
        <a href={mailtoHref}>{supportEmail}</a>
        {after}
      </>
    );
  };

  return (
    <main className="policy-page">
      <div className="policy-container">
        <p className="policy-kicker">Swift Sign Organic Foods</p>
        <h1 className="policy-title">{title}</h1>
        <p className="policy-updated">Last updated: {updatedOn}</p>

        <div className="policy-content">
          {sections.map((section) => (
            <section key={section.heading} className="policy-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{renderParagraph(paragraph)}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PolicyPage;
