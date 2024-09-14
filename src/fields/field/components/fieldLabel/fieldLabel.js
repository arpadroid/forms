/**
 * @typedef {import('../../field').default} Field
 */

import { mergeObjects, CustomElementTool, handleSlots } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';

const { getProperty, hasProperty } = CustomElementTool;
const html = String.raw;
class FieldLabel extends HTMLLabelElement {
    static defaultConfig = {
        required: false,
        template: html`<span class="fieldLabel__text">{label}</span>{required}`,
        requiredTemplate: html`<span class="fieldLabel__required">*</span>`,
        label: undefined
    };

    constructor(config = {}) {
        super();
        this._config = mergeObjects(FieldLabel.defaultConfig, config);
    }

    getLabel() {
        return this.field?.getLabel() || getProperty(this, 'label') || '';
    }

    hasLabel() {
        return Boolean(this.getLabel() || this.field?.hasSlot('label'));
    }

    isRequired() {
        return this.field?.isRequired() || hasProperty(this, 'required');
    }

    render() {
        const textNode = this.querySelector('.fieldLabel__text');

        if (textNode) {
            const label = this.getLabel();
            if (label) {
                textNode.innerHTML = label;
            }
            return;
        }
        this.innerHTML = I18nTool.processTemplate(this._config.template, this.getTemplateVars());
    }

    connectedCallback() {
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.id = this.field?.getLabelId();
        this.field && this.setAttribute('for', this.field?.getHtmlId());
        this.render();
        this.labelNode = this.querySelector('.fieldLabel__text');
        this.classList.add('fieldLabel');
        this.setAttribute('slot', 'label');
        handleSlots(() => this._onRenderComplete());
    }

    _onRenderComplete() {}

    getTemplateVars() {
        return {
            label: this.getLabel(),
            required: this.isRequired() && this._config.requiredTemplate
        };
    }
}

customElements.define('field-label', FieldLabel, { extends: 'label' });

export default FieldLabel;
