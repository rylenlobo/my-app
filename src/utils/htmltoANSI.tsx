interface ColorMapping {
  name: string;
  color: string; // ANSI code
  code: string; // HEX code
}

// Utility function to check if string is a valid hex color
const isHexColor = (value: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/i.test(value);
};

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
  // Color mappings setup remains the same
  const fgColorMap: Record<string, string> = {};
  const bgColorMap: Record<string, string> = {};

  FG.forEach(({ color, code }) => {
    if (isHexColor(code)) {
      fgColorMap[code.toLowerCase()] = `\u001b[${color}m`;
    }
  });

  BG.forEach(({ color, code }) => {
    if (isHexColor(code)) {
      bgColorMap[code.toLowerCase()] = `\u001b[${color}m`;
    }
  });

  // Process innermost tags first, then outer tags
  return (
    "```ansi\n" +
    html
      // Handle <strong> (Bold Text)
      .replace(
        /<strong>(.*?)<\/strong>/g,
        (_, text) => `\u001b[1m${text}\u001b[22m`
      )
      // Handle <u> (Underline Text)
      .replace(/<u>(.*?)<\/u>/g, (_, text) => `\u001b[4m${text}\u001b[24m`)
      // Convert <span> with RGB color (text color)
      .replace(
        /<span style="color: rgb\((\d+),\s*(\d+),\s*(\d+)\)">(.*?)<\/span>/g,
        (_, r, g, b, text) => {
          const hex = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
          if (!isHexColor(hex)) return text;
          const ansiFg = fgColorMap[hex.toLowerCase()] || "";
          return ansiFg ? `${ansiFg}${text}\u001b[39m` : text; // Only reset foreground
        }
      )
      // Convert <span> with hex color (text color)
      .replace(
        /<span style="color: (#[0-9A-Fa-f]{6})">(.*?)<\/span>/g,
        (_, hex, text) => {
          if (!isHexColor(hex)) return text;
          const ansiFg = fgColorMap[hex.toLowerCase()] || "";
          return ansiFg ? `${ansiFg}${text}\u001b[39m` : text; // Only reset foreground
        }
      )
      // Convert <mark> with RGB color (background)
      .replace(
        /<mark data-color="rgb\((\d+),\s*(\d+),\s*(\d+)\)" style="background-color: rgb\((\d+),\s*(\d+),\s*(\d+)\); color: inherit">(.*?)<\/mark>/g,
        (_, r1, g1, b1, r2, g2, b2, text) => {
          const hex = rgbToHex(parseInt(r1), parseInt(g1), parseInt(b1));
          if (!isHexColor(hex)) return text;
          const ansiBg = bgColorMap[hex.toLowerCase()] || "";
          return ansiBg ? `${ansiBg}${text}\u001b[49m` : text; // Only reset background
        }
      )
      // Convert <mark> with hex color (background)
      .replace(
        /<mark data-color="(#[0-9A-Fa-f]{6})" style="background-color: (#[0-9A-Fa-f]{6}); color: inherit">(.*?)<\/mark>/g,
        (_, hex, __, text) => {
          if (!isHexColor(hex)) return text;
          const ansiBg = bgColorMap[hex.toLowerCase()] || "";
          return ansiBg ? `${ansiBg}${text}\u001b[49m` : text; // Only reset background
        }
      )
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
