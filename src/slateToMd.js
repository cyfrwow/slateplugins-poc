import escapeHtml from "escape-html";
import TYPES from "./types";

const serializeEach = (node) => {
  if (node.text) {
    const {
      pre,
      bold,
      italic,
      underline,
      code,
      strikethrough,
      deleted,
      inserted,
      autolink,
    } = node;
    const escape = escapeHtml(node.text);
    if (bold) return `\n**${escape}**`;
    if (italic) return `\n*${escape}*`;
    if (code) return `\n\`${escape}\``;
    if (strikethrough) return `\n~~${escape}~~`;
    if (deleted) return `\n~~${escape}~~`;
    if (inserted) return `\n__${escape}__`;
    if (underline) return `\n__${escape}__`;
    if (pre) return "\n```\n" + escape + "\n```";
    if (autolink) return "\n<" + escape + ">";
    return escape;
  }

  const children = node?.children?.map((n) => serializeEach(n)).join("");
  console.log(node);
  switch (node.type) {
    case TYPES.P:
      return `\n${children}\n`;
    case TYPES.BLOCKQUOTE:
      return `> ${children}\n`;
    case TYPES.UL:
      return children;
    case TYPES.OL:
      return children;
    case TYPES.OLI:
      return `1. ${children}\n`;
    case TYPES.LI:
      return `- ${children}\n`;
    case TYPES.H1:
      return `# ${children}\n`;
    case TYPES.H2:
      return `## ${children}\n`;
    case TYPES.H3:
      return `### ${children}\n`;
    case TYPES.H4:
      return `#### ${children}\n`;
    case TYPES.H5:
      return `##### ${children}\n`;
    case TYPES.H6:
      return `###### ${children}\n`;
    case TYPES.HR:
      return `---\n`;
    case TYPES.CODE:
      return "\n```\n" + children + "\n```";
    case TYPES.CODELINE:
      return `${children}\\n`;
    case TYPES.IMG:
      let title = node?.type;
      let src = node?.url;
      let alt = "alt default";
      return `![${title}](${src} "${alt}")`;
    default:
      return children;
  }
};

const serialize = (data = []) => {
  return data
    .map((node) => {
      let a = serializeEach(node);
      return a;
    })
    .join("");
};

export default serialize;
