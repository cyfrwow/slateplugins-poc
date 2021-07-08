import { useState, useMemo, useEffect } from "react";
import MonacoEditor from "./MonacoEditor";
import {
  SlatePlugins,
  createEditorPlugins,
  serializeHTMLFromNodes,
  HeadingToolbar,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
} from "@udecode/slate-plugins";
// import { createEditor } from "slate";
// import slateToMd from "./slateToMd";
import { Toolbar } from "./toolbar";
import plugins from "./plugins";
import "./App.css";

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

function App() {
  const [value, setValue] = useState(null);
  //   const [markdownValue, setMarkdownValue] = useState(null);
  const [htmlValue, setHtmlValue] = useState("");
  const id = "slate-plugins-editor";
  const editor = useMemo(
    () => createEditorPlugins({ id, plugins, options, components }),
    []
  );
  useEffect(() => {
    if (value) {
      const html = serializeHTMLFromNodes(editor, {
        plugins,
        nodes: value ? [...value] : [],
      });
      setHtmlValue(html);
    }
  }, [value, editor]);

  function handleOnChange(slateObject) {
    setValue(slateObject);
    // setMarkdownValue(slateToMd(slateObject));
    const html = serializeHTMLFromNodes(editor, {
      plugins,
      nodes: value ? [...value] : [],
    });
    setHtmlValue((prevState) => html);
    // console.log({ html });
  }

  const editableProps = {
    placeholder: "Type…",
    style: {
      padding: "15px",
    },
  };

  return (
    <div className="container">
      <div className="column">
        <h4>Slate editor</h4>
        <HeadingToolbar>
          <Toolbar />
        </HeadingToolbar>
        <SlatePlugins
          id={id}
          plugins={plugins}
          components={components}
          options={options}
          autofocus={true}
          editableProps={editableProps}
          onChange={(newValue) => handleOnChange(newValue)}
        />
      </div>
      <div className="column">
        <MonacoEditor slateObject={htmlValue} />
      </div>
    </div>
  );
}

export default App;
