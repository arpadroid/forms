/**
 * @typedef {import('../../field').default} Field
 */
import { mergeObjects, handleZones, zoneMixin, getProperty, hasProperty, processTemplate } from '@arpadroid/tools';

const html = String.raw;
class FieldLabel extends HTMLLabelElement {
    static defaultConfig = {
        required: false,
        template: html`<span class="fieldLabel__text" zone="label">{label}</span>{required}`,
        requiredTemplate: html`<span class="fieldLabel__required">*</span>`,
        label: undefined
    };

    constructor(config = {}) {
        super();
        zoneMixin(this);
        this._config = mergeObjects(FieldLabel.defaultConfig, config);
    }

    getLabel() {
        return this.field?.getLabel() || getProperty(this, 'label') || '';
    }

    hasLabel() {
        return Boolean(this.getLabel() || this.field?.hasZone('label'));
    }

    isRequired() {
        return this.field?.isRequired() || hasProperty(this, 'required');
    }

    render() {
        const textNode = this.querySelector('.fieldLabel__text');

        if (textNode) {
            const label = this.getLabel();
            typeof label === 'string' && (textNode.innerHTML = label);
            return;
        }
        this.innerHTML = processTemplate(this._config.template, this.getTemplateVars());
    }

    connectedCallback() {
        this.field = /** @type {Field} */ (this.closest('.arpaField'));
        this.id = this.field?.getLabelId();
        this.field && this.setAttribute('for', this.field?.getHtmlId());
        this.render();
        this.labelNode = this.querySelector('.fieldLabel__text');
        this.classList.add('fieldLabel');
        handleZones();
        this._onRenderComplete();
    }

    disconnectedCallback() {
        this._onDestroy();
    }

    _onDestroy() {}

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
