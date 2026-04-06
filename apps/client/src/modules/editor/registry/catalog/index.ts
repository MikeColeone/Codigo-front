import type { TComponentTypes } from "@codigo/schema";
import type { EditorComponentMeta } from "../types";
import { basicEditorComponents } from "./basic";
import { formEditorComponents } from "./form";
import { reportEditorComponents } from "./report";

export const editorComponentCatalog: EditorComponentMeta[] = [
  ...basicEditorComponents,
  ...formEditorComponents,
  ...reportEditorComponents,
];

export const editorComponentMap = Object.fromEntries(
  editorComponentCatalog.map((item) => [item.type, item]),
) as Partial<Record<TComponentTypes, EditorComponentMeta>>;
