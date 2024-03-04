import { lcFirst, mergeObjects, processTemplate } from '@arpadroid/tools';
import { FieldTemplate, InputTemplate } from './fieldTemplate.js';
import FieldValidator from '../../utils/fieldValidator.js';
import { I18n } from '@arpadroid/i18n';

class Field extends HTMLElement {
    _validations = ['required', 'minLength', 'maxLength', 'size'];

    static get observedAttributes() {
        return ['value'];
    }

    constructor(config) {
        super();
        this.setConfig(config);
        if (!this.id || this.id === 'null') {
            throw new Error('Field must have an id');
        }
    }

    getId() {
        return this._id || this.id;
    }

    getProperty(name) {
        return this.getAttribute(name) ?? this._config[name];
    }

    setConfig(config) {
        this._initializeI18n(config);
        this._config = mergeObjects(this.getDefaultConfig(), config);
    }

    getConfig() {
        return this._config;
    }

    getInputComponent() {
        // return this.getComponent('FieldInput');
    }

    getInput() {
        // const component = this.getInputComponent();
        // return component?.node;
    }

    /**
     * Returns default config.
     * @returns {*}
     */
    getDefaultConfig() {
        return {
            template: FieldTemplate,
            inputTemplate: InputTemplate,
            variant: undefined,
            validator: FieldValidator,
            inputAttributes: {
                type: 'text'
            },
            tagName: 'div',
            validation: {},
            validationMessages: {},
            context: {}
        };
    }

    getOutputValue() {
        return this.getValue();
    }

    getValue() {
        return this?.input?.value ?? this.getAttribute('value');
    }

    update() {}

    connectedCallback() {
        this.form = this.closest('form');
        this.classList.add('arpaField');
        const template = this.renderTemplate();
        if (template) {
            this.innerHTML = template;
        }
        this.initializeProperties();
        this._initializeValidation();
        this.update();
    }

    initializeProperties() {
        this.form = this.closest('form');
        this.form.registerField(this);
        this.initializeInput();
        this._id = this.id;
        this.removeAttribute('id');
    }

    initializeInput() {
        this.input = this.querySelector('input');
        this.input.type = 'text';
    }

    renderTemplate() {
        const { template } = this._config;
        const { inputTemplate } = this._config;
        if (template) {
            return processTemplate(template, {
                input: inputTemplate,
                tooltip: this.getTooltip(),
            })
        }
        
    }

    getTooltip() {
        return this.getAttribute('tooltip');
    }

    _initializeValidation() {
        const { validator } = this._config;
        if (validator) {
            /** @type {FieldValidator} */
            this.validator = new validator(this);
        }
    }

    getValidations() {
        return [...this._validations];
    }

    validate(value = this.getValue(), update = true) {
        this.errorMessages = [];
        let isValid = undefined;
        if (typeof this.validator?.validate === 'function') {
            isValid = this.validator.validate(value);
        }
        if (isValid) {
            this.classList?.remove('arpaField--hasError');
        } else {
            this.classList.add('arpaField--hasError');
        }
        if (update) {
            this._isValid = isValid;
            this.updateErrors();
        }
        return isValid;
    }

    _initializeI18n() {
        this.i18n = this._getI18n();
    }

    _getI18n() {
        const type = this.getFieldType();
        const typePayload = I18n.get(`modules.form.fields.${type}`);
        const fieldPayload = I18n.get('modules.form.field');
        return mergeObjects(fieldPayload, typePayload);
    }

    getI18n() {
        return { ...this.i18n };
    }

    getFieldType() {
        return lcFirst(this.constructor.name.replace('Field', '')) || 'field';
    }

    getHtmlId() {
        let id = '';
        if (this.form) {
            id = this.form.id + '-';
        }
        id += this.getId();
        return id;
    }

    isRequired() {
        return this.hasAttribute('required');
    }

    setOnChange(onChange) {
        this._config.onChange = onChange;
        return this;
    }

    setRequired(required = true) {
        if (required) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
        return this;
    }

    getCustomValidator() {
        return this._config?.validation;
    }

    getPlaceholder() {
        return this.getProperty('placeholder');
    }

    setPlaceholder(placeholder) {
        this.setAttribute('placeholder', placeholder);
    }

    getDefaultValue() {
        return this.getProperty('defaultValue');
    }

    getMaxLength() {
        return this.getProperty('maxLength');
    }

    getLength() {
        return this.getProperty('length');
    }

    setMaxLength(maxLength) {
        this.setAttribute('maxLength', maxLength);
    }

    getMinLength() {
        return this.getProperty('minLength');
    }

    setMinLength(minLength) {
        this.setAttribute('minLength', minLength);
    }

    getRegex() {
        return this.getProperty('regex');
    }

    setRegex(regex) {
        this.setAttribute('regex', regex);
    }

    getSize() {
        return this.getProperty('size') ?? [];
    }

    setSize(size) {
        this.setAttribute('size', size);
    }

    getErrorsComponent() {
        return this.querySelector('field-errors');
    }

    getErrorMessages() {
        return this.validator?.getErrors() ?? [];
    }

    updateErrors() {
        this.getErrorsComponent().setErrors(this.getErrorMessages());
    }
}

customElements.define('arpa-field', Field);
export default Field;
