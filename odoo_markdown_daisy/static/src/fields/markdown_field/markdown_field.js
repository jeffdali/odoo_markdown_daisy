/** @odoo-module **/
/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useBus } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useRecordObserver } from "@web/model/relational_model/utils";
import { formatText } from "@web/views/fields/formatters";
import { MarkdownEditor } from "../../components/markdown_editor/markdown_editor";

export class MarkdownField extends Component {
    static template = "odoo_markdown_daisy.MarkdownField";
    static components = {
        MarkdownEditor,
    };
    static props = {
        ...standardFieldProps,
    };

    setup() {
        this.state = useState({});
        useRecordObserver((record) => {
            this.state.initialValue = formatText(record.data[this.props.name]);
        });

        this.isDirty = false;
        this.editedValue = null;

        const { model } = this.props.record;
        if (model && model.bus) {
            useBus(model.bus, "WILL_SAVE_URGENTLY", () => this.commitChanges());
            useBus(model.bus, "NEED_LOCAL_CHANGES", ({ detail }) => {
                detail.proms.push(this.commitChanges());
            });
        }
    }

    handleChange(editedValue) {
        if (this.state.initialValue !== editedValue) {
            this.isDirty = true;
        } else {
            this.isDirty = false;
        }
        this.props.record.model.bus.trigger("FIELD_IS_DIRTY", this.isDirty);
        this.editedValue = editedValue;
    }

    async commitChanges() {
        if (!this.props.readonly && this.isDirty && this.editedValue !== null) {
            if (this.state.initialValue !== this.editedValue) {
                await this.props.record.update({ [this.props.name]: this.editedValue });
            }
            this.isDirty = false;
            this.props.record.model.bus.trigger("FIELD_IS_DIRTY", false);
        }
    }
}

export const markdownField = {
    component: MarkdownField,
    supportedTypes: ["text", "html"],
    additionalClasses: ["w-100", "d-block"],
};

registry.category("fields").add("markdown", markdownField);
registry.category("fields").add("daisy_markdown", markdownField);
registry.category("fields").add("odoo_markdown_daisy", markdownField);

