interface ColorMapping {
  color: string;
  code: string;
}

export const htmlToAnsi = (
  FG: ColorMapping[],
  BG: ColorMapping[],
  html: string
): string => {
  // Create a map where HEX -> ANSI Code
  const fgColorMap: Record<string, string> = {};
  const bgColorMap: Record<string, string> = {};

  FG.forEach(({ color, code }) => {
    fgColorMap[code.toLowerCase()] = color;
  });

  BG.forEach(({ color, code }) => {
    bgColorMap[code.toLowerCase()] = color;
  });

  return (
    "```ansi\n" +
    html
      // Convert <span> (Foreground Text Colors)
      .replace(
        /<span style="color: (#[0-9A-Fa-f]{6})">(.*?)<\/span>/g,
        (match: string, color: string, text: string) => {
          const ansiColor = fgColorMap[color.toLowerCase()];
          return ansiColor ? `\x1b[${ansiColor}m${text}\x1b[0m` : text;
        }
      )
      // Convert <mark> (Background Highlighting)
      .replace(
        /<mark data-color="(#[0-9A-Fa-f]{6})" style="background-color: \1; color: inherit">(.*?)<\/mark>/g,
        (match: string, color: string, text: string) => {
          const ansiColor = bgColorMap[color.toLowerCase()];
          return ansiColor ? `\x1b[${ansiColor}m${text}\x1b[0m` : text;
        }
      )
      // Handle <strong> (Bold Text)
      .replace(
        /<strong>(.*?)<\/strong>/g,
        (match: string, text: string) => `\x1b[1m${text}\x1b[0m`
      )
      // Handle <u> (Underline Text)
      .replace(
        /<u>(.*?)<\/u>/g,
        (match: string, text: string) => `\x1b[4m${text}\x1b[0m`
      )
      // Handle <br> tags (Newlines)
      .replace(/<br\s*\/?\>/g, "\n")
      // Remove <p> tags (handles multiline content)
      .replace(/<p>([\s\S]*?)<\/p>/g, "$1")
      // Remove any remaining <span> tags
      .replace(/<\/?span[^>]*>/g, "")
      // Handle standalone newlines
      .replace(/\n/g, "\n") +
    "\n```"
  );
};
