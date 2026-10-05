/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

/**
 * Normalizes and extracts clean Markdown text.
 * When applied to fields.Html (such as project.task.description),
 * Odoo wraps content in <p>...</p> and escapes HTML entities.
 * This helper unwraps HTML envelopes and decodes entities so
 * CodeMirror and marked.js receive clean Markdown syntax.
 *
 * @param {string} val
 * @returns {string}
 */
export function cleanMarkdown(val) {
    if (!val || typeof val !== "string") {
        return "";
    }
    let str = val.trim();
    if (str.startsWith("<p") || str.startsWith("<div") || str.startsWith("<span") || /<[a-z][\s\S]*>/i.test(str)) {
        str = str
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, " ")
            .replace(/<span\s+data-o-mail-quote="[^"]*">/gi, "")
            .replace(/<\/span>/gi, "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<p[^>]*>/gi, "")
            .replace(/<div[^>]*>/gi, "");
    }
    return str.trim();
}
