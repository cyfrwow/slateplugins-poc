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
import "./App.css";

const preFormat = (editor) => unwrapList(editor);

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

const optionsSoftBreakPlugin = {
  rules: [
    { hotkey: "shift+enter" },
    {
      hotkey: "enter",
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
      },
    },
  ],
};

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Enter",
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Backspace",
      predicate: isSelectionAtBlockStart,
    },
  ],
};

const optionsExitBreakPlugin = {
  rules: [
    {
      hotkey: "mod+enter",
    },
    {
      hotkey: "mod+shift+enter",
      before: true,
    },
    {
      hotkey: "enter",
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING,
      },
    },
  ],
};

const ELEMENT_HR = "hr";

const getThemacticBreakElement = () => (editor) => (props) => {
  if (props.element.type === ELEMENT_HR) {
    return <hr />;
  }
};

function createThematicBreakPlugin() {
  return {
    pluginKeys: ELEMENT_HR,
    renderElement: getThemacticBreakElement(),
  };
}

const optionsAutoformat = {
  rules: [
    {
      type: ELEMENT_H1,
      markup: "#",
      preFormat,
    },
    {
      type: ELEMENT_H2,
      markup: "##",
      preFormat,
    },
    {
      type: ELEMENT_H3,
      markup: "###",
      preFormat,
    },
    {
      type: ELEMENT_H4,
      markup: "####",
      preFormat,
    },
    {
      type: ELEMENT_H5,
      markup: "#####",
      preFormat,
    },
    {
      type: ELEMENT_H6,
      markup: "######",
      preFormat,
    },
    {
      type: ELEMENT_HR,
      markup: "---",
    },
    {
      type: ELEMENT_LI,
      markup: ["*", "-"],
      preFormat,
      format: (editor) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            isElement(node) &&
            !isType(editor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor, {
              type: ELEMENT_UL,
            });
          }
        }
      },
    },
    {
      type: ELEMENT_LI,
      markup: ["1.", "1)"],
      format: (editor) => {
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            isElement(node) &&
            !isType(editor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor, {
              type: ELEMENT_OL,
            });
          }
        }
      },
    },
    {
      type: ELEMENT_TODO_LI,
      markup: ["[]"],
    },
    {
      type: ELEMENT_BLOCKQUOTE,
      markup: [">"],
      preFormat,
    },
    {
      type: MARK_BOLD,
      between: ["**", "**"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: MARK_UNDERLINE,
      between: ["__", "__"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: MARK_ITALIC,
      between: ["*", "*"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: MARK_CODE,
      between: ["`", "`"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: MARK_STRIKETHROUGH,
      between: ["~~", "~~"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: ELEMENT_CODE_BLOCK,
      markup: "``",
      trigger: "`",
      triggerAtBlockStart: false,
      preFormat,
      format: (editor) => {
        insertEmptyCodeBlock(editor, {
          defaultType: getSlatePluginType(editor, ELEMENT_DEFAULT),
          insertNodesOptions: { select: true },
        });
      },
    },
  ],
};

const pluginsBasic = [
  // editor
  createReactPlugin(), // withReact
  createHistoryPlugin(), // withHistory

  // elements
  createParagraphPlugin(), // paragraph element
  createBlockquotePlugin(), // blockquote element
  createCodeBlockPlugin(), // code block element
  createHeadingPlugin(), // heading elements

  // marks
  createBoldPlugin(), // bold mark
  createItalicPlugin(), // italic mark
  createUnderlinePlugin(), // underline mark
  createStrikethroughPlugin(), // strikethrough mark
  createCodePlugin(), // code mark
];

const plugins = [
  ...pluginsBasic,
  createResetNodePlugin(optionsResetBlockTypePlugin),
  createSoftBreakPlugin(optionsSoftBreakPlugin),
  createExitBreakPlugin(optionsExitBreakPlugin),
  createAutoformatPlugin(optionsAutoformat),
  createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
  /**Toolbar */
  ...createBasicElementPlugins(),
  ...createBasicMarkPlugins(),
  createLinkPlugin(),
  createListPlugin(),
  createImagePlugin(),
  createTablePlugin(),
  createSelectOnBackspacePlugin({ allow: [ELEMENT_IMAGE] }),
  /**Custom plugins */
  createThematicBreakPlugin(),
];

function App() {
  const [value, setValue] = useState(null);
  const [markdownValue, setMarkdownValue] = useState(null);
  const [htmlValue, setHtmlValue] = useState("");
  const id = "slate-plugins-editor";
  //   const editor = pipe(
  //     createEditor(),
  //     withSlatePlugins({ id, plugins, options, components })
  //   );
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
    setHtmlValue(html);
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
                <ToolbarLinkElement /> <ToolbarImageElement />
              </li>
            </ul>
            {/* <ToolbarButtonsBasicElements />
          <ToolbarButtonsBasicMarks />
          <ToolbarButtonsList />
          <ToolbarLinkElement />
          <ToolbarImageElement />
          <ToolbarButtonsTable /> */}
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
      <div className="column">
        <h4>Markdown </h4>
        <pre style={{ height: "100px" }}>{markdownValue}</pre>
      </div>
    </div>
  );
}

export default App;
