import { Button, Input, Label } from "react-figma-plugin-ds";

export const App = () => {
  const handleCreateClick = () => {
    const count = 5;
    parent.postMessage(
      { pluginMessage: { type: "updateTextStyles", count } },
      "*"
    );
  };

  return (
    <div>
      <Label htmlFor="viewport">Viewport width (in px)</Label>
      <Input id="viewport" placeholder="Viewport width" />
      <Button onClick={handleCreateClick}>Create</Button>
      <button>Cancel</button>
    </div>
  );
};
