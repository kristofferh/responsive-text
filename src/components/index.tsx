import { Button } from "react-figma-plugin-ds";
import { useState, useEffect } from "react";

import "./index.css";

interface FormValues {
  minWidthViewport: number;
  maxWidthViewport: number;
  minFontSize: number | null;
  maxFontSize: number | null;
  viewport: number;
  pixelsPerRem: number;
}

interface Result {
  clampCSS: string;
  fontSize: number;
}

interface Errors {
  minWidthViewport?: string;
  maxWidthViewport?: string;
  minFontSize?: string;
  maxFontSize?: string;
  viewport?: string;
  pixelsPerRem?: string;
}

const DEFAULTS: FormValues = {
  minWidthViewport: 375,
  maxWidthViewport: 1920,
  minFontSize: null,
  maxFontSize: null,
  viewport: 1024,
  pixelsPerRem: 16,
};

function validate(values: FormValues): Errors {
  const { minWidthViewport, maxWidthViewport, minFontSize, maxFontSize, viewport, pixelsPerRem } = values;
  const errors: Errors = {};

  if (isNaN(minWidthViewport) || minWidthViewport <= 0)
    errors.minWidthViewport = "Must be a positive number";
  if (isNaN(maxWidthViewport) || maxWidthViewport <= 0)
    errors.maxWidthViewport = "Must be a positive number";
  else if (!errors.minWidthViewport && minWidthViewport >= maxWidthViewport)
    errors.maxWidthViewport = "Must be greater than min viewport width";

  if (minFontSize === null || isNaN(minFontSize) || minFontSize <= 0)
    errors.minFontSize = "Must be a positive number";
  if (maxFontSize === null || isNaN(maxFontSize) || maxFontSize <= 0)
    errors.maxFontSize = "Must be a positive number";
  else if (!errors.minFontSize && minFontSize !== null && minFontSize >= maxFontSize)
    errors.maxFontSize = "Must be greater than min font size";

  if (isNaN(viewport) || viewport <= 0)
    errors.viewport = "Must be a positive number";
  if (isNaN(pixelsPerRem) || pixelsPerRem <= 0)
    errors.pixelsPerRem = "Must be a positive number";

  return errors;
}

export const App = () => {
  const [values, setValues] = useState<FormValues>(DEFAULTS);
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data: { pluginMessage } } = event;
      const { type, data } = pluginMessage;
      if (type === "initValues") {
        setValues(data ? { ...DEFAULTS, ...data } : DEFAULTS);
        setInitialized(true);
      } else if (type === "updatedFontSize") {
        setResult(data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    const parsed = isNaN(raw) ? null : raw;
    setValues((prev) => ({ ...prev, [field]: parsed }));
  };

  const handleCreateClick = () => {
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setResult(null);
    setCopied(false);
    parent.postMessage(
      { pluginMessage: { type: "updateTextStyles", data: values } },
      "*"
    );
  };

  if (!initialized) return null;

  const { minWidthViewport, maxWidthViewport, minFontSize, maxFontSize, viewport, pixelsPerRem } = values;

  return (
    <div className="container">
      <div className="form">
        <div className="field-wrapper">
          <label htmlFor="minWidthViewport">Min width viewport (in px)</label>
          <input
            id="minWidthViewport"
            type="number"
            value={minWidthViewport}
            onChange={handleChange("minWidthViewport")}
            className={`input${errors.minWidthViewport ? " input--error" : ""}`}
          />
          {errors.minWidthViewport && (
            <span className="error">{errors.minWidthViewport}</span>
          )}
        </div>
        <div className="field-wrapper">
          <label htmlFor="maxWidthViewport">Max width viewport (in px)</label>
          <input
            id="maxWidthViewport"
            type="number"
            value={maxWidthViewport}
            onChange={handleChange("maxWidthViewport")}
            className={`input${errors.maxWidthViewport ? " input--error" : ""}`}
          />
          {errors.maxWidthViewport && (
            <span className="error">{errors.maxWidthViewport}</span>
          )}
        </div>
        <div className="field-wrapper">
          <label htmlFor="minFontSize">Min font size (in px)</label>
          <input
            id="minFontSize"
            type="number"
            value={minFontSize ?? ""}
            onChange={handleChange("minFontSize")}
            className={`input${errors.minFontSize ? " input--error" : ""}`}
          />
          {errors.minFontSize && (
            <span className="error">{errors.minFontSize}</span>
          )}
        </div>
        <div className="field-wrapper">
          <label htmlFor="maxFontSize">Max font size (in px)</label>
          <input
            id="maxFontSize"
            type="number"
            value={maxFontSize ?? ""}
            onChange={handleChange("maxFontSize")}
            className={`input${errors.maxFontSize ? " input--error" : ""}`}
          />
          {errors.maxFontSize && (
            <span className="error">{errors.maxFontSize}</span>
          )}
        </div>
        <div className="field-wrapper">
          <label htmlFor="targetViewport">Target viewport width (in px)</label>
          <input
            id="targetViewport"
            type="number"
            value={viewport}
            onChange={handleChange("viewport")}
            className={`input${errors.viewport ? " input--error" : ""}`}
          />
          {errors.viewport && (
            <span className="error">{errors.viewport}</span>
          )}
        </div>
        <div className="field-wrapper">
          <label htmlFor="pixelsPerRem">Pixels per REM</label>
          <input
            id="pixelsPerRem"
            type="number"
            value={pixelsPerRem}
            onChange={handleChange("pixelsPerRem")}
            className={`input${errors.pixelsPerRem ? " input--error" : ""}`}
          />
          {errors.pixelsPerRem && (
            <span className="error">{errors.pixelsPerRem}</span>
          )}
        </div>
      </div>
      {result && (
        <div className="result">
          <p className="result-label">CSS clamp() value</p>
          <div className="result-copy-row">
            <code className="result-value">{result.clampCSS}</code>
            <button
              className="copy-btn"
              title="Copy to clipboard"
              onClick={() => {
                const el = document.createElement("textarea");
                el.value = result.clampCSS;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            {copied && <span className="copy-confirmation">Copied!</span>}
          </div>
          <p className="result-size">
            Font size at target viewport: {result.fontSize.toFixed(2)}px
          </p>
        </div>
      )}
      <Button onClick={handleCreateClick}>Apply</Button>
    </div>
  );
};
