import { attr, lcFirst, mergeObjects, processTemplate, ComponentTool } from '@arpadroid/tools';
import { FieldTemplate, InputTemplate } from './fieldTemplate.js';
import FieldValidator from '../../utils/fieldValidator.js';
import { I18n } from '@arpadroid/i18n';

class Field extends HTMLElement {
    _validations = ['required', 'minLength', 'maxLength', 'size'];
    _onReadyCallbacks = [];
    _isReady = false;

    static template = FieldTemplate;
    static inputTemplate = InputTemplate;

    static get observedAttributes() {
        return ['value'];
    }

    constructor(config) {
        super();
        this.setConfig(config);
        const id = this.getId();
        if (!id) {
            throw new Error('Field must have an id');
        }
        this._initialize();
    }

    _initialize() {
        ComponentTool.applyOnReady(this);
    }

    getId() {
        return this._id || this.id || this._config.id;
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

    /**
     * Returns default config.
     * @returns {*}
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
        this._initializeInput();
        attr(this.input, this._config.inputAttributes);
        this.inputMask = this.querySelector('field-input-mask');
        this._id = this.id;
        this.removeAttribute('id');
    }

    _initializeInput() {
        this.input = this.querySelector('input');
    }

    renderTemplate() {
        const { template, inputTemplate } = this._config;
        if (template) {
            return processTemplate(template, {
                input: inputTemplate,
                tooltip: this.getTooltip()
            });
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

    setValue(value) {
        this.value = value;
        this.input.setValue(value);
        return this;
    }

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
        return this.hasAttribute('required') || this._config.required;
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

    getLabel() {
        return this.getProperty('label');
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

    getIcon() {
        return this.getProperty('icon');
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

    setError(text) {
        this.validator.setError(text);
        this.updateErrors();
    }
}

customElements.define('arpa-field', Field);
export default Field;
