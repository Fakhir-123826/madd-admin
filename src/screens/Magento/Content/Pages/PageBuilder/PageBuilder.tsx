import { useMemo, useState } from 'react';
import { Puck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import {
  createExportBundle,
  initialPageData,
  pageBuilderConfig,
  pageBuilderCss,
} from './pageBuilderConfig';

const STORAGE_KEY = 'puck-page-builder-data';

function getStoredData() {
  if (typeof window === 'undefined') {
    return initialPageData;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return initialPageData;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return initialPageData;
  }
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement('textarea');
  field.value = text;
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  document.body.removeChild(field);
}

const EXPORT_VIEWS = {
  html: 'HTML',
  css: 'CSS',
  document: 'Full Document',
};

export default function PageBuilder() {
  const [data, setData] = useState(getStoredData);
  const [exportView, setExportView] = useState('html');
  const [exportBundle, setExportBundle] = useState(null);
  const [copyState, setCopyState] = useState('');

  const stats = useMemo(() => {
    const content = data?.content || [];

    return {
      blocks: content.length,
      rootTitle: data?.root?.props?.pageTitle || 'Untitled page',
    };
  }, [data]);

  const handleChange = (nextData) => {
    setData(nextData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  };

  const handleExport = () => {
    setExportBundle(createExportBundle(data));
    setExportView('html');
  };

  const handleReset = () => {
    const shouldReset = window.confirm('Reset the current builder content and start from a clean page?');

    if (!shouldReset) {
      return;
    }

    setData(initialPageData);
    window.localStorage.removeItem(STORAGE_KEY);
    setExportBundle(null);
  };

  const handleCopy = async () => {
    if (!exportBundle) {
      return;
    }

    try {
      await copyText(exportBundle[exportView]);
      setCopyState(`Copied ${EXPORT_VIEWS[exportView]}`);
      window.setTimeout(() => setCopyState(''), 1800);
    } catch {
      setCopyState('Copy failed');
      window.setTimeout(() => setCopyState(''), 1800);
    }
  };

  return (
    <div className="builder-shell">
      <style>{pageBuilderCss}</style>

      <header className="builder-shell__topbar">
        <div>
          <p className="builder-shell__eyebrow">Madd Integration</p>
          {/* <h1>{stats.rootTitle}</h1> */}
          <h1>Madd Builder</h1>
        </div>
        <div className="builder-shell__meta">
          <span>{stats.blocks} blocks</span>
          <button className="builder-shell__button builder-shell__button--muted" onClick={handleReset}>
            Reset
          </button>
          <button className="builder-shell__button" onClick={handleExport}>
            Generate HTML/CSS
          </button>
        </div>
      </header>

      <div className="builder-shell__editor">
        <Puck
          config={pageBuilderConfig}
          data={data}
          headerTitle="Madd Builder"
          onChange={handleChange}
          onPublish={handleChange}
          height="calc(100vh - 106px)"
        />
      </div>

      {exportBundle ? (
        <div className="builder-export">
          <div className="builder-export__backdrop" onClick={() => setExportBundle(null)} />
          <div className="builder-export__panel">
            <div className="builder-export__header">
              <div>
                <p className="builder-shell__eyebrow">Export</p>
                <h2>Generated output</h2>
              </div>
              <button className="builder-export__close" onClick={() => setExportBundle(null)}>
                Close
              </button>
            </div>

            <div className="builder-export__tabs">
              {Object.entries(EXPORT_VIEWS).map(([key, label]) => (
                <button
                  className={key === exportView ? 'is-active' : ''}
                  key={key}
                  onClick={() => setExportView(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="builder-export__actions">
              <button className="builder-shell__button builder-shell__button--muted" onClick={handleCopy}>
                {copyState || `Copy ${EXPORT_VIEWS[exportView]}`}
              </button>
              <button
                className="builder-shell__button"
                onClick={() => downloadFile('page-export.html', exportBundle.document, 'text/html')}
              >
                Download HTML file
              </button>
            </div>

            <pre className="builder-export__code">
              <code>{exportBundle[exportView]}</code>
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
