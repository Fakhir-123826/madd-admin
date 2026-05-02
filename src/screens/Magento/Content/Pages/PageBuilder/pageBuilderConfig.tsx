/* eslint-disable react-refresh/only-export-components */
import { Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@puckeditor/core';

const option = (label, value) => ({ label, value });

const PAGE_SURFACES = {
  sand: {
    bg: '#f5efe5',
    card: '#fffaf2',
    text: '#231813',
    muted: '#6f6258',
    border: '#dbcabb',
  },
  slate: {
    bg: '#182026',
    card: '#23303a',
    text: '#f5f4ef',
    muted: '#b2bcc3',
    border: '#3a4d5a',
  },
  cloud: {
    bg: '#edf2f7',
    card: '#ffffff',
    text: '#182433',
    muted: '#607082',
    border: '#cad5df',
  },
};

const WIDTH_MAP = {
  compact: '860px',
  wide: '1120px',
  full: '1320px',
};

const DEFAULT_TABS = [
  {
    label: 'Overview',
    heading: 'Tab heading',
    body: 'Add structured content for each tab directly from the editor sidebar.',
  },
  {
    label: 'Details',
    heading: 'More information',
    body: 'Tabs export to CSS-only markup so the layout still works without JavaScript.',
  },
];

const DEFAULT_BUTTONS = [
  { label: 'Primary action', href: '#', variant: 'primary' },
  { label: 'Secondary action', href: '#', variant: 'secondary' },
];

const DEFAULT_SLIDES = [
  {
    title: 'First slide',
    text: 'Use this block for hero highlights, portfolios, or product callouts.',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Second slide',
    text: 'The export keeps the slides as a horizontal scroll area with snap points.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
];

const DEFAULT_PRODUCTS = [
  {
    name: 'Starter Kit',
    price: '$49',
    description: 'A clean entry-level package for launches and landing pages.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Studio Pack',
    price: '$129',
    description: 'Expanded presentation block for richer product storytelling.',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
  },
];

function splitLines(content = '') {
  return content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeUrl(url) {
  if (!url) return '#';
  if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url;
  return `https://${url}`;
}

function getYouTubeEmbed(url = '') {
  if (!url) return null;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/i);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const longMatch = url.match(/[?&]v=([^?&]+)/i);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/i);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  return null;
}

function PageRoot({
  pageTitle,
  pageDescription,
  surface,
  accentColor,
  width,
  topSpacing,
  children,
}) {
  const palette = PAGE_SURFACES[surface] || PAGE_SURFACES.sand;

  return (
    <main
      className="pb-page"
      style={{
        '--pb-page-bg': palette.bg,
        '--pb-card-bg': palette.card,
        '--pb-text': palette.text,
        '--pb-muted': palette.muted,
        '--pb-border': palette.border,
        '--pb-accent': accentColor || '#b65a2b',
      }}
    >
      <div
        className={`pb-shell pb-shell--space-${topSpacing || 'comfortable'}`}
        style={{ '--pb-width': WIDTH_MAP[width] || WIDTH_MAP.wide }}
      >
        <header className="pb-page__hero">
          {/* <div className="pb-page__eyebrow">Puck Builder</div> */}
          {/* <h1>{pageTitle}</h1> */}
          {/* <p>{pageDescription}</p> */}
        </header>
        <div className="pb-root-content">{children}</div>
      </div>
    </main>
  );
}

function RowSection({ tone, padding, children }) {
  const Children = children;

  return (
    <section
      className={`pb-section pb-section--${tone || 'plain'} pb-section--pad-${padding || 'medium'}`}
    >
      <Children className="pb-slot pb-slot--stack" />
    </section>
  );
}

function ColumnsSection({
  columns,
  gap,
  tone,
  columnOne,
  columnTwo,
  columnThree,
  columnFour,
}) {
  const slotMap = [columnOne, columnTwo, columnThree, columnFour];
  const totalColumns = Number(columns) || 2;

  return (
    <section className={`pb-columns pb-columns--${tone || 'plain'}`}>
      <div className={`pb-columns__grid pb-columns__grid--${totalColumns} pb-columns__grid--gap-${gap || 'medium'}`}>
        {slotMap.slice(0, totalColumns).map((Slot, index) => (
          <div className="pb-columns__cell" key={index}>
            <Slot className="pb-slot pb-slot--stack" />
          </div>
        ))}
      </div>
    </section>
  );
}

function TabsSection({ id, tone, items }) {
  const safeItems = items?.length ? items : DEFAULT_TABS;
  const groupName = `${id || 'pb-tabs'}-tabs`;

  return (
    <section className={`pb-tabs pb-tabs--${tone || 'plain'}`}>
      {safeItems.map((item, index) => {
        const tabId = `${groupName}-${index}`;

        return (
          <Fragment key={tabId}>
            <input
              className="pb-tabs__input"
              type="radio"
              id={tabId}
              name={groupName}
              defaultChecked={index === 0}
            />
            <label className="pb-tabs__label" htmlFor={tabId}>
              {item.label}
            </label>
            <div className="pb-tabs__panel">
              <h3>{item.heading}</h3>
              {splitLines(item.body).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}

function TextSection({ content, tone, size, align }) {
  const lines = splitLines(content || 'Add supporting copy here.');

  return (
    <div className={`pb-text pb-text--${size || 'medium'} pb-text--${tone || 'default'} pb-text--${align || 'left'}`}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function HeadingSection({ text, level, align, accent }) {
  const Tag = `h${level || '2'}`;

  return (
    <Tag className={`pb-heading pb-heading--${align || 'left'} ${accent ? 'pb-heading--accent' : ''}`}>
      {text || 'Section heading'}
    </Tag>
  );
}

function ButtonsSection({ items, align }) {
  const safeItems = items?.length ? items : DEFAULT_BUTTONS;

  return (
    <div className={`pb-buttons pb-buttons--${align || 'left'}`}>
      {safeItems.map((item, index) => (
        <a
          className={`pb-button pb-button--${item.variant || 'primary'}`}
          href={normalizeUrl(item.href)}
          key={`${item.label}-${index}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

function DividerSection({ style }) {
  return <hr className={`pb-divider pb-divider--${style || 'solid'}`} />;
}

function HtmlCodeSection({ code }) {
  return <div className="pb-html" dangerouslySetInnerHTML={{ __html: code || '<div>Custom HTML block</div>' }} />;
}

function ImageSection({ src, alt, caption, radius }) {
  return (
    <figure className={`pb-image pb-image--${radius || 'medium'}`}>
      {src ? (
        <img src={src} alt={alt || 'Content image'} />
      ) : (
        <div className="pb-image__placeholder">Add an image URL</div>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function VideoSection({ url, caption }) {
  const youtubeEmbed = getYouTubeEmbed(url);

  return (
    <figure className="pb-video">
      <div className="pb-video__frame">
        {youtubeEmbed ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src={youtubeEmbed}
            title="Video block"
          />
        ) : url ? (
          <video controls src={url} />
        ) : (
          <div className="pb-video__placeholder">Add a YouTube or video URL</div>
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function BannerSection({
  eyebrow,
  title,
  body,
  backgroundImage,
  alignment,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}) {
  const hasActions = primaryLabel || secondaryLabel;

  return (
    <section
      className={`pb-banner pb-banner--${alignment || 'left'} ${backgroundImage ? 'pb-banner--image' : ''}`}
      style={backgroundImage ? { '--pb-banner-image': `url(${backgroundImage})` } : undefined}
    >
      {eyebrow ? <div className="pb-banner__eyebrow">{eyebrow}</div> : null}
      <h2>{title || 'Banner title'}</h2>
      {splitLines(body || 'Use banners for hero sections, announcements, and strong calls to action.').map((line) => (
        <p key={line}>{line}</p>
      ))}
      {hasActions ? (
        <div className={`pb-buttons pb-buttons--${alignment || 'left'}`}>
          {primaryLabel ? (
            <a className="pb-button pb-button--primary" href={normalizeUrl(primaryUrl)}>
              {primaryLabel}
            </a>
          ) : null}
          {secondaryLabel ? (
            <a className="pb-button pb-button--ghost" href={normalizeUrl(secondaryUrl)}>
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function SliderSection({ slides }) {
  const safeSlides = slides?.length ? slides : DEFAULT_SLIDES;

  return (
    <section className="pb-slider">
      <div className="pb-slider__track">
        {safeSlides.map((slide, index) => (
          <article className="pb-slider__slide" key={`${slide.title}-${index}`}>
            <div className="pb-slider__image">
              {slide.image ? <img src={slide.image} alt={slide.title || `Slide ${index + 1}`} /> : null}
            </div>
            <div className="pb-slider__body">
              <h3>{slide.title}</h3>
              <p>{slide.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MapSection({ query, height }) {
  const safeHeight = Number(height) || 340;
  const safeQuery = query || 'Karachi';

  return (
    <section className="pb-map">
      <iframe
        height={safeHeight}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(safeQuery)}&z=14&output=embed`}
        title={`Map for ${safeQuery}`}
      />
    </section>
  );
}

function BlockSection({ badge, title, body, linkLabel, linkUrl, emphasis }) {
  return (
    <article className={`pb-block pb-block--${emphasis || 'soft'}`}>
      {badge ? <span className="pb-block__badge">{badge}</span> : null}
      <h3>{title || 'Content block'}</h3>
      {splitLines(body || 'Use this for feature cards, service callouts, or editorial highlights.').map((line) => (
        <p key={line}>{line}</p>
      ))}
      {linkLabel ? (
        <a className="pb-block__link" href={normalizeUrl(linkUrl)}>
          {linkLabel}
        </a>
      ) : null}
    </article>
  );
}

function ProductsSection({ heading, subheading, items }) {
  const safeItems = items?.length ? items : DEFAULT_PRODUCTS;

  return (
    <section className="pb-products">
      <div className="pb-products__intro">
        <h2>{heading || 'Featured products'}</h2>
        {subheading ? <p>{subheading}</p> : null}
      </div>
      <div className="pb-products__grid">
        {safeItems.map((item, index) => (
          <article className="pb-product" key={`${item.name}-${index}`}>
            <div className="pb-product__image">
              {item.image ? <img src={item.image} alt={item.name || `Product ${index + 1}`} /> : null}
            </div>
            <div className="pb-product__body">
              <div className="pb-product__meta">
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
              </div>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const BUTTON_VARIANTS = [
  option('Primary', 'primary'),
  option('Secondary', 'secondary'),
  option('Outline', 'outline'),
  option('Ghost', 'ghost'),
];

export const initialPageData = {
  root: {
    props: {
      pageTitle: 'Untitled page',
      pageDescription: 'Build sections with Puck and export the result as static HTML and CSS.',
      surface: 'sand',
      accentColor: '#b65a2b',
      width: 'wide',
      topSpacing: 'comfortable',
    },
  },
  content: [],
};

export const pageBuilderCss = `
.pb-page {
  background: var(--pb-page-bg);
  color: var(--pb-text);
  min-height: 100%;
  padding: 48px 20px 72px;
}

.pb-page *,
.pb-page *::before,
.pb-page *::after {
  box-sizing: border-box;
}

.pb-shell {
  margin: 0 auto;
  max-width: var(--pb-width);
}

.pb-shell--space-compact {
  padding-top: 12px;
}

.pb-shell--space-comfortable {
  padding-top: 32px;
}

.pb-shell--space-generous {
  padding-top: 56px;
}

.pb-page__hero {
  margin-bottom: 32px;
  text-align: left;
}

.pb-page__eyebrow,
.pb-banner__eyebrow,
.pb-block__badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--pb-border);
  border-radius: 999px;
  color: var(--pb-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  margin-bottom: 16px;
  padding: 8px 12px;
  text-transform: uppercase;
}

.pb-page h1,
.pb-page h2,
.pb-page h3,
.pb-page h4,
.pb-page h5,
.pb-page h6 {
  color: var(--pb-text);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.08;
  margin: 0;
}

.pb-page__hero h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  margin-bottom: 14px;
}

.pb-page__hero p,
.pb-text p,
.pb-tabs__panel p,
.pb-banner p,
.pb-block p,
.pb-product p,
.pb-products__intro p {
  color: var(--pb-muted);
  line-height: 1.7;
  margin: 0;
}

.pb-root-content,
.pb-slot--stack {
  display: grid;
  gap: 24px;
}

.pb-section,
.pb-columns,
.pb-tabs,
.pb-banner,
.pb-block,
.pb-products,
.pb-slider,
.pb-map,
.pb-image,
.pb-video {
  background: var(--pb-card-bg);
  border: 1px solid var(--pb-border);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.pb-section--pad-small {
  padding: 20px;
}

.pb-section--pad-medium,
.pb-columns,
.pb-tabs,
.pb-slider,
.pb-products,
.pb-map {
  padding: 28px;
}

.pb-section--pad-large {
  padding: 40px;
}

.pb-section--accent,
.pb-columns--accent,
.pb-tabs--accent,
.pb-block--strong {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--pb-accent) 18%, transparent), transparent 45%),
    var(--pb-card-bg);
}

.pb-columns__grid {
  display: grid;
}

.pb-columns__grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pb-columns__grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pb-columns__grid--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.pb-columns__grid--gap-tight {
  gap: 16px;
}

.pb-columns__grid--gap-medium {
  gap: 24px;
}

.pb-columns__grid--gap-loose {
  gap: 32px;
}

.pb-columns__cell {
  min-height: 84px;
}

.pb-heading {
  font-size: clamp(2rem, 4vw, 3.3rem);
}

.pb-heading--left,
.pb-text--left,
.pb-buttons--left {
  text-align: left;
  justify-content: flex-start;
}

.pb-heading--center,
.pb-text--center,
.pb-buttons--center {
  text-align: center;
  justify-content: center;
}

.pb-heading--right,
.pb-text--right,
.pb-buttons--right {
  text-align: right;
  justify-content: flex-end;
}

.pb-heading--accent {
  color: var(--pb-accent);
}

.pb-text {
  display: grid;
  gap: 12px;
}

.pb-text--small {
  font-size: 0.95rem;
}

.pb-text--medium {
  font-size: 1.05rem;
}

.pb-text--large {
  font-size: 1.22rem;
}

.pb-text--muted p {
  color: var(--pb-muted);
}

.pb-text--default p {
  color: var(--pb-text);
}

.pb-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pb-button,
.pb-block__link {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.95rem;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  text-decoration: none;
  transition: transform 120ms ease, opacity 120ms ease;
}

.pb-button:hover,
.pb-block__link:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.pb-button--primary,
.pb-block__link {
  background: var(--pb-accent);
  color: #fff7f3;
}

.pb-button--secondary {
  background: var(--pb-text);
  color: var(--pb-card-bg);
}

.pb-button--outline {
  border: 1px solid var(--pb-border);
  color: var(--pb-text);
}

.pb-button--ghost {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--pb-accent) 35%, var(--pb-border));
  color: var(--pb-text);
}

.pb-divider {
  border: 0;
  border-top: 1px solid var(--pb-border);
  margin: 8px 0;
}

.pb-divider--dashed {
  border-top-style: dashed;
}

.pb-divider--dotted {
  border-top-style: dotted;
}

.pb-html {
  color: var(--pb-text);
}

.pb-image,
.pb-video {
  margin: 0;
  overflow: hidden;
  padding: 0;
}

.pb-image img,
.pb-video iframe,
.pb-video video,
.pb-slider__image img,
.pb-product__image img {
  display: block;
  height: auto;
  width: 100%;
}

.pb-image__placeholder,
.pb-video__placeholder {
  align-items: center;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--pb-accent) 14%, transparent), transparent),
    rgba(255, 255, 255, 0.45);
  color: var(--pb-muted);
  display: flex;
  justify-content: center;
  min-height: 260px;
  padding: 32px;
}

.pb-image figcaption,
.pb-video figcaption {
  color: var(--pb-muted);
  font-size: 0.92rem;
  padding: 16px 20px 20px;
}

.pb-image--soft img {
  border-radius: 14px;
}

.pb-image--medium img {
  border-radius: 24px;
}

.pb-image--pill img {
  border-radius: 36px;
}

.pb-video__frame {
  aspect-ratio: 16 / 9;
  background: rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.pb-video iframe,
.pb-video video {
  border: 0;
  height: 100%;
}

.pb-banner {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--pb-accent) 24%, transparent), transparent 54%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0)),
    var(--pb-card-bg);
  overflow: hidden;
  padding: 44px;
  position: relative;
}

.pb-banner--image::before {
  background-image:
    linear-gradient(135deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.08)),
    var(--pb-banner-image);
  background-position: center;
  background-size: cover;
  content: "";
  inset: 0;
  opacity: 0.9;
  position: absolute;
}

.pb-banner > * {
  position: relative;
  z-index: 1;
}

.pb-banner--center {
  text-align: center;
}

.pb-banner--right {
  text-align: right;
}

.pb-banner h2 {
  font-size: clamp(2.2rem, 4vw, 4rem);
  margin-bottom: 14px;
}

.pb-banner p {
  font-size: 1.06rem;
  margin-bottom: 24px;
  max-width: 62ch;
}

.pb-banner--center p {
  margin-left: auto;
  margin-right: auto;
}

.pb-banner--right p {
  margin-left: auto;
}

.pb-slider__track {
  display: grid;
  gap: 18px;
  grid-auto-columns: minmax(280px, 1fr);
  grid-auto-flow: column;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.pb-slider__slide {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--pb-border);
  border-radius: 22px;
  overflow: hidden;
  scroll-snap-align: start;
}

.pb-slider__body {
  padding: 20px;
}

.pb-slider__body h3 {
  font-size: 1.45rem;
  margin-bottom: 10px;
}

.pb-slider__body p {
  color: var(--pb-muted);
  margin: 0;
}

.pb-tabs {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
}

.pb-tabs__input {
  display: none;
}

.pb-tabs__label {
  border: 1px solid var(--pb-border);
  border-radius: 999px;
  color: var(--pb-muted);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 12px 18px;
}

.pb-tabs__panel {
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid var(--pb-border);
  border-radius: 20px;
  display: none;
  grid-column: 1 / -1;
  padding: 22px;
}

.pb-tabs__panel h3 {
  font-size: 1.45rem;
  margin-bottom: 10px;
}

.pb-tabs__input:checked + .pb-tabs__label {
  background: var(--pb-accent);
  border-color: var(--pb-accent);
  color: #fff7f3;
}

.pb-tabs__input:checked + .pb-tabs__label + .pb-tabs__panel {
  display: block;
}

.pb-map iframe {
  border: 0;
  border-radius: 18px;
  width: 100%;
}

.pb-block {
  display: grid;
  gap: 14px;
  padding: 28px;
}

.pb-block--soft {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.16)),
    var(--pb-card-bg);
}

.pb-block h3 {
  font-size: 1.75rem;
}

.pb-products {
  display: grid;
  gap: 22px;
}

.pb-products__intro {
  display: grid;
  gap: 10px;
}

.pb-products__grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.pb-product {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--pb-border);
  border-radius: 22px;
  overflow: hidden;
}

.pb-product__body {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.pb-product__meta {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.pb-product__meta h3 {
  font-size: 1.2rem;
}

.pb-product__meta strong {
  color: var(--pb-accent);
  font-size: 1rem;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .pb-page {
    padding: 28px 14px 52px;
  }

  .pb-columns__grid--2,
  .pb-columns__grid--3,
  .pb-columns__grid--4 {
    grid-template-columns: 1fr;
  }

  .pb-banner {
    padding: 28px;
  }

  .pb-section--pad-large {
    padding: 28px;
  }
}
`;

export const pageBuilderConfig = {
  categories: {
    layout: {
      title: 'Layout',
      defaultExpanded: true,
      components: ['Row', 'Columns', 'Tabs'],
    },
    elements: {
      title: 'Elements',
      defaultExpanded: true,
      components: ['Text', 'Heading', 'Buttons', 'Divider', 'HtmlCode'],
    },
    media: {
      title: 'Media',
      defaultExpanded: true,
      components: ['Image', 'Video', 'Banner', 'Slider', 'Map'],
    },
    content: {
      title: 'Add Content',
      defaultExpanded: true,
      components: ['Block', 'Products'],
    },
  },
  root: {
    render: PageRoot,
    fields: {
      pageTitle: { type: 'text' },
      pageDescription: { type: 'textarea' },
      surface: {
        type: 'select',
        options: [option('Sand', 'sand'), option('Slate', 'slate'), option('Cloud', 'cloud')],
      },
      accentColor: { type: 'text' },
      width: {
        type: 'select',
        options: [option('Compact', 'compact'), option('Wide', 'wide'), option('Full', 'full')],
      },
      topSpacing: {
        type: 'select',
        options: [
          option('Compact', 'compact'),
          option('Comfortable', 'comfortable'),
          option('Generous', 'generous'),
        ],
      },
    },
    defaultProps: initialPageData.root.props,
  },
  components: {
    Row: {
      label: 'Row',
      defaultProps: { tone: 'plain', padding: 'medium' },
      fields: {
        tone: {
          type: 'select',
          options: [option('Plain', 'plain'), option('Accent', 'accent')],
        },
        padding: {
          type: 'select',
          options: [option('Small', 'small'), option('Medium', 'medium'), option('Large', 'large')],
        },
        children: { type: 'slot' },
      },
      render: RowSection,
    },
    Columns: {
      label: 'Columns',
      defaultProps: { columns: '2', gap: 'medium', tone: 'plain' },
      fields: {
        columns: {
          type: 'select',
          options: [option('2 Columns', '2'), option('3 Columns', '3'), option('4 Columns', '4')],
        },
        gap: {
          type: 'select',
          options: [option('Tight', 'tight'), option('Medium', 'medium'), option('Loose', 'loose')],
        },
        tone: {
          type: 'select',
          options: [option('Plain', 'plain'), option('Accent', 'accent')],
        },
        columnOne: { type: 'slot' },
        columnTwo: { type: 'slot' },
        columnThree: { type: 'slot' },
        columnFour: { type: 'slot' },
      },
      render: ColumnsSection,
    },
    Tabs: {
      label: 'Tabs',
      defaultProps: { tone: 'plain', items: DEFAULT_TABS },
      fields: {
        tone: {
          type: 'select',
          options: [option('Plain', 'plain'), option('Accent', 'accent')],
        },
        items: {
          type: 'array',
          defaultItemProps: DEFAULT_TABS[0],
          getItemSummary: (item, index) => item.label || `Tab ${index + 1}`,
          arrayFields: {
            label: { type: 'text' },
            heading: { type: 'text' },
            body: { type: 'textarea' },
          },
        },
      },
      render: TabsSection,
    },
    Text: {
      label: 'Text',
      defaultProps: {
        content: 'Write paragraph content, editorial copy, or product descriptions here.',
        tone: 'default',
        size: 'medium',
        align: 'left',
      },
      fields: {
        content: { type: 'textarea' },
        tone: {
          type: 'select',
          options: [option('Default', 'default'), option('Muted', 'muted')],
        },
        size: {
          type: 'select',
          options: [option('Small', 'small'), option('Medium', 'medium'), option('Large', 'large')],
        },
        align: {
          type: 'radio',
          options: [option('Left', 'left'), option('Center', 'center'), option('Right', 'right')],
        },
      },
      render: TextSection,
    },
    Heading: {
      label: 'Heading',
      defaultProps: { text: 'Your main heading', level: '2', align: 'left', accent: false },
      fields: {
        text: { type: 'text' },
        level: {
          type: 'select',
          options: [option('H1', '1'), option('H2', '2'), option('H3', '3'), option('H4', '4')],
        },
        align: {
          type: 'radio',
          options: [option('Left', 'left'), option('Center', 'center'), option('Right', 'right')],
        },
        accent: {
          type: 'radio',
          options: [option('Standard', false), option('Accent', true)],
        },
      },
      render: HeadingSection,
    },
    Buttons: {
      label: 'Buttons',
      defaultProps: { align: 'left', items: DEFAULT_BUTTONS },
      fields: {
        align: {
          type: 'radio',
          options: [option('Left', 'left'), option('Center', 'center'), option('Right', 'right')],
        },
        items: {
          type: 'array',
          defaultItemProps: DEFAULT_BUTTONS[0],
          getItemSummary: (item, index) => item.label || `Button ${index + 1}`,
          arrayFields: {
            label: { type: 'text' },
            href: { type: 'text' },
            variant: { type: 'select', options: BUTTON_VARIANTS },
          },
        },
      },
      render: ButtonsSection,
    },
    Divider: {
      label: 'Divider',
      defaultProps: { style: 'solid' },
      fields: {
        style: {
          type: 'select',
          options: [option('Solid', 'solid'), option('Dashed', 'dashed'), option('Dotted', 'dotted')],
        },
      },
      render: DividerSection,
    },
    HtmlCode: {
      label: 'HTML Code',
      defaultProps: { code: '<div style="padding:16px;border:1px dashed currentColor">Custom HTML block</div>' },
      fields: {
        code: { type: 'textarea' },
      },
      render: HtmlCodeSection,
    },
    Image: {
      label: 'Image',
      defaultProps: { src: '', alt: '', caption: '', radius: 'medium' },
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' },
        caption: { type: 'text' },
        radius: {
          type: 'select',
          options: [option('Soft', 'soft'), option('Medium', 'medium'), option('Pill', 'pill')],
        },
      },
      render: ImageSection,
    },
    Video: {
      label: 'Video',
      defaultProps: { url: '', caption: '' },
      fields: {
        url: { type: 'text' },
        caption: { type: 'text' },
      },
      render: VideoSection,
    },
    Banner: {
      label: 'Banner',
      defaultProps: {
        eyebrow: 'Featured',
        title: 'Banner headline',
        body: 'Use this section for your strongest offer, announcement, or hero introduction.',
        backgroundImage: '',
        alignment: 'left',
        primaryLabel: 'Get started',
        primaryUrl: '#',
        secondaryLabel: 'Learn more',
        secondaryUrl: '#',
      },
      fields: {
        eyebrow: { type: 'text' },
        title: { type: 'text' },
        body: { type: 'textarea' },
        backgroundImage: { type: 'text' },
        alignment: {
          type: 'radio',
          options: [option('Left', 'left'), option('Center', 'center'), option('Right', 'right')],
        },
        primaryLabel: { type: 'text' },
        primaryUrl: { type: 'text' },
        secondaryLabel: { type: 'text' },
        secondaryUrl: { type: 'text' },
      },
      render: BannerSection,
    },
    Slider: {
      label: 'Slider',
      defaultProps: { slides: DEFAULT_SLIDES },
      fields: {
        slides: {
          type: 'array',
          defaultItemProps: DEFAULT_SLIDES[0],
          getItemSummary: (item, index) => item.title || `Slide ${index + 1}`,
          arrayFields: {
            title: { type: 'text' },
            text: { type: 'textarea' },
            image: { type: 'text' },
          },
        },
      },
      render: SliderSection,
    },
    Map: {
      label: 'Map',
      defaultProps: { query: 'Karachi, Pakistan', height: 340 },
      fields: {
        query: { type: 'text' },
        height: { type: 'number' },
      },
      render: MapSection,
    },
    Block: {
      label: 'Block',
      defaultProps: {
        badge: 'Content',
        title: 'Flexible content block',
        body: 'Use this to highlight a service, feature, quote, or important supporting section.',
        linkLabel: 'Read more',
        linkUrl: '#',
        emphasis: 'soft',
      },
      fields: {
        badge: { type: 'text' },
        title: { type: 'text' },
        body: { type: 'textarea' },
        linkLabel: { type: 'text' },
        linkUrl: { type: 'text' },
        emphasis: {
          type: 'select',
          options: [option('Soft', 'soft'), option('Strong', 'strong')],
        },
      },
      render: BlockSection,
    },
    Products: {
      label: 'Products',
      defaultProps: {
        heading: 'Featured products',
        subheading: 'Showcase products, services, plans, or packages in a clean responsive grid.',
        items: DEFAULT_PRODUCTS,
      },
      fields: {
        heading: { type: 'text' },
        subheading: { type: 'textarea' },
        items: {
          type: 'array',
          defaultItemProps: DEFAULT_PRODUCTS[0],
          getItemSummary: (item, index) => item.name || `Product ${index + 1}`,
          arrayFields: {
            name: { type: 'text' },
            price: { type: 'text' },
            description: { type: 'textarea' },
            image: { type: 'text' },
          },
        },
      },
      render: ProductsSection,
    },
  },
};

export function createExportBundle(data) {
  const html = renderToStaticMarkup(<Render config={pageBuilderConfig} data={data} />);
  const css = pageBuilderCss.trim();
  const title = data?.root?.props?.pageTitle || 'Puck Export';
  const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
${css}
    </style>
  </head>
  <body>
${html}
  </body>
</html>`;

  return { html, css, document };
}
