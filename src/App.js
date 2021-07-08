import { useState, useMemo } from "react";
import MonacoEditor from "./MonacoEditor";
import {
  SlatePlugins,
  /** ELEMENTS */
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_LI,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_TD,
  ELEMENT_IMAGE,
  ELEMENT_TODO_LI,
  ELEMENT_DEFAULT,
  ELEMENT_CODE_LINE,
  ELEMENT_PARAGRAPH,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  /**  MARKS */
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH,
  /** plugins */
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createCodePlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  createListPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createAutoformatPlugin,
  getSlatePluginType,
  unwrapList,
  getParent,
  isElement,
  isType,
  toggleList,
  insertEmptyCodeBlock,
  createExitBreakPlugin,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  createEditorPlugins,
  //   createEditor,
  //   withSlatePlugins,
  //   pipe,
  serializeHTMLFromNodes,
  createTrailingBlockPlugin,
  /**toolbar */
  createImagePlugin,
  createLinkPlugin,
  createTablePlugin,
  createBasicMarkPlugins,
  createBasicElementPlugins,
  createSelectOnBackspacePlugin,
  /** KEYS */
  KEYS_HEADING,
  HeadingToolbar,
} from "@udecode/slate-plugins";
// import { createEditor } from "slate";
import slateToMd from "./slateToMd";
import {
  ToolbarButtonsBasicElements,
  ToolbarButtonsBasicMarks,
  ToolbarButtonsList,
  ToolbarLinkElement,
  ToolbarImageElement,
  ToolbarButtonsTable,
} from "./toolbar";
import plugins from "./plugins";
import "./App.css";

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

function App() {
  const [value, setValue] = useState(null);
  const [markdownValue, setMarkdownValue] = useState(null);
  const [htmlValue, setHtmlValue] = useState("");
  const id = "slate-plugins-editor";
  const editor = useMemo(
    () => createEditorPlugins({ id, plugins, options, components }),
    []
  );
  function handleOnChange(slateObject) {
    setValue(slateObject);
    setMarkdownValue(slateToMd(slateObject));
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
          <header className="toolbar">
            <ul className="toolbar__list">
              <li className="toolbar__listitem">
                <ToolbarButtonsBasicElements />
              </li>
              <li className="toolbar__listitem">
                <ToolbarButtonsBasicMarks />
              </li>
              <li className="toolbar__listitem">
                <ToolbarButtonsList />
              </li>
              <li className="toolbar__listitem">
                <ToolbarButtonsTable />
                <ToolbarLinkElement />
                <ToolbarImageElement />
              </li>
            </ul>
          </header>
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
