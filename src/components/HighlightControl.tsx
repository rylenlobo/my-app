import { ColorSwatch } from "@mantine/core";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";

export default function HighlightControl({ color }: { color: string }) {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() =>
        editor?.chain().focus().toggleHighlight({ color: color }).run()
      }
      className={
        editor?.isActive("highlight", { color: color }) ? "is-active" : ""
      }
      aria-label="Insert star emoji"
      title="Highlight Text"
    >
      <ColorSwatch size={14} color={color} />
    </RichTextEditor.Control>
  );
}
