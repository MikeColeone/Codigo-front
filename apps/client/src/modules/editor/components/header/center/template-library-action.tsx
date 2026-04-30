import { observer } from "mobx-react-lite";
import { EditorTemplateLibraryTrigger } from "@/modules/editor/components/template/editor-template-library-trigger";

export const TemplateLibraryAction = observer(function TemplateLibraryAction() {
  return <EditorTemplateLibraryTrigger />;
});
