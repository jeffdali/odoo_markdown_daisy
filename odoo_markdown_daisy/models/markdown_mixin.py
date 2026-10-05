# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class MarkdownMixin(models.AbstractModel):
    """
    Mixin that adds a `description_md` Text field pre-configured
    to render with the `markdown` widget.
    """
    _name = "web.markdown.mixin"
    _description = "Markdown Content Mixin"

    description_md = fields.Text(string="Description (Markdown)")
