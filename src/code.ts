import { calculateFontSize } from "./utils/index";

const STORAGE_KEY = "formValues";

figma.showUI(__html__, { height: 500 });

async function init() {
  const stored = await figma.clientStorage.getAsync(STORAGE_KEY);
  figma.ui.postMessage({ type: "initValues", data: stored ?? null });
}
init();

figma.ui.onmessage = (msg) => {
  const { data, type } = msg;
  if (type === "updateTextStyles") {
    updateTextStyles(data);
  }
};

async function updateTextStyles(data: any) {
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

  const sizeUpdated = await updateSize(textSelection, fontSize);
  if (sizeUpdated) {
    await figma.clientStorage.setAsync(STORAGE_KEY, data);
    figma.ui.postMessage({
      msg: "Updated font size",
      type: "updatedFontSize",
      data: {
        clampCSS,
        fontSize,
      },
    });
  }
}

async function updateSize(textSelection: TextNode[], fontSize: number) {
  for (const text of textSelection) {
    if (text.hasMissingFont) {
      figma.closePlugin(
        "Text layer has missing font, replace it before running this plugin again"
      );
      return false;
    }

    if (text.type === "TEXT" && text.characters) {
      for (let i = 0; i < text.characters.length; i++) {
        const name = text.getRangeFontName(i, i + 1) as FontName;
        await figma.loadFontAsync(name);
      }
      text.fontSize = fontSize;
    }
  }
  return true;
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
