/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

import { Component, markup } from "@odoo/owl";
import { cleanMarkdown } from "../../utils/markdown_utils";

export class MarkdownViewer extends Component {
    static template = "odoo_markdown_daisy.MarkdownViewer";
    static props = {
        value: { type: String, optional: true },
        maxLength: { type: Number, optional: true },
    };

    get renderedMarkdown() {
        let raw = cleanMarkdown(this.props.value || "");
        if (this.props.maxLength && raw.length > this.props.maxLength) {
            raw = raw.slice(0, this.props.maxLength) + "…";
        }
        if (window.marked && typeof window.marked.parse === "function") {
            try {
                return markup(window.marked.parse(raw));
            } catch (err) {
                console.error("Markdown parse error in MarkdownViewer:", err);
                return markup(raw);
            }
        }
        return markup(raw);
    }
}
