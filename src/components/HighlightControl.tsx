import { ColorSwatch, Tooltip } from "@mantine/core";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";

export default function HighlightControl({
  color,
  name
}: {
  color: string;
  name: string;
}) {
  const { editor } = useRichTextEditorContext();
  return (
    <Tooltip label={name}>
      <RichTextEditor.Control
        onClick={() =>
          editor?.chain().focus().toggleHighlight({ color: color }).run()
        }
        className={
          editor?.isActive("highlight", { color: color }) ? "is-active" : ""
        }
      >
        <ColorSwatch size={14} color={color} />
      </RichTextEditor.Control>
    </Tooltip>
  );
}
