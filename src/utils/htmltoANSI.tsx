interface ColorMapping {
  name: string;
  color: string; // ANSI code
  code: string; // HEX code
}

// Utility function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

export const htmlToAnsi = (
  FG: ColorMapping[],
  BG: ColorMapping[],
  html: string
): string => {
  // Create HEX → ANSI mappings
  const fgColorMap: Record<string, string> = {};
  const bgColorMap: Record<string, string> = {};

  FG.forEach(({ color, code }) => {
    fgColorMap[code.toLowerCase()] = `\u001b[${color}m`;
  });

  BG.forEach(({ color, code }) => {
    bgColorMap[code.toLowerCase()] = `\u001b[${color}m`;
  });

  return (
    "```ansi\n" +
    html
      // Convert <span> with hex color
      .replace(
        /<span style="color: (#[0-9A-Fa-f]{6})">(.*?)<\/span>/g,
        (_, hex, text) => {
          const ansiFg = fgColorMap[hex.toLowerCase()] || "";
          return ansiFg ? `${ansiFg}${text}\u001b[0m` : text;
        }
      )
      // Convert <span> with RGB color
      .replace(
        /<span style="color: rgb\((\d+),\s*(\d+),\s*(\d+)\)">(.*?)<\/span>/g,
        (_, r, g, b, text) => {
          const hex = rgbToHex(
            parseInt(r),
            parseInt(g),
            parseInt(b)
          ).toLowerCase();
          const ansiFg = fgColorMap[hex] || "";
          return ansiFg ? `${ansiFg}${text}\u001b[0m` : text;
        }
      )
      // Convert <mark> with hex color
      .replace(
        /<mark data-color="(#[0-9A-Fa-f]{6})" style="background-color: (#[0-9A-Fa-f]{6}); color: inherit">(.*?)<\/mark>/g,
        (_, hex, __, text) => {
          const ansiBg = bgColorMap[hex.toLowerCase()] || "";
          return ansiBg ? `${ansiBg}${text}\u001b[0m` : text;
        }
      )
      // Convert <mark> with RGB color
      .replace(
        /<mark data-color="rgb\((\d+),\s*(\d+),\s*(\d+)\)" style="background-color: rgb\((\d+),\s*(\d+),\s*(\d+)\); color: inherit">(.*?)<\/mark>/g,
        (_, r1, g1, b1, r2, g2, b2, text) => {
          const hex = rgbToHex(
            parseInt(r1),
            parseInt(g1),
            parseInt(b1)
          ).toLowerCase();
          const ansiBg = bgColorMap[hex] || "";
          return ansiBg ? `${ansiBg}${text}\u001b[0m` : text;
        }
      )
      // Handle <strong> (Bold Text)
      .replace(
        /<strong>(.*?)<\/strong>/g,
        (_, text) => `\u001b[1m${text}\u001b[0m`
      )
      // Handle <u> (Underline Text)
      .replace(/<u>(.*?)<\/u>/g, (_, text) => `\u001b[4m${text}\u001b[0m`)
      // Handle <br> tags (Newlines)
      .replace(/<br\s*\/?>/g, "\n")
      // Preserve <p> tags as newlines
      .replace(/<\/p>\s*<p>/g, "\n")
      // Remove <p> but keep content (fix multiline)
      .replace(/<\/?p>/g, "")
      // Remove remaining <span> tags
      .replace(/<\/?span[^>]*>/g, "") +
    "\n```"
  );
};
