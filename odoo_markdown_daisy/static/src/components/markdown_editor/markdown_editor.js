/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

import { Component, useRef, onMounted, onWillUnmount, useEffect, markup } from "@odoo/owl";
import { cleanMarkdown } from "../../utils/markdown_utils";

export class MarkdownEditor extends Component {
    static template = "odoo_markdown_daisy.MarkdownEditor";
    static props = {
        value: { type: String, optional: true },
        readonly: { type: Boolean, optional: true },
        onChange: { type: Function, optional: true },
        onValueChange: { type: Function, optional: true },
        onBlur: { type: Function, optional: true },
    };

    setup() {
        this.textareaRef = useRef("textarea");
        this.easyMDE = null;
        this._isSettingValue = false;

        onMounted(() => {
            if (!this.props.readonly) {
                this._initEditor();
            }
        });

        useEffect(
            () => {
                if (this.props.readonly) {
                    if (this.easyMDE) {
                        this._destroyEditor();
                    }
                } else {
                    if (!this.easyMDE) {
                        this._initEditor();
                    } else {
                        const cm = this.easyMDE.codemirror;
                        // Never overwrite editor while the user is actively typing / focused!
                        if (cm && cm.hasFocus()) {
                            return;
                        }
                        const currentVal = this.easyMDE.value();
                        const nextVal = cleanMarkdown(this.props.value || "");
                        if (currentVal !== nextVal) {
                            this._isSettingValue = true;
                            const cursor = cm ? cm.getCursor() : null;
                            this.easyMDE.value(nextVal);
                            if (cm && cursor) {
                                try {
                                    cm.setCursor(cursor);
                                } catch (_) {}
                            }
                            this._isSettingValue = false;
                        }
                    }
                }
            },
            () => [this.props.readonly, this.props.value]
        );

        onWillUnmount(() => {
            this._destroyEditor();
        });
    }

    get renderedMarkdown() {
        const raw = cleanMarkdown(this.props.value || "");
        if (window.marked && typeof window.marked.parse === "function") {
            try {
                return markup(window.marked.parse(raw));
            } catch (err) {
                console.error("Markdown parse error:", err);
                return markup(raw);
            }
        }
        return markup(raw);
    }

