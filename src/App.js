import { useState, useMemo, useEffect } from "react";
import MonacoEditor from "./MonacoEditor";
import {
  SlatePlugins,
  createEditorPlugins,
  serializeHTMLFromNodes,
  HeadingToolbar,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  deserializeHTMLToDocumentFragment,
} from "@udecode/slate-plugins";
import Toolbar from "./toolbar";
import plugins from "./plugins";
import htmlfile from "./test";
import "./App.css";

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

function App() {
  const id = "slate-plugins-editor";
  const editor = useMemo(
    () => createEditorPlugins({ id, plugins, options, components }),
    []
  );
  const initialValue = useMemo(() => {
    return [
      {
        children: deserializeHTMLToDocumentFragment(editor, {
          plugins,
          element: htmlfile,
        }),
      },
    ];
  }, [editor]);

  const [value, setValue] = useState(initialValue);
  const [htmlValue, setHtmlValue] = useState("");

  useEffect(() => {
    if (value) {
      const html = serializeHTMLFromNodes(editor, {
        plugins,
        nodes: value,
      });
      setHtmlValue(html);
    }
  }, [value, editor]);

  function handleOnChange(slateObject) {
    setValue(slateObject);
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
          initialValue={value}
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
