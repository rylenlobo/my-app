"use client";
import { useState } from "react";
import { Button, Container, Title, Stack, Tooltip } from "@mantine/core";

import "@mantine/tiptap/styles.css";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { htmlToAnsi } from "@/utils/htmltoANSI";
import HighlightControl from "@/components/HighlightControl";
import Highlight from "@tiptap/extension-highlight";
import { RotateCcw } from "lucide-react";

const BG = [
  { name: "Firefly dark blue ", color: "40", code: "#002b36" },
  { name: "Orange ", color: "41", code: "#cb4b16" },
  { name: "Marble blue ", color: "42", code: "#586e75" },
  { name: "Greyish turquoise ", color: "43", code: "#657b83" },
  { name: "Gray ", color: "44", code: "#839496" },
  { name: "Indigo", color: "45", code: "#6c71c4" },
  { name: "Light gray", color: "46", code: "#93a1a1" },
  { name: "White background", color: "47", code: "#FFFFFF" }
];
const FG = [
  { name: "Gray", color: "30", code: "#808080" },
  { name: "Red", color: "31", code: "#FF0000" },
  { name: "Green", color: "32", code: "#00FF00" },
  { name: "Yellow", color: "33", code: "#FFFF00" },
  { name: "Blue", color: "34", code: "#0000FF" },
  { name: "Pink", color: "35", code: "#FF00FF" },
  { name: "Cyan", color: "36", code: "#00FFFF" },
  { name: "White", color: "37", code: "#FFFFFF" }
];

export default function TextEditor() {
  const [buttonText, setButtonText] = useState("Copy");

  const copyToClipboard = (htmlString: string) => {
    const text = htmlToAnsi(FG, BG, htmlString);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setButtonText("Copied!");
        setTimeout(() => setButtonText("Copy"), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const editor = useEditor({
    immediatelyRender: false,
    content: `<p>
    Ap<mark data-color='#002b36' style='background-color: #002b36; color: inherit'>ply</mark> 
    some co<mark data-color='#cb4b16' style='background-color: #cb4b16; color: inherit'>lors </mark> 
    to t<span style='color: #FFFF00'>hi</span>s 
    <span style='color: #00FF00'>text</span>
</p>`,

    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true })
    ]
  });

  return (
    <Container size="md" className=" h-dvh grid place-items-center">
      <Stack align="center">
        <Title>Create your text</Title>

        <RichTextEditor
          editor={editor}
          className="min-h-[300px] w-full lg:w-[800px] font-sans overflow-y-auto"
        >
          <RichTextEditor.Toolbar sticky>
            <Stack>
              {/* Bold and Italic */}
              <RichTextEditor.ControlsGroup>
                <Tooltip label="Reset">
                  <RichTextEditor.Control
                    onClick={() => {
                      const text = editor?.getText();
                      if (text) {
                        editor?.commands.setContent(`<p>${text}</p>`);
                      }
                    }}
                    aria-label="Reset Formatting"
                    title="Reset Formatting"
                  >
                    <RotateCcw size={14.5} />
                  </RichTextEditor.Control>
                </Tooltip>
                <Tooltip label="Bold">
                  <RichTextEditor.Bold />
                </Tooltip>
                <Tooltip label="Underline">
                  <RichTextEditor.Underline />
                </Tooltip>
              </RichTextEditor.ControlsGroup>

              {/* Text Color */}
              {/* Foreground Color */}
              <Stack>
                <RichTextEditor.ControlsGroup>
                  <span className="mr-2">Text Color</span>
                  {FG.map((color) => (
                    <Tooltip key={color.code} label={color.name}>
                      <RichTextEditor.Color color={color.code} />
                    </Tooltip>
                  ))}
                </RichTextEditor.ControlsGroup>

                {/* Background Color for Text */}
                <RichTextEditor.ControlsGroup>
                  <span className="mr-2">Background Color</span>
                  {BG.map((color) => (
                    <HighlightControl
                      key={color.code}
                      name={color.name}
                      color={color.code}
                    />
                  ))}
                </RichTextEditor.ControlsGroup>
              </Stack>
            </Stack>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>

        <Button
          onClick={() => {
            const html = editor?.getHTML();
            console.log(html);
            if (html) {
              copyToClipboard(html);
            }
          }}
          className="w-full max-w-[200px]"
        >
          {buttonText}
        </Button>
      </Stack>
    </Container>
  );
}
