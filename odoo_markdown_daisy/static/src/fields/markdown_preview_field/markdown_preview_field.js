/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

import { Component, markup } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { MarkdownPreviewDialog } from "../../components/markdown_preview_dialog/markdown_preview_dialog";
import { cleanMarkdown } from "../../utils/markdown_utils";

export class MarkdownPreviewField extends Component {
    static template = "odoo_markdown_daisy.MarkdownPreviewField";
    static props = {
        ...standardFieldProps,
    };

    setup() {
        this.dialogService = useService("dialog");
    }

    get rawValue() {
        return cleanMarkdown(this.props.record.data[this.props.name] || "");
    }

    get hasContent() {
        return Boolean(this.rawValue && this.rawValue.trim().length > 0);
    }

    get plainSnippet() {
        const raw = this.rawValue;
        if (!raw) {
            return "";
        }
        const plain = raw
            .replace(/^#+\s+/gm, "")
            .replace(/(\*\*|__)(.*?)\1/g, "$2")
            .replace(/(\*|_)(.*?)\1/g, "$2")
            .replace(/`{3}[\s\S]*?`{3}/g, "[Code]")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
            .replace(/^>\s+/gm, "")
            .replace(/[-*+]\s+/g, "• ")
            .replace(/\n+/g, " ")
            .trim();
        return plain;
    }

    get renderedPreview() {
        const raw = this.rawValue;
        if (!raw) {
            return "";
        }
        const truncated = raw.length > 200 ? raw.slice(0, 200) + "…" : raw;
        if (window.marked && typeof window.marked.parse === "function") {
            try {
                return markup(window.marked.parse(truncated));
            } catch (err) {
                console.error("Markdown preview parse error:", err);
                return markup(this.plainSnippet);
            }
        }
        return markup(this.plainSnippet);
    }

    openPreviewDialog(ev) {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }
        const recordName = this.props.record.data.display_name || this.props.record.data.name || "";
        const fieldString = this.props.record.fields[this.props.name]?.string || "Markdown";
        const title = recordName ? `${recordName} - ${fieldString} Preview` : `${fieldString} Preview`;

        this.dialogService.add(MarkdownPreviewDialog, {
            title,
            content: this.rawValue,
        });
    }
}

export const markdownPreviewField = {
    component: MarkdownPreviewField,
    supportedTypes: ["text", "html"],
};

registry.category("fields").add("markdown_preview", markdownPreviewField);
registry.category("fields").add("daisy_markdown_preview", markdownPreviewField);
registry.category("fields").add("odoo_markdown_daisy_preview", markdownPreviewField);
registry.category("fields").add("list.markdown_preview", markdownPreviewField);
registry.category("fields").add("list.daisy_markdown_preview", markdownPreviewField);
registry.category("fields").add("kanban.markdown_preview", markdownPreviewField);
registry.category("fields").add("kanban.daisy_markdown_preview", markdownPreviewField);
registry.category("fields").add("list.markdown", markdownPreviewField);
registry.category("fields").add("list.daisy_markdown", markdownPreviewField);
registry.category("fields").add("kanban.markdown", markdownPreviewField);
registry.category("fields").add("kanban.daisy_markdown", markdownPreviewField);
