/**
 * @typedef {import('../../components/form/form').default} FormComponent
 * @typedef {import('../../fields/field/components/fieldInput/fieldInput.js').default} FieldInput
 * @typedef {import('../../fields/field/components/fieldInputMask/fieldInputMask.js').default} fieldInputMask
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./components/fieldErrors/fieldErrors.js').default} FieldErrors
 * @typedef {import('./components/fieldInput/fieldInput.types.js').FieldInputType} FieldInputType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('./components/fieldLabel/fieldLabel.js').default} FieldLabel
 */
import { attrString, defineCustomElement, dummyListener, dummySignal, mergeObjects } from '@arpadroid/tools';
import { observerMixin } from '@arpadroid/tools';
import FieldValidator from '../../utils/fieldValidator.js';
import { I18n } from '@arpadroid/i18n';
import { ArpaElement } from '@arpadroid/ui';
const html = String.raw;
class Field extends ArpaElement {
    _validations = ['required', 'minLength', 'maxLength', 'size'];
    /** @type {FieldConfigType} */
    _config = this._config;

    ////////////////////////////////
    // #region Initialization
    ////////////////////////////////

    /**
     * Creates a new instance of ArpaElement.
     * @param {FieldConfigType} config - The configuration object for the element.
     */
    constructor(config) {
        super(config);
        this.bind('_callOnChange');
        this.on = dummyListener;
        this.signal = dummySignal;
        observerMixin(this);
    }

    /**
     * Initializes the field after constructor.
     * @throws {Error} If the field does not have an id.
     */
    async _initialize() {
        const id = this.getId();
        if (!id) throw new Error('Field must have an id');
        await this.onReady();
        this._onReady();
    }

    /**
     * Returns default config.
     * @returns {FieldConfigType}
     */
    getDefaultConfig() {
        return {
            template: Field.template,
            inputTemplate: html`<field-input {inputAttr}></field-input>`,
            validator: FieldValidator,
            hasInputMask: true,
            inputComponent: 'field-input',
            inputTag: 'input',
            inputAttributes: {
                type: 'text'
            }
        };
    }

    /**
     * Sets the configuration for the field.
     * @param {FieldConfigType} config
     */
    setConfig(config) {
        this._initializeI18n();
        super.setConfig(config);
    }

    /**
     * Initializes the properties for the field.
     * @returns {boolean}
     */
    initializeProperties() {
        /** @type {FormComponent} */
        if (this.id) {
            this._id = this.id;
            this.removeAttribute('id');
            this.id = '';
        }
        this.form = this.getForm();
        if (this.form) {
            this.form.registerField(this);
            return true;
        }
        return false;
    }

    _onInitialized() {
        this.initializeValidation();
    }

    /**
     * Initializes the value for the field.
     * @param {unknown} value
     */
    _initializeValue(value = this.getProperty('value')) {
        if (typeof value === 'undefined') {
            value = this.getProperty('default-value');
        }
        if (typeof value !== 'undefined') {
            this.setValue(value);
        }
    }

    async _initializeInputNode() {
        this.input = this.getInput();

        const inputComponent = this.getProperty('input-component');
        if (inputComponent) {
            await customElements.whenDefined(inputComponent);
            /** @type {FieldInput | null} */
            this.inputComponent = this.querySelector(inputComponent);
            this.inputComponent?.promise && (await this.inputComponent.promise);
            this.input = this.inputComponent?.input;
        }

        return true;
    }

    async _initializeNodes() {
        /** @type {FormComponent} */
        await new Promise(resolve => setTimeout(resolve, 0));
        this.form = this.getForm();
        await this._initializeInputNode();
        /** @type {fieldInputMask | null} */
        this.inputMask = this.querySelector('field-input-mask');
        this.inputWrapper = this.querySelector('.arpaField__inputWrapper');
        /** @type {FieldLabel | null} */
        this.label = this.querySelector('field-label label');
        this.headerNode = this.querySelector('.arpaField__header');
        this.bodyNode = this.querySelector('.arpaField__body');
        /** @type {Tooltip | null} */
        this.tooltip = this.querySelector('.arpaField__tooltip');
        return true;
    }

