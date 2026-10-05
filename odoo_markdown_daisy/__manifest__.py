# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

# Bundled external library source URLs (for manual maintenance / audit):
# - marked.js (^14.0.0):
#   https://cdn.jsdelivr.net/npm/marked/marked.min.js
# - EasyMDE (^2.18.0):
#   https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js
#   https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css

{
    "name": "Odoo Markdown Daisy",
    "summary": "Full-featured Markdown field widget and preview viewer for Odoo 18 and 19 (Daisy Series)",
    "description": """
Odoo Markdown Daisy (Daisy Series)
==================================
Provides an OWL 2 field widget that allows editing Text/Html fields using EasyMDE,
and rendering formatted Markdown (using marked.js) in read-only and list/kanban views.

Features:
- Full Markdown editor in form edit mode (EasyMDE).
- Safe HTML rendering in read-only mode (marked.js + OWL markup).
- Compact preview field widget (`daisy_markdown_preview` / `markdown_preview`) with character truncation for list/kanban.
- Pre-configured `web.markdown.mixin` for easy integration into custom models.
- Zero external CDN dependencies (all assets bundled locally).
- Full Bootstrap 5 and Dark Mode styling support.
    """,
    # Using semantic version "1.0.0" allows Odoo 18 to adapt to "18.0.1.0.0"
    # and Odoo 19 to adapt to "19.0.1.0.0" automatically.
    "version": "18.0.1.0.0",
    "category": "Technical",
    "author": "Jaafar Ali",
    "website": "https://github.com/jeffdali/odoo_markdown_daisy",
    "support": "jaafar.ali.in@gmail.com",
    "license": "LGPL-3",
    "images": [
        "static/description/banner.png",
    ],
    "depends": [
        "base",
        "web",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/markdown_demo_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "odoo_markdown_daisy/static/lib/easymde/easymde.min.css",
            "odoo_markdown_daisy/static/lib/easymde/easymde.min.js",
            "odoo_markdown_daisy/static/lib/marked/marked.min.js",
            "odoo_markdown_daisy/static/src/scss/markdown_widget.scss",
            "odoo_markdown_daisy/static/src/utils/**/*.js",
            "odoo_markdown_daisy/static/src/components/**/*.js",
            "odoo_markdown_daisy/static/src/components/**/*.xml",
            "odoo_markdown_daisy/static/src/fields/**/*.js",
            "odoo_markdown_daisy/static/src/fields/**/*.xml",
        ],
    },
    "installable": True,
    "auto_install": False,
    "application": False,
}
