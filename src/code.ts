import { calculateFontSize } from "./utils/index";

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangles") {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "updateTextStyles") {
    updateTextStyles();
  }

  //figma.closePlugin();
};

function updateTextStyles() {
  const textSelection = filterData(
    figma.currentPage.selection,
    (i: any) => i.type == "TEXT"
  );
  if (!textSelection.length) {
    figma.closePlugin("No text layer selected 🤷‍♂️");
    return;
  }
  const fontSize = calculateFontSize().calculated;
  updateSize(textSelection, fontSize);
}

async function updateSize(textSelection: TextNode[], fontSize: number) {
  for (const text of textSelection) {
    if (text.type === "TEXT" && text.characters) {
      for (let i = 0; i < text.characters.length; i++) {
        const name = text.getRangeFontName(i, i + 1) as FontName;
        await figma.loadFontAsync(name);
      }
      text.fontSize = fontSize;
    }
  }
}

// function calculateFontSize() {
//   const pixelsPerRem = 16;
//   const minWidthPx = 320;
//   const maxWidthPx = 1920;
//   const maxFontSize = 144;
//   const minFontSize = 16;
//   const maxFontSizeRem = 9;
//   const minFontSizeRem = 1;
//   const minWidth = minWidthPx / pixelsPerRem;
//   const maxWidth = maxWidthPx / pixelsPerRem;
//   const currentViewport = 1348;

//   const slope = (maxFontSizeRem - minFontSizeRem) / (maxWidth - minWidth);
//   const yAxisIntersection = -minWidth * slope + minFontSizeRem;

//   console.log(
//     `${minFontSizeRem}rem, ${yAxisIntersection}rem + ${
//       slope * 100
//     }vw, ${maxFontSizeRem}rem`
//   );
//   console.log(
//     minFontSizeRem * 16,
//     yAxisIntersection * 16 + slope * 100 * (currentViewport / 100),
//     maxFontSizeRem * 16
//   );

//   const slopePx = (maxFontSize - minFontSize) / (maxWidthPx - minWidthPx);
//   const yAxisIntersectionPx = -minWidthPx * slope + minFontSize;

//   console.log(
//     "hi",
//     minFontSize,
//     yAxisIntersectionPx + slopePx * 100 * (currentViewport / 100),
//     maxFontSize
//   );
// }

function filterData(data: readonly SceneNode[], predicate: Function) {
  return !!!data
    ? null
    : data.reduce((list: any, entry: any) => {
        let clone = null;
        if (predicate(entry)) {
          clone = entry;
          list.push(clone);
        } else if (entry.children != null) {
          let children = filterData(entry.children, predicate);
          if (children.length > 0) {
            list.push(...children);
          }
        }
        return list;
      }, []);
}
