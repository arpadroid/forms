/**
 * @typedef {import('../../components/form/form').default} FormComponent
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 */
import { $attr, defineCustomElement, dummyListener, dummySignal, mergeObjects } from '@arpadroid/tools';
import { observerMixin, mapHTML } from '@arpadroid/tools';
import FieldValidator from '../../utils/fieldValidator.js';
import { I18n } from '@arpadroid/i18n';
import { ArpaElement } from '@arpadroid/ui';
const html = String.raw;
class Field extends ArpaElement {
    _validations = ['required', 'minLength', 'maxLength', 'size'];
    /** @type {FieldConfigType} */
    _config = this._config;
    touched = false;
    /** @type {string[]} */
    errorMessages = [];

    ////////////////////////////////
    // #region Initialization
    ////////////////////////////////

    /**
     * @param {FieldConfigType} config - The configuration object for the element.
     * @throws {Error} If the field does not have an id.
     */
    constructor(config) {
        super(config);
        this.form = this.getForm();
        this.on = dummyListener;
        this.signal = dummySignal;
        observerMixin(this);
        this.classList.add('arpaField');
        const id = this.getId();
        if (!id) throw new Error('Field must have an id');
    }

    /**
     * Returns default config.
     * @returns {FieldConfigType}
     */
    getDefaultConfig() {
        /** @type {FieldConfigType} */
        const config = {
            inputTemplate: html`<field-input {inputAttr}></field-input>`,
            validator: FieldValidator,
            hasInputMask: true,
            className: 'arpaField',
            inputComponent: 'field-input',
            inputTag: 'input',
            inputType: 'text',
            tooltipPosition: 'bottom-right'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Sets the configuration for the field.
     * @param {FieldConfigType} config
     */
    setConfig(config) {
        this._initializeI18n();
        super.setConfig(config);
    }

    _printAttributes() {
        super._printAttributes();
        if (this.id) {
            this._id = this.id;
            this.removeAttribute('id');
        }
    }

    // #endregion Initialization

    /////////////////////////////
    // #region i18n
    ////////////////////////////

    /**
     * Initializes internationalization for the field.
     */
    _initializeI18n() {
        this._i18n = this._getI18n();
    }

    /**
     * Prepares the i18n object for the field.
     * @returns {Record<string, unknown>} The i18n object.
     */
    _getI18n() {
        const type = this.getFieldType();
        this.i18nKey = `forms.fields.${type}`;
        this.i18nFieldKey = 'forms.field';
        const typePayload = I18n.get(this.i18nKey);
        const fieldPayload = I18n.get(this.i18nFieldKey);
        return mergeObjects(fieldPayload, typePayload);
    }

    /**
     * Returns the i18n text for the specified key.
     * @param {string} key
     * @param {Record<string, string>} [replacements]
     * @param {string} [base]
     * @returns {string}
     */
    i18nText(key, replacements, base = this.i18nFieldKey) {
        return super.i18nText(key, replacements) || super.i18nText(key, replacements, base);
    }

    /**
     * Returns a i18n component for the specified key.
     * @param {string} key - The key for the i18n component.
     * @param {Record<string, string>} [replacements]
     * @param {Record<string, string>} [attributes]
     * @param {string} [base] - The base key for the i18n component.
     * @returns {string} The i18n component.
     */
    i18n(key, replacements, attributes, base = this.i18nFieldKey) {
        return super.i18n(key, replacements) || super.i18n(key, replacements, attributes, base);
    }

    // #endregion

    //////////////////////////
    // #region Rendering
    //////////////////////////

    /**
     * Returns the template variables for the field.
     * @returns {Record<string, unknown>} The template variables.
     */
    getTemplateVars() {
        return {
            id: this.getHtmlId(),
            labelId: this.getLabelId(),
            value: this.getValue()?.toString().trim(),
            inputTag: this.getProp('inputTag')
        };
    }

    /**
     * Sets the errors for the field.
     * @param {string[]} errors - An array of error messages.
     * @param {boolean} [update] - Indicates whether to update the errors immediately.
     */
    setErrors(errors = [], update = true) {
        if (!Array.isArray(errors)) {
            errors = [];
        }
        this.errorMessages = errors;
        if (update) {
            this.updateErrors();
        }
    }

    $renderBlueprint() {
        return html`
            <arpa-node name="header">
                <arpa-node name="labelWrapper" tag="label" for="{id}" can-render="label">
                    <arpa-node name="labelIcon" tag="arpa-icon"></arpa-node>
                    <arpa-node tag="span" name="label" id="{labelId}"></arpa-node>
                    <arpa-node tag="span" name="requiredSign" can-render="{required}">*</arpa-node>
                </arpa-node>

                <arpa-node
                    name="errors"
                    class="arpaField__tooltip"
                    variant="error"
                    tag="arpa-tooltip"
                    icon="block"
                    position="bottom-right"
                    arrow="false"
                >
                    <ul class="arpaField__errorList" zone-name="errors">
                        {renderErrors()}
                    </ul>
                </arpa-node>

                <arpa-node name="tooltip" variant="info" tag="arpa-tooltip" icon="info" position="{tooltipPosition}"></arpa-node>
            </arpa-node>
            <arpa-node name="subHeader"></arpa-node>
            <arpa-node name="body">
                <arpa-node name="description" tag="p" can-render="description"></arpa-node>
                {beforeInput}
                <arpa-node name="inputWrapper">
                    <arpa-node name="readOnly" class="arpaField__readOnly arpaField__input" can-render="readOnly">
                        {value}
                    </arpa-node>

                    <arpa-node
                        name="input"
                        tag="{inputTag}"
                        type="{inputType}"
                        id="{id}"
                        name="{getId()}"
                        placeholder="{placeholder}"
                        value="{value}"
                        on-focus="{_onFocus}"
                        on-input="{_callOnChange}"
                        on-change="{onChange}"
                        can-render="!readOnly"
                        aria-labelledby="{labelId}"
                        ${$attr(this._config.inputAttributes || {})}
                    ></arpa-node>
                    <arpa-node name="inputRhs"></arpa-node>
                    <arpa-node name="inputMask" can-render="hasInputMask()">
                        <arpa-node name="inputMaskLhs" can-render="icon">
                            <arpa-node tag="label" name="iconLabel" for="{id}" can-render="icon">
                                <arpa-node name="icon" tag="arpa-icon"></arpa-node>
                            </arpa-node>
                        </arpa-node>
                        <arpa-node name="inputMaskRhs">
                            <arpa-node tag="label" name="rhsIconLabel" for="{id}" can-render="iconRight">
                                <arpa-node name="iconRight" tag="arpa-icon"></arpa-node>
                            </arpa-node>
                        </arpa-node>
                    </arpa-node>
                </arpa-node>
                {afterInput}
            </arpa-node>
            <arpa-node name="footer" can-render="footnote">
                <arpa-node name="footnote" tag="p" can-render="footnote"></arpa-node>
            </arpa-node>
        `;
    }

    $renderTemplate() {
        return html`{header}{subHeader}{body}{footer}`;
    }

    // #endregion

    /////////////////////////////
    // #region Lifecycle
    ////////////////////////////

    async $initializeNodes() {
        await super.$initializeNodes();
        this.inputMask = /** @type {HTMLElement} */ (this.nodes.inputMask);
        this.inputWrapper = /** @type {HTMLElement} */ (this.nodes.inputWrapper);
        this.label = /** @type {HTMLLabelElement} */ (this.nodes.label);
        this.headerNode = /** @type {HTMLElement} */ (this.nodes.header);
        this.bodyNode = /** @type {HTMLElement} */ (this.nodes.body);
        this.tooltip = /** @type {Tooltip | null} */ (this.nodes.tooltip);
        this.input = /** @type {HTMLInputElement} */ (this.nodes.input);
        this.errors = /** @type {Tooltip | null} */ (this.nodes.errors);
        this.touched = false;
        return true;
    }

    async $onConnected() {
        await this.waitForArpaNodes();
        this.initializeField();

        return true;
    }

    initializeField() {
        if (this.fieldInitialized) {
            return;
        }
        this.form = this.getForm();
        if (!this.form) return;
        this.form.registerField(this);
        this._initializeValue();
        this.initializeValidation();
        this.fieldInitialized = true;
    }

    // async $onConnected() {}

    async $onComplete() {
        this.initializeField();
        return true;
    }

    /**
     * Initializes the value for the field.
     * @param {unknown} value
     */
    _initializeValue(value = this.getProp('value')) {
        if (typeof value === 'undefined') {
            value = this.getProp('default-value');
        }
        if (typeof value !== 'undefined') {
            this.setValue(value);
        }
    }

    static get observedAttributes() {
        return ['value'];
    }

    // #endregion Lifecycle

    /////////////////////////////
    // #region Validation
    ////////////////////////////

    /**
     * Initializes the validation for the field.
     */
    initializeValidation() {
        const { validator } = this._config;
        if (validator && !this.validator) {
            /** @type {FieldValidator} */
            this.validator = new validator(this);
        }
    }

    /**
     * Validates the field.
     * @param {unknown} value
     * @param {boolean} update - Whether to update the field's state.
     * @returns {boolean}
     */
    validate(value = this.getValue(), update = true) {
        const isValid = this._validate(value);
        if (this._hasRendered && (this.touched || this.form?.touched)) {
            if (isValid) {
                this.classList.remove('arpaField--hasError');
            } else {
                this.classList.add('arpaField--hasError');
            }
            update && (this._isValid = isValid);
            this.updateErrors();
            !isValid && this.signal('error', this.getErrorMessages(), this);
        }
        return isValid;
    }

    _validate(value = this.getValue()) {
        return this?.validator?.validate(value) ?? true;
    }

    renderErrors(errors = this.errorMessages) {
        return mapHTML(errors, error => html`<li class="fieldErrors__item">${error}</li>`);
    }

    /**
     * Returns the error messages for the field.
     * @returns {string[]}
     */
    getErrorMessages() {
        return this.validator?.getErrors() ?? [];
    }

    /**
     * Updates the errors for the field.
     */
    async updateErrors() {
        this.errorMessages = this.getErrorMessages();
        const errorsNode = this.querySelector('.arpaField__errorList');
        if (!errorsNode) return;
        errorsNode.innerHTML = this.renderErrors(this.errorMessages);
    }

    /**
     * Sets an error to the field.
     * @param {string} text
     */
    setError(text) {
        this.validator?.setError(text);
        this.updateErrors();
    }

    // #endregion

    ///////////////////////////
    // #region Get
    //////////////////////////

    /**
     * Returns the form for the field.
     * @returns {FormComponent | undefined}
     */
    getForm() {
        return /** @type {FormComponent | undefined} */ (this.form || this._config.form || this.closest('arpa-form'));
    }

    getOnChangeValue() {
        return this.getValue();
    }

    /**
     * Returns the pre-processed value for the field.
     * @param {unknown} value
     * @returns {unknown}
     */
    preProcessValue(value) {
        const { preProcessValue } = this._config;
        if (typeof preProcessValue === 'function') {
            const preProcessedVal = preProcessValue(value);
            this.setValue(preProcessedVal, false);
            return preProcessedVal;
        }
        return value;
    }

    /**
     * Returns the ID for the field.
     * @returns {string | undefined}
     */
    getId() {
        return this._id || this.id || this.getProp('id');
    }

    /**
     * Returns the input component.
     * @returns {HTMLInputElement | undefined}
     */
    getInput() {
        return /** @type {HTMLInputElement | undefined} */ (this.nodes.input || this.input);
    }

    getTooltipPosition() {
        return this.getProp('tooltip-position') || 'left';
    }

    /**
     * Returns the output value for the field.
     * @param {Record<string, unknown> | undefined} [_values]
     * @returns {unknown}
     */
    getOutputValue(_values) {
        const { preProcessOutputValue } = this._config;
        const val = this.getValue();
        if (typeof preProcessOutputValue === 'function') {
            return preProcessOutputValue(val);
        }
        return val;
    }

    /**
     * Returns the value for the field.
     * @returns {unknown}
     */
    getValue() {
        const input = this.getInput();
        return this.preProcessValue(
            // @ts-ignore
            input?.value ?? input?.getAttribute('value') ?? this.getProp('value') ?? this.value ?? ''
        );
    }

    getTooltip() {
        return this.getAttribute('tooltip');
    }

    /**
     * Returns array of strings specifying which methods the field should use for validation.
     * @returns {string[]}
     */
    getValidations() {
        return [...this._validations];
    }

    /**
     * Returns the custom validator for the field.
     * @returns {FieldConfigType['validation']}
     */
    getCustomValidator() {
        return this._config?.validation;
    }

    /**
     * Returns the default value for the field.
     * @returns {unknown}
     */
    getDefaultValue() {
        return this.getProp('defaultValue');
    }

    /**
     * Returns the field type, override in child classes.
     * @returns {string}
     */
    getFieldType() {
        return 'field';
    }

    /**
     * Returns the HTML ID for the field.
     * @returns {string}
     */
    getHtmlId() {
        let id = '';
        this.form && (id = this.form.id + '-');
        id += this.getId();
        return id;
    }

    /**
     * Returns a copy of the i18n object for the field.
     * @returns {Record<string, unknown>}
     */
    getI18n() {
        return { ...this._i18n };
    }

    /**
     * Returns the right icon for the field.
     * @returns {string | undefined}
     */
    getIconRight() {
        return this.getProp('icon-right');
    }

    getLabelId() {
        return this.getHtmlId() + '-label';
    }

    getOnFocus() {
        return this._config?.onFocus;
    }

    /**
     * Returns the regular expression for the field.
     * @returns {string}
     */
    getRegex() {
        return this.getProp('regex');
    }

    /**
     * Returns the size for the field.
     * @returns {number[]}
     */
    getSize() {
        const size = this.getArrayProp('size') || [];
        return Array.isArray(size) ? size.map((/** @type {string | number} */ size) => Number(size)) : [];
    }

    // #endregion Get

    ///////////////////////////
    // #region Has / Is
    //////////////////////////

    hasInputMask() {
        return Boolean(
            this.getProp('icon') ||
            this.getProp('iconRight') ||
            this.hasContent('inputMaskLhs') ||
            this.hasContent('inputMaskRhs')
        );
    }

    /**
     * Returns whether the field is required or not.
     * @returns {boolean}
     */
    isRequired() {
        return Boolean(this.hasAttribute('required') || this._config.required);
    }

    // #endregion Has / Is

    ///////////////////////////
    // #region Set
    //////////////////////////

    /**
     * Sets the value for the field.
     * @param {any} value
     * @param {boolean} update
     * @returns {Field}
     */
    setValue(value, update = true) {
        this.value = value;
        this.input = this.getInput();
        if (this.input instanceof HTMLTextAreaElement) {
            this.input.innerHTML = value;
        } else if (this.input instanceof HTMLInputElement) {
            this.input.value = value;
        }
        if (update && this.isConnected) {
            this.setAttribute('value', value);
        }
        return this;
    }

    /**
     * Sets a regex validation.
     * @param {string | RegExp} regex
     * @param {string} message
     */
    setRegex(regex, message) {
        this.setAttribute('regex', regex?.toString());
        message && this.setRegexMessage(message);
    }

    /**
     * Sets the message for the regex validation.
     * @param {string} message
     */
    setRegexMessage(message) {
        this.setAttribute('regex-message', message);
    }

    disable() {
        this.setAttribute('disabled', 'disabled');
        this.input?.setAttribute('disabled', 'disabled');
    }

    enable() {
        this.removeAttribute('disabled');
        this.input?.removeAttribute('disabled');
    }

    // #endregion Set

    ///////////////////////////
    // #region Events
    //////////////////////////

    /**
     * Called when the field's value changes.
     * @param {Event} _event
     */
    onChange(_event) {}

    /**
     * Sends an onChange signal when the field's value changes.
     * @param {Event} [event]
     */
    _callOnChange(event) {
        requestAnimationFrame(() => {
            const value = /** @type {number | string  | []} */ (this.getValue());
            if (typeof value === 'number' || value?.length > 0) {
                this.touched = true;
            }
            if (this.form?.isConnected) {
                this.signal('change', this.getOnChangeValue(), this, event);
            }
        });
    }

    _onFocus() {
        this.signal('focus', this);
    }

    onSubmitSuccess() {}

    // #endregion
}

defineCustomElement('arpa-field', Field);

export default Field;
