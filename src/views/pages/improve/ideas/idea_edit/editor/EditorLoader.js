import { Editor } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Gapcursor from "@tiptap/extension-gapcursor";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import History from "@tiptap/extension-history";
import FontFamily from "@tiptap/extension-font-family";
import ListItem from "@tiptap/extension-list-item";
import Typography from "@tiptap/extension-typography";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";

import { Color } from "@tiptap/extension-color";
import {
  Indent,
  EventHandler,
  Heading,
  CustomTable,
  File,
  Comment,
  ExternalVideo,
  Paragraph,
  TrailingNode,
  CustomLink
} from "./extensions";

export default class ContentEditor {
  constructor(
    editable,
    value,
    options,
    fileHandlers,
    saveContent,
    commentHandlers,
    linkHandlers
  ) {
    this.editable = editable;
    this.content = value;
    this.options = options;
    this.fileHandlers = fileHandlers;
    this.extensions = [
      StarterKit.configure({
        history: false,
        paragraph: false,
        listItem: false,
        italic: false,
        bold: false
        // hardBreak: false
      }),
      Paragraph,
      // HardBreak.extend({
      //   addKeyboardShortcuts() {
      //     return {
      //       "Mod-Enter": () => this.editor.commands.addNewLine(),
      //       "Shift-Enter": () => this.editor.commands.addNewLine()
      //     };
      //   }
      // }),
      Italic.extend({
        addInputRules(){
          return []
        },
        addPasteRules(){
          return []
        }
      }),
      Bold.extend({
        addInputRules(){
          return []
        },
        addPasteRules(){
          return []
        }
      }),
      Typography.configure({
        oneHalf: false,
        oneQuarter: false,
        threeQuarters: false,
        laquo: false,
        raquo: false,
        plusMinus: false
      }),
      ListItem,
      History.configure({ depth: 10 }),
      FontFamily.configure({
        types: ["textStyle"]
      }),
      Text,
      // Draggable,
      CustomLink.configure({
        removeLink: linkHandlers.removeLink
      }),
      TextStyle,
      Color,
      Indent,
      Highlight,
      ExternalVideo,
      Underline,
      TableRow,
      TableHeader,
      TableCell,
      Gapcursor,
      Heading,
      CustomTable,
      EventHandler,
      TrailingNode,
      File.configure({
        addFile: fileHandlers.addFile,
        removeFile: fileHandlers.removeFile,
        notify: fileHandlers.notify
      }),
      Comment.configure({
        saveContent,
        ...commentHandlers
      })
    ];
    this.editor = this.getEditorInstance();
    this.dedupedCommentNodes = false;
  }

  getEditorInstance() {
    return new Editor({
      editable: this.editable,
      content: this.content,
      extensions: this.extensions,
      editorProps: {
        attributes: {
          id: "idea-edit-editor-container"
        },
        transformPastedText(text) {
          //Remove spaces
          //  console.log(text);
          const formatHTML = text.replace(/&nbsp;/g, " ");

          //Remove comments
          // const _formatHTML = formatHTML.replace(/ comment(.*?)">/g, ">");
          //  console.log(formatHTML)
          // console.log(_formatHTML)
          return formatHTML;
        },
        transformPastedHTML(html) {
          const formatHTML = html.replace(/&nbsp;/g, " ");

          //Remove comments
          //    const _formatHTML = formatHTML.replace(/ comment(.*?)">/g, ">");
          const __formatHTML = formatHTML.replace(/ style(.*?)">/g, ">");
          const ___formatHTML = __formatHTML.replace(/<br>/g, " ");

          // console.log(html);
          // console.log(___formatHTML)
          // console.log(_stylesRemoved)
          return ___formatHTML;
        }
      },

      onUpdate: ({ editor }) => {
        setTimeout(() => {
          editor.state.doc.descendants((node, pos, parent) => {
            if (
              ["orderedList", "bulletList", "listItem"].includes(node.type.name)
            ) {
              return true;
            }

            if (
              node.type.name === "paragraph" &&
              parent.type.name === "listItem" &&
              node.attrs.indent > 0
            ) {
              editor.view.dispatch(
                editor.state.tr.setNodeMarkup(pos, null, { indent: 0 })
              );
            }

            return false;
          });

          if (!this.dedupedCommentNodes) {
            this.dedupedCommentNodes = true;

            // console.log(editor.isActive("paragraph"));

            // console.log(editor.state.selection);
            //   const $cursor = editor.state.selection.$cursor;

            // console.log(editor)
            // console.log("cursor position:", $cursor.pos);
            // case delete from paragraph 1
            // insert node between
            // case backspace from comment
            //  const hadComment = editor.state.selection.$head.parent
            //    console.log($cursor)
            // if (editor && editor.isActive("comment")) {
            //   setTimeout(() => {
            //     this.editor.commands.transformComments(this.node);
            //   }, 300);
            // }
            // if (editor.isActive("comment")) {
            //   setTimeout(() =>
            //     // setTimeout(() => debouncedDedupeCommentNodes(editor))
            // //    setTimeout(() => debounceCommentNodes(editor))
            //   );
            // }
          }

          this.dedupedCommentNodes = false;

          const json = editor.getJSON();

          this.options.onUpdate(json);
        });
      },
      onTransaction: ({ editor }) => {
        // //  setTimeout(() => {
        //     const $cursor = editor.state.selection.$cursor;
        //     console.log("on transaction position:", $cursor);
        // //  }, 300);
      }

      // onFocus: ({ editor }) => {
      //   const json = editor.getJSON();
      //   this.options.onUpdate(json);
      // }
    });
  }

  *getExtensions() {
    for (const extension of this.extensions) {
      yield extension;
    }
  }

  get EditorInstance() {
    return this.editor;
  }
}
