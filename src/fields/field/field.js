import { attr, lcFirst, mergeObjects, processTemplate, ObserverTool } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';
import { FieldTemplate, InputTemplate } from './fieldTemplate.js';
import FieldValidator from '../../utils/fieldValidator.js';
import { I18n } from '@arpadroid/i18n';
/**
 * @typedef {import('../../components/form/form').default} FormComponent
 * @typedef {import('./fieldInterface').FieldInterface} FieldInterface
 * @typedef {import('./components/fieldErrors/fieldErrors.js').default} FieldErrors
 */

class Field extends ArpaElement {
    _validations = ['required', 'minLength', 'maxLength', 'size'];
    static _isReady = false;
    _hasInitialized = false;

    static template = FieldTemplate;
    static inputTemplate = InputTemplate;

    /**
     * Returns the observed attributes for the field element.
     * @type {string[]}
     */
    static get observedAttributes() {
        return ['value'];
    }

    /**
     * Initializes the field after constructor.
     * @throws {Error} If the field does not have an id.
     * @protected
     */
    async _initialize() {
        ObserverTool.mixin(this);
        const id = this.getId();
        if (!id) {
            throw new Error('Field must have an id');
        }
        await this.onReady();
        this._onReady();
    }

    onReady() {
        if (Field._isReady) {
            return Promise.resolve();
        }
        return customElements.whenDefined('arpa-form').then(response => {
            Field._isReady = true;
            return Promise.resolve(response);
        });
    }

    onSubmitSuccess() {}

    _onReady() {
        this.form = this.getForm();
        this.classList.add('arpaField');
        this.initializeProperties();
    }

    /**
     * Returns default config.
     * @returns {FieldInterface}
     * @protected
     */
    getDefaultConfig() {
        return {
            template: Field.template,
            inputTemplate: Field.inputTemplate,
            variant: undefined,
            validator: FieldValidator,
            inputAttributes: {
                type: 'text'
            },
            tagName: 'div',
            validation: {},
            context: {}
        };
    }

    /**
     * Sets the configuration for the field.
     * @param {FieldInterface} config
     * @protected
     */
    setConfig(config) {
        this._initializeI18n(config);
        super.setConfig(config);
    }

    /**
     * Initializes internationalization for the field.
     */
    _initializeI18n() {
        this.i18n = this._getI18n();
    }

    /**
     * Prepares the i18n object for the field.
     * @returns {Record<string, unknown>} The i18n object.
     */
    _getI18n() {
        const type = this.getFieldType();
        const typePayload = I18n.get(`modules.form.fields.${type}`);
        const fieldPayload = I18n.get('modules.form.field');
        return mergeObjects(fieldPayload, typePayload);
    }

    /**
     * Initializes the properties for the field.
     * @protected
     */
    initializeProperties() {
        /** @type {FormComponent} */
        if (this.id) {
            this._id = this.id;
            this.removeAttribute('id');
            delete this.id;
        }
        this.form = this.getForm();
        if (this.form) {
            this.form.registerField(this);
            this._onInitialized();
            this._hasInitialized = true;
        }
    }

    _onInitialized() {
        this.initializeValidation();
    }

    /**
     * Initializes the value for the field.
     * @param {unknown} value
     * @protected
     */
    _initializeValue(value = this.getProperty('value')) {
        if (typeof value === 'undefined') {
            value = this.getProperty('default-value');
        }
        if (typeof value !== 'undefined') {
            this.setValue(value);
        }
    }

    getForm() {
        return this.closest('form') || this._config.form;
    }

    /**
     * Initializes the input element for the field.
     * @param {HTMLInputElement} input
     * @protected
     */
    _initializeInputNode(input = this.querySelector('input')) {
        this.input = input;
        if (this.input) {
            attr(this.input, this._config.inputAttributes);
        }
    }

    /**
     * Returns the template variables for the field.
     * @returns {Record<string, unknown>} The template variables.
     */
    getTemplateVars() {
        const { inputTemplate } = this._config;
        return {
            input: processTemplate(inputTemplate, this.getInputTemplateVars()),
            tooltip: this.getTooltip(),
            label: this.getLabel(),
            icon: this.getIcon(),
            iconRight: this.getIconRight(),
            content: this._content
        };
    }

    /**
     * Renders the input template variables for the field.
     * @returns {string} The rendered input template.
     */
    getInputTemplateVars() {
        return {
            id: this.getHtmlId()
        };
    }

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

    async connectedCallback() {
        await this.onReady();
        if (!this._hasInitialized) {
            this.initializeProperties();
        }
        super.connectedCallback();
    }

    /**
     * Called after the component has rendered.
     * @protected
     */
    _onConnected() {
        this._initializeNodes();
        this._initializeValue();
    }

    _initializeNodes() {
        /** @type {FormComponent} */
        this.form = this.getForm();
        this._initializeInputNode();
        this.inputMask = this.querySelector('field-input-mask');
        this.inputWrapper = this.querySelector('.arpaField__inputWrapper');
        this.label = this.querySelector('label[is="field-label"]');
    }

    /**
     * Sends an onChange signal when the field's value changes.
     * @param {Event} event
     */
    _callOnChange(event) {
        if (this.form.isConnected) {
            this.signal('onChange', this.getOnChangeValue(), this, event);
        }
    }

