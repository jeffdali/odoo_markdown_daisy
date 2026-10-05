# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class MarkdownTest(models.Model):
    """
    Demo model for testing the Markdown Field Widget and Preview Widget.
    """
    _name = "web.markdown.test"
    _description = "Markdown Field Test Record"

    name = fields.Char(string="Title", required=True, default="Demo Markdown")
    content = fields.Text(string="Content")
