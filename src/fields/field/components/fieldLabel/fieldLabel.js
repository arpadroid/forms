/**
 * @typedef {import('../../field').default} Field
 * @typedef {import('./fieldLabel.types').FieldLabelConfigType} FieldLabelConfigType
 */
import { defineCustomElement, attrString } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class FieldLabel extends ArpaElement {
    /** @type {FieldLabelConfigType} */
    _config = this._config;
    _initialize() {
        this.field = /** @type {Field} */ (this.closest('.arpaField'));
    }

    /**
     * Returns the default configuration for the field label.
     * @returns {FieldLabelConfigType}
     */
    getDefaultConfig() {
        /** @type {FieldLabelConfigType} */
        const config = {
            required: false,
            requiredTemplate: html`<span class="fieldLabel__required">*</span>`
        };
        return super.getDefaultConfig(config);
    }

    ////////////////////////
    // #region Get
    ////////////////////////

    getLabel() {
        return this.field?.getLabel() || this.getProperty('label') || '';
    }

    hasLabel() {
        return Boolean(this.getLabel() || this.field?.hasZone('label'));
    }

    isRequired() {
        return this.field?.isRequired() || this.hasProperty('required');
    }

    // #endregion Get

    ////////////////////////
    // #region Render
    ///////////////////////

    _preRender() {
        super._preRender();
        this.field = /** @type {Field} */ (this.closest('.arpaField'));
        this._id = this.field?.getLabelId();
    }

    _getTemplate() {
        return html`
            <label
                ${attrString({
                    class: 'fieldLabel',
                    for: this.field?.getHtmlId()
                })}
            >
                <span class="fieldLabel__text" zone="label">{label}</span>
                {requiredSign}
            </label>
        `;
    }

    getTemplateVars() {
        return {
            label: this.getLabel(),
            requiredSign: this.renderRequiredSign()
        };
    }

    renderRequiredSign() {
        return this.isRequired() ? html`<span class="fieldLabel__required">*</span>` : '';
    }

    async _initializeNodes() {
        this.labelNode = this.querySelector('.fieldLabel__text');
        return true;
    }
}

defineCustomElement('field-label', FieldLabel);

export default FieldLabel;
