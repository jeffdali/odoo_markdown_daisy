/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

import { Component } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { MarkdownViewer } from "../markdown_viewer/markdown_viewer";

export class MarkdownPreviewDialog extends Component {
    static template = "odoo_markdown_daisy.MarkdownPreviewDialog";
    static components = {
        Dialog,
        MarkdownViewer,
    };
    static props = {
        title: { type: String, optional: true },
        content: { type: String, optional: true },
        close: { type: Function },
    };
    static defaultProps = {
        title: "Markdown Preview",
        content: "",
    };
}
