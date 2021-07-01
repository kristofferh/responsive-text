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
      <button id="create" onClick={handleCreateClick}>
        Create
      </button>
      <button>Cancel</button>
    </div>
  );
};