    _initEditor() {
        if (!this.textareaRef.el || this.easyMDE) {
            return;
        }
        if (!window.EasyMDE) {
            console.warn("EasyMDE library is not loaded on window.");
            return;
        }

        try {
            this.easyMDE = new window.EasyMDE({
                element: this.textareaRef.el,
                initialValue: cleanMarkdown(this.props.value || ""),
                spellChecker: false,
                status: false,
                autosave: { enabled: false },
                autoDownloadFontAwesome: false,
                lineWrapping: true,
                direction: "ltr",
                codeMirrorConfig: {
                    lineWrapping: true,
                    direction: "ltr",
                    rtlMoveVisually: false,
                },
                toolbarButtonClassPrefix: "mde-btn",
                toolbar: [
                    {
                        name: "bold",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const selection = cm.getSelection();
                            if (selection.length > 0) {
                                const match = selection.match(/^(\s*)([\s\S]*?)(\s*)$/);
                                if (match && match[2]) {
                                    cm.replaceSelection(`${match[1]}**${match[2]}**${match[3]}`);
                                } else {
                                    cm.replaceSelection(`**${selection.trim()}**`);
                                }
                            } else {
                                const cursor = cm.getCursor();
                                cm.replaceSelection("**Bold text**");
                                cm.setSelection({ line: cursor.line, ch: cursor.ch + 2 }, { line: cursor.line, ch: cursor.ch + 11 });
                            }
                            cm.focus();
                        },
                        className: "fa fa-bold",
                        title: "Bold",
                    },
                    {
                        name: "italic",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const selection = cm.getSelection();
                            if (selection.length > 0) {
                                const match = selection.match(/^(\s*)([\s\S]*?)(\s*)$/);
                                if (match && match[2]) {
                                    cm.replaceSelection(`${match[1]}*${match[2]}*${match[3]}`);
                                } else {
                                    cm.replaceSelection(`*${selection.trim()}*`);
                                }
                            } else {
                                const cursor = cm.getCursor();
                                cm.replaceSelection("*Italic text*");
                                cm.setSelection({ line: cursor.line, ch: cursor.ch + 1 }, { line: cursor.line, ch: cursor.ch + 12 });
                            }
                            cm.focus();
                        },
                        className: "fa fa-italic",
                        title: "Italic",
                    },
                    {
                        name: "heading",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const cursor = cm.getCursor();
                            const line = cm.getLine(cursor.line) || "";
                            if (/^###\s+/.test(line)) {
                                cm.replaceRange(line.replace(/^###\s+/, ""), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else if (/^##\s+/.test(line)) {
                                cm.replaceRange("### " + line.slice(3), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else if (/^#\s+/.test(line)) {
                                cm.replaceRange("## " + line.slice(2), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else {
                                cm.replaceRange("# " + line, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            }
                            cm.focus();
                        },
                        className: "fa fa-header",
                        title: "Heading",
                    },
                    "|",
                    {
                        name: "quote",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const cursor = cm.getCursor();
                            const line = cm.getLine(cursor.line) || "";
                            if (line.trim().length === 0) {
                                cm.replaceRange("> ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                                cm.setCursor({ line: cursor.line, ch: 2 });
                            } else if (line.startsWith("> ")) {
                                cm.replaceRange(line.slice(2), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else {
                                cm.replaceRange("> " + line, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            }
                            cm.focus();
                        },
                        className: "fa fa-quote-left",
                        title: "Quote",
                    },
                    {
                        name: "unordered-list",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const cursor = cm.getCursor();
                            const line = cm.getLine(cursor.line) || "";
                            if (line.trim().length === 0) {
                                cm.replaceRange("- ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                                cm.setCursor({ line: cursor.line, ch: 2 });
                            } else if (/^[-*+]\s+/.test(line)) {
                                cm.replaceRange(line.replace(/^[-*+]\s+/, ""), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else {
                                cm.replaceRange("- " + line, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            }
                            cm.focus();
                        },
                        className: "fa fa-list-ul",
                        title: "Generic List",
                    },
                    {
                        name: "ordered-list",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const cursor = cm.getCursor();
                            const line = cm.getLine(cursor.line) || "";
                            if (line.trim().length === 0) {
                                cm.replaceRange("1. ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                                cm.setCursor({ line: cursor.line, ch: 3 });
                            } else if (/^\d+\.\s+/.test(line)) {
                                cm.replaceRange(line.replace(/^\d+\.\s+/, ""), { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            } else {
                                cm.replaceRange("1. " + line, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
                            }
                            cm.focus();
                        },
                        className: "fa fa-list-ol",
                        title: "Numbered List",
                    },
                    "|",
                    {
                        name: "link",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const selection = cm.getSelection();
                            if (selection.length > 0) {
                                cm.replaceSelection(`[${selection}](https://example.com)`);
                            } else {
                                const cursor = cm.getCursor();
                                cm.replaceSelection("[Link title](https://example.com)");
                                cm.setSelection({ line: cursor.line, ch: cursor.ch + 1 }, { line: cursor.line, ch: cursor.ch + 11 });
                            }
                            cm.focus();
                        },
                        className: "fa fa-link",
                        title: "Create Link",
                    },
                    {
                        name: "image",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const selection = cm.getSelection();
                            if (selection.length > 0) {
                                cm.replaceSelection(`![${selection}](https://example.com/image.png)`);
                            } else {
                                const cursor = cm.getCursor();
                                cm.replaceSelection("![Image description](https://example.com/image.png)");
                                cm.setSelection({ line: cursor.line, ch: cursor.ch + 2 }, { line: cursor.line, ch: cursor.ch + 19 });
                            }
                            cm.focus();
                        },
                        className: "fa fa-picture-o",
                        title: "Insert Image",
                    },
                    {
                        name: "table",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const cursor = cm.getCursor();
                            const line = cm.getLine(cursor.line) || "";
                            const tableTpl = "| Column 1 | Column 2 |\n| :--- | :--- |\n| Value 1 | Value 2 |\n";
                            if (line.trim().length > 0) {
                                cm.replaceSelection("\n\n" + tableTpl);
                            } else {
                                cm.replaceSelection(tableTpl);
                            }
                            cm.focus();
                        },
                        className: "fa fa-table",
                        title: "Insert Table",
                    },
                    {
                        name: "code-block",
                        action: (editor) => {
                            const cm = editor.codemirror;
                            const selection = cm.getSelection();
                            if (selection.length > 0) {
                                cm.replaceSelection("```\n" + selection + "\n```\n");
                            } else {
                                const cursor = cm.getCursor();
                                const lineContent = cm.getLine(cursor.line) || "";
                                if (lineContent.trim().length > 0) {
                                    cm.replaceSelection("\n```\n\n```\n");
                                    cm.setCursor(cursor.line + 2, 0);
                                } else {
                                    cm.replaceSelection("```\n\n```\n");
                                    cm.setCursor(cursor.line + 1, 0);
                                }
                            }
                            cm.focus();
                        },
                        className: "fa fa-code",
                        title: "Code Block",
                    },
                    "|",
                    "preview",
                    "side-by-side",
                    "fullscreen",
                    "|",
                    "guide",
                ],
                renderingConfig: {
                    singleLineBreaks: false,
                    codeSyntaxHighlighting: true,
                },
                previewRender: (plainText) => {
                    const clean = cleanMarkdown(plainText || "");
                    if (window.marked && typeof window.marked.parse === "function") {
                        try {
                            return window.marked.parse(clean);
                        } catch (e) {
                            console.error("Markdown parse error in previewRender:", e);
                            return clean;
                        }
                    }
                    return clean;
                },
            });

            if (this.easyMDE.gui && this.easyMDE.gui.toolbar) {
                this.easyMDE.gui.toolbar.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                });
            }


            this.easyMDE.codemirror.on("change", () => {
                if (this._isSettingValue) {
                    return;
                }
                const newValue = this.easyMDE.value();
                if (this.props.onChange) {
                    this.props.onChange(newValue);
                } else if (this.props.onValueChange) {
                    this.props.onValueChange(newValue);
                }
            });

            this.easyMDE.codemirror.on("blur", () => {
                if (this.props.onBlur) {
                    this.props.onBlur();
                }
            });
        } catch (err) {
            console.error("Failed to initialize EasyMDE:", err);
        }
    }



    _destroyEditor() {
        if (this.easyMDE) {
            try {
                this.easyMDE.toTextArea();
            } catch (_) {
                // Ignore cleanup errors during unmounting
            }
            this.easyMDE = null;
        }
    }
}

