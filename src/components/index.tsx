import { Button } from "react-figma-plugin-ds";
import { useState, useEffect } from "react";

import "./index.css";

export const App = () => {
  const [minWidthViewport, setMinWidthViewport] = useState(375);
  const [maxWidthViewport, setMaxWidthViewport] = useState(1920);
  const [minFontSize, setMinFontSize] = useState(0);
  const [maxFontSize, setMaxFontSize] = useState(0);
  const [viewport, setViewport] = useState(1024);
  const [pixelsPerRem, setPixelsPerRem] = useState(16);
  const handleCreateClick = () => {
    const data = {
      minWidthViewport,
      maxWidthViewport,
      minFontSize,
      maxFontSize,
      viewport,
      pixelsPerRem,
    };
    parent.postMessage(
      { pluginMessage: { type: "updateTextStyles", data } },
      "*"
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const {
        data: { pluginMessage },
      } = event;
      const { type, data } = pluginMessage;
      if (type === "updatedFontSize") {
        // TODO: Write this to UI.
        console.log(data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // TODO: Add formik
  const handleMinWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinWidthViewport(value);
  };

  const handleMaxWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMaxWidthViewport(value);
  };

  const handleMinFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinFontSize(value);
  };

  const handleMaxFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMaxFontSize(value);
  };

  const handleViewportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setViewport(value);
  };

  const handlePixelsPerRemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPixelsPerRem(value);
  };

  return (
    <div className="container">
      <div className="form">
        <div className="field-wrapper">
          <label htmlFor="minWidthViewport">Min width viewport (in px)</label>
          <input
            id="minWidthViewport"
            type="number"
            onChange={handleMinWidthChange}
            className="input"
            defaultValue={375}
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="maxWidthViewport">Max width viewport (in px)</label>
          <input
            id="maxWidthViewport"
            type="number"
            onChange={handleMaxWidthChange}
            className="input"
            defaultValue={1920}
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="minFontSize">Min font size (in px)</label>
          <input
            id="minFontSize"
            type="number"
            onChange={handleMinFontSizeChange}
            className="input"
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="maxFontSize">Max font size (in px)</label>
          <input
            id="maxFontSize"
            type="number"
            onChange={handleMaxFontSizeChange}
            className="input"
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="viewport">Target viewport width (in px)</label>
          <input
            id="viewport"
            type="number"
            onChange={handleViewportChange}
            className="input"
            defaultValue={1024}
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="viewport">Pixels per REM</label>
          <input
            id="viewport"
            placeholder="Pixels per REM"
            type="number"
            defaultValue={16}
            onChange={handlePixelsPerRemChange}
            className="input"
          />
        </div>
      </div>
      <Button onClick={handleCreateClick}>Create</Button>
    </div>
  );
};
