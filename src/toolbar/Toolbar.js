import {
  ToolbarButtonsBasicElements,
  ToolbarButtonsBasicMarks,
  ToolbarButtonsList,
  ToolbarLinkElement,
  ToolbarImageElement,
  ToolbarButtonsTable,
} from "./index";
export const Toolbar = () => {
  return (
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
  );
};