    _onDomReady() {
        this._initializeValue();
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

    static template = html`
        <div class="arpaField__header">{label}{errors}{tooltip}</div>
        {subHeader}
        <div class="arpaField__body">
            {description} {beforeInput}
            <div class="arpaField__inputWrapper" zone="input-wrapper">{input}{inputRhs}{inputMask}</div>
            {afterInput}
        </div>
        <div class="arpaField__footer">{footnote}</div>
    `;

    /**
     * Returns the template variables for the field.
     * @returns {Record<string, unknown>} The template variables.
     */
    getTemplateVars() {
        return {
            id: this.getHtmlId(),
            labelId: this.getLabelId(),
            input: this.renderInput(),
            tooltip: this.renderTooltip(),
            tooltipPosition: this.getTooltipPosition(),
            label: this.renderLabel(),
            icon: this.getIcon(),
            iconRight: this.getIconRight(),
            content: this._content,
            inputMask: this.hasInputMask() && html`<field-input-mask></field-input-mask>`,
            subHeader: this.renderSubHeader(),
            description: this.renderDescription(),
            footnote: this.renderFootnote(),
            inputRhs: this.renderInputRhs(),
            errors: this.renderErrors(),
            value: this.getValue(),
            inputAttr: this.renderInputAttributes()
        };
    }

    renderInputAttributes() {
        const { inputAttributes = {} } = this._config;
        return attrString(inputAttributes);
    }

    renderTooltip() {
        return this.hasContent('tooltip')
            ? html`<arpa-tooltip class="arpaField__tooltip" icon="info" position="{tooltipPosition}" zone="tooltip">
                  <zone name="tooltip-content">${this.getTooltip() || ''}</zone>
              </arpa-tooltip>`
            : '';
    }

    /**
     * Manual allocation of zones.
     * @param {import('@arpadroid/tools').ZoneToolPlaceZoneType} payload
     * @returns {boolean | undefined}
     */
    _onLostZone({ zoneName, zone }) {
        if (zoneName === 'tooltip') {
            zone?.childNodes?.length && this.tooltip?.contentNode?.append(...(zone?.childNodes || []));
            return true;
        }
    }

    renderErrors() {
        return html`<field-errors></field-errors>`;
    }

    renderInputRhs() {
        return this.renderChild('input-rhs');
    }

    renderDescription() {
        return this.renderChild('description', { tag: 'p' });
    }

    renderFootnote() {
        return this.renderChild('footnote', { tag: 'p' });
    }

    renderLabel() {
        return this.renderChild('label', { tag: 'field-label', hasZone: false });
    }

    renderInput() {
        const { inputTemplate } = this._config;
        if (this.isReadOnly()) {
            return html`<div class="arpaField__readOnly fieldInput">{value}</div>`;
        }
        return inputTemplate;
    }

    renderSubHeader() {
        return this.renderChild('sub-header');
    }

    /**
     * Adds a node to the right-hand side of the input.
     * @param {HTMLElement} node
     */
    async addInputRHS(node) {
        await this.onReady();
        node instanceof HTMLElement && this.inputWrapper?.appendChild(node);
    }

    // #endregion

    /////////////////////////////
    // #region Lifecycle
    ////////////////////////////

    static get observedAttributes() {
        return ['value'];
    }

    /**
     * Called when the component is ready.
     * @returns {Promise<any>}
     */
    onReady() {
        return customElements.whenDefined('arpa-form');
    }

    _onReady() {
        this.form = this.getForm();
        this.classList.add('arpaField');
        this._initializeClassNames();
        this.initializeProperties();
    }

    _initializeClassNames() {
        if (typeof this._config?.className === 'string') {
            this.classList.add(...this._config.className.trim().split(' '));
        }
        if (Array.isArray(this._config.classNames)) {
            this.classList.add(...this._config.classNames);
        }
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
        if (isValid) {
            this.classList.remove('arpaField--hasError');
        } else {
            this.classList.add('arpaField--hasError');
        }
        update && (this._isValid = isValid);
        this.updateErrors();
        !isValid && this.signal('error', this.getErrorMessages(), this);
        return isValid;
    }

    _validate(value = this.getValue()) {
        return this?.validator?.validate(value) ?? true;
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
        this.validator?.setError(text);
        this.updateErrors();
    }

    /**
     * Returns the field errors component.
     * @returns {FieldErrors | null}
     */
    getErrorsComponent() {
        return this.querySelector('field-errors');
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
        return this._id || this.id || this.getProperty('id');
    }

    /**
     * Returns the input component.
     * @returns {FieldInputType | undefined}
     */
    getInput() {
        const inputTag = this.getProperty('input-tag');
        return this.input || this.inputComponent?.input || (inputTag && this.querySelector(inputTag));
    }

    getTooltipPosition() {
        return this.getProperty('tooltip-position') || 'left';
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
        return this.preProcessValue( // @ts-ignore
            input?.value ?? input?.getAttribute('value') ?? this.getProperty('value') ?? this.value ?? ''
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
        return this.getProperty('defaultValue');
    }

    /**
     * Returns the field type, override in child classes.
     * @returns {string}
     */
    getFieldType() {
        return 'field';
    }

    getTagName() {
        return 'arpa-field';
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
     * Returns the icon for the field.
     * @returns {string}
     */
    getIcon() {
        return this.getProperty('icon')?.trim();
    }

    /**
     * Returns the right icon for the field.
     * @returns {string | undefined}
     */
    getIconRight() {
        return this.getProperty('icon-right');
    }

    /**
     * Returns the label for the field.
     * @returns {string}
     */
    getLabel() {
        return this.getProperty('label') || '';
    }

    getLabelId() {
        return this.getHtmlId() + '-label';
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
        return parseFloat(this.getProperty('max-length'));
    }

    /**
     * Returns the minimum length for the field.
     * @returns {number}
     */
    getMinLength() {
        return parseFloat(this.getProperty('min-length'));
    }

    /**
     * Returns the placeholder for the field.
     * @returns {string}
     */
    getPlaceholder() {
        return this.getProperty('placeholder');
    }

    getOnFocus() {
        return this._config?.onFocus;
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
     * @returns {number[]}
     */
    getSize() {
        const size = this.getArrayProperty('size') || [];
        return Array.isArray(size) ? size.map((/** @type {string | number} */ size) => Number(size)) : [];
    }

    // #endregion Get

    ///////////////////////////
    // #region Has
    //////////////////////////

    hasInputMask() {
        return this.getProperty('has-input-mask');
    }

    // #endregion Has

    ///////////////////////////
    // #region Is
    //////////////////////////

    isReadOnly() {
        return this.hasAttribute('read-only') || this._config.readOnly;
    }

    /**
     * Returns whether the field is required or not.
     * @returns {boolean}
     */
    isRequired() {
        return Boolean(this.hasAttribute('required') || this._config.required);
    }

    isDisabled() {
        const hasAttr = this.hasAttribute('disabled');
        const attrValue = this.getAttribute('disabled');
        return Boolean((hasAttr && attrValue !== 'false') || (!hasAttr && this._config.disabled));
    }

    // #endregion Is

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
        } else if (
            this.inputComponent &&
            'setValue' in this.inputComponent &&
            typeof this.inputComponent?.setValue === 'function'
        ) {
            this.inputComponent.setValue(value);
        } else if (this.input instanceof HTMLInputElement) {
            this.input.value = value;
        }
        if (update && this.isConnected) {
            this.setAttribute('value', value);
        }
        return this;
    }

    /**
     * Sets the maximum length for the field.
     * @param {number} maxLength
     */
    setMaxLength(maxLength) {
        this.setAttribute('maxLength', maxLength.toString());
    }

    /**
     * Sets the minimum length for the field.
     * @param {number} minLength
     */
    setMinLength(minLength) {
        this.setAttribute('minLength', minLength.toString());
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

    disable() {
        this.setAttribute('disabled', 'disabled');
        this.getInput()?.setAttribute('disabled', 'disabled');
    }

    enable() {
        this.removeAttribute('disabled');
        this.getInput()?.removeAttribute('disabled');
    }

    // #endregion Set

    ///////////////////////////
    // #region Events
    //////////////////////////

    /**
     * Sends an onChange signal when the field's value changes.
     * @param {Event} [event]
     */
    _callOnChange(event) {
        requestAnimationFrame(() => {
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

defineCustomElement(Field.prototype.getTagName(), Field);

export default Field;
