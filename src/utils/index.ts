export function clamp(min: number, prefered: number, max: number) {
  return Math.min(Math.max(prefered, min), max);
}

export function calculateFontSize(
  minViewportWidth = 320,
  maxViewportWidth = 1920,
  minFontSize = 16,
  maxFontSize = 144,
  targetViewportWidth = 1000,
  pixelsPerRem = 16
) {
  const maxFontSizeRem = maxFontSize / pixelsPerRem;
  const minFontSizeRem = minFontSize / pixelsPerRem;
  const minWidthRem = minViewportWidth / pixelsPerRem;
  const maxWidthRem = maxViewportWidth / pixelsPerRem;

  const slope = (maxFontSizeRem - minFontSizeRem) / (maxWidthRem - minWidthRem);
  const yAxisIntersection = -minWidthRem * slope + minFontSizeRem;

  return {
    clampCSS: `clamp(${minFontSizeRem}rem, ${yAxisIntersection.toFixed(
      2
    )}rem + ${(slope * 100).toFixed(2)}vw, ${maxFontSizeRem}rem)`,
    calculated: clamp(
      minFontSizeRem * pixelsPerRem,
      yAxisIntersection * pixelsPerRem +
        slope * 100 * (targetViewportWidth / 100),
      maxFontSizeRem * pixelsPerRem
    ),
  };
}