    getOnChangeValue() {
        return this.getValue();
    }

    /**
     * Returns the ID for the field.
     * @returns {string}
     */
    getId() {
        return this._id || this.id || this.getProperty('id');
    }

    /**
     * Returns the output value for the field.
     * @returns {unknown}
     */
    getOutputValue() {
        return this.getValue();
    }

    /**
     * Returns the value for the field.
     * @returns {unknown}
     */
    getValue() {
        return this?.input?.value ?? this.getProperty('value');
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
     * Sets the value for the field.
     * @param {unknown} value
     * @param {boolean} update
     * @returns {Field}
     */
    setValue(value, update = true) {
        this.value = value;
        if (this.input) {
            if (typeof this.input.setValue === 'function') {
                this.input.setValue(value);
            } else {
                this.input.value = value;
            }
        }
        if (update && this.isConnected) {
            this.setAttribute('value', value);
        }
        return this;
    }

    /**
     * VALIDATION.
     */

    /**
     * Validates the field.
     * @param {unknown} value
     * @param {boolean} update - Whether to update the field's state.
     * @returns {boolean}
     */
    validate(value = this.getValue(), update = true) {
        const isValid = this?.validator?.validate(value) ?? true;
        if (isValid) {
            this.classList.remove('arpaField--hasError');
        } else {
            this.classList.add('arpaField--hasError');
        }
        if (update) {
            this._isValid = isValid;
        }
        this.updateErrors();
        return isValid;
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
    updateErrors() {
        this.getErrorsComponent()?.setErrors(this.getErrorMessages());
    }

    /**
     * Sets an error to the field.
     * @param {string} text
     */
    setError(text) {
        this.validator.setError(text);
        this.updateErrors();
    }

    /**
     * Returns the field errors component.
     * @returns {FieldErrors}
     */
    getErrorsComponent() {
        return this.querySelector('field-errors');
    }

    /**
     * ACCESSORS.
     */

    /**
     * Returns the custom validator for the field.
     * @returns {(value: unknown) => boolean}
     */
    getCustomValidator() {
        return this._config?.validation;
    }

    /**
     * Returns the default value for the field.
     * @returns {unknown}
     */
    getDefaultValue() {
        return this.getProperty('defaultValue');
    }

    /**
     * Returns the field type.
     * @returns {string}
     */
    getFieldType() {
        return lcFirst(this.constructor.name.replace('Field', '')) || 'field';
    }

    /**
     * Returns the HTML ID for the field.
     * @returns {string}
     */
    getHtmlId() {
        let id = '';
        if (this.form) {
            id = this.form.id + '-';
        }
        id += this.getId();
        return id;
    }

    /**
     * Returns a copy of the i18n object for the field.
     * @returns {Record<string, unknown>}
     */
    getI18n() {
        return { ...this.i18n };
    }

    /**
     * Returns the icon for the field.
     * @returns {string}
     */
    getIcon() {
        return this.getProperty('icon');
    }

    /**
     * Returns the right icon for the field.
     * @returns {string}
     */
    getIconRight() {
        return this.getProperty('icon-right');
    }

    /**
     * Returns the label for the field.
     * @returns {string}
     */
    getLabel() {
        return this.getProperty('label');
    }

    /**
     * Returns the length for the field.
     * @returns {number}
     */
    getLength() {
        return this.getProperty('length');
    }

    /**
     * Returns the maximum length for the field.
     * @returns {number}
     */
    getMaxLength() {
        return this.getProperty('maxLength');
    }

    /**
     * Returns the minimum length for the field.
     * @returns {number}
     */
    getMinLength() {
        return this.getProperty('minLength');
    }

    /**
     * Returns the placeholder for the field.
     * @returns {string}
     */
    getPlaceholder() {
        return this.getProperty('placeholder');
    }

    /**
     * Returns the regular expression for the field.
     * @returns {string}
     */
    getRegex() {
        return this.getProperty('regex');
    }

    /**
     * Returns the size for the field.
     * @returns {string[]}
     */
    getSize() {
        return this.getProperty('size') ?? [];
    }

    /**
     * Returns whether the field is required or not.
     * @returns {boolean}
     */
    isRequired() {
        return this.hasAttribute('required') || this._config.required;
    }

    /**
     * Sets the maximum length for the field.
     * @param {number} maxLength
     */
    setMaxLength(maxLength) {
        this.setAttribute('maxLength', maxLength);
    }

    /**
     * Sets the minimum length for the field.
     * @param {number} minLength
     */
    setMinLength(minLength) {
        this.setAttribute('minLength', minLength);
    }

    /**
     * Sets a regex validation.
     * @param {string | RegExp} regex
     * @param {string} message
     */
    setRegex(regex, message) {
        this.setAttribute('regex', regex);
        if (message) {
            this.setRegexMessage(message);
        }
    }

    /**
     * Sets the message for the regex validation.
     * @param {string} message
     */
    setRegexMessage(message) {
        this.setAttribute('regex-message', message);
    }

    /**
     * Sets whether the field is required or not.
     * @param {boolean} required
     * @returns {Field}
     */
    setRequired(required = true) {
        if (required) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
        return this;
    }

    /**
     * Sets the size for the field.
     * @param {string} size
     */
    setSize(size) {
        this.setAttribute('size', size);
    }
}

customElements.define('arpa-field', Field);
export default Field;
