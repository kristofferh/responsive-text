import { calculateFontSize } from "./utils/index";

figma.showUI(__html__, { height: 500 });

figma.ui.onmessage = (msg) => {
  const { data, type } = msg;
  if (type === "create-rectangles") {
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

  if (type === "updateTextStyles") {
    updateTextStyles(data);
  }

  //figma.closePlugin();
};

function updateTextStyles(data: any) {
  const textSelection = filterData(
    figma.currentPage.selection,
    (i: any) => i.type == "TEXT"
  );

  if (!textSelection.length) {
    figma.closePlugin("No text layer selected 🤷‍♂️");
    return;
  }

  const {
    maxFontSize,
    maxWidthViewport,
    minFontSize,
    minWidthViewport,
    pixelsPerRem,
    viewport,
  } = data;
  const { calculated: fontSize, clampCSS } = calculateFontSize(
    minWidthViewport,
    maxWidthViewport,
    minFontSize,
    maxFontSize,
    viewport,
    pixelsPerRem
  );
  console.log(fontSize, clampCSS);
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
