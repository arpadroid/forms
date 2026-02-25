/**
 * @typedef {import('./form.types').FormConfigType} FormConfigType
 * @typedef {import('./form.types').FormTemplatePropsType} FormTemplatePropsType
 * @typedef {import('./form.types').FormSubmitType} FormSubmitType
 * @typedef {import('./form.types').FormSubmitResponseType} FormSubmitResponseType
 * @typedef {import('../../fields/field/field').default} FieldComponent
 * @typedef {import('@arpadroid/messages').Messages} Messages
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { mergeObjects, copyObjectProps, appendNodes, defineCustomElement } from '@arpadroid/tools';
import { observerMixin, renderNode, render, dummySignal, dummyListener, dummyOff } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class FormComponent extends ArpaElement {
    /** @type {Record<string, FieldComponent>} */
    fields = {};

    constructor(config = {}) {
        super(config);
        this.signal = dummySignal;
        this.on = dummyListener;
        this.off = dummyOff;
        observerMixin(this);
    }

    //////////////////////////////////
    // #region Initialization & Config
    //////////////////////////////////
    _initialize() {
        this.bind('_onChange', '_onSubmit');
        if (this.hasAttribute('title')) {
            this._config.title = this.getProperty('title');
            this.removeAttribute('title');
        }
    }

    /**
     * Returns an i18n text node given a key and optional replacements and node attributes.
     * @param {string} key - The key to translate.
     * @param {Record<string, string>} replacements - The replacements for the key.
     * @param {Record<string, string>} attributes - The attributes for the i18n text.
     * @returns {string} - The translated text.
     */
    i18n(key, replacements = {}, attributes = {}) {
        return I18nTool.arpaElementI18n(this, key, replacements, attributes, 'forms.form');
    }

    /**
     * Returns the form configuration.
     * @returns {FormConfigType} The form configuration.
     */
    getDefaultConfig() {
        /** @type {FormConfigType} */
        const config = {
            variant: 'default',
            hasSubmit: true,
            initialValues: {},
            onSubmit: undefined,
            debounce: 1000,
            successMessage: this.i18n('msgSuccess'),
            submitIcon: 'check_circle',
            errorMessage: this.i18n('msgError'),
            zoneSelector: 'zone:not(.arpaField)',
            zoneFilter: zones =>
                zones.filter(zone => {
                    const parent = /** @type {HTMLElement} */ (zone._parentNode);
                    return parent?.classList?.contains('arpaField');
                })
        };
        return super.getDefaultConfig(config);
    }

    /**
     * Sets the form configuration.
     * @param {FormConfigType} config - The form configuration.
     */
    setConfig(config) {
        /** @type {FormConfigType} */
        this._config = mergeObjects(this.getDefaultConfig(), config);
    }

    // #endregion Initialization & Config

    ////////////////////////////////
    // #region Lifecycle
    ////////////////////////////////

    attributeChangedCallback() {
        this.update();
    }

    async _initializeMessages() {
        await customElements.whenDefined('arpa-messages');

        this.messages = /** @type {Messages | null} */ (this.querySelector('arpa-messages'));
    }

    _initializeSubmit() {
        this.submitButton = this.querySelector('button[type="submit"]');
        this.addEventListener('submit', this._onSubmit);
    }

    _initializeFields() {
        this.formFields = this.querySelector('.arpaForm__fields');
        if (this.formFields) {
            appendNodes(this.formFields, this._childNodes);
        }
    }

    // #endregion Lifecycle

    /////////////////////////////////
    // #region Get
    /////////////////////////////////

    getSubmitText() {
        return this.getProperty('submit-text') || html`<i18n-text key="common.labels.lblSubmit" />`;
    }

    getFields() {
        return Object.values(this.fields);
    }

    /**
     * Returns a field by its id.
     * @param {string} fieldId
     * @returns {FieldComponent | undefined}
     */
    getField(fieldId) {
        return this.fields?.[fieldId];
    }

    /**
     * Returns the form fiel values.
     * @returns {Record<string, unknown>}
     */
    getValues() {
        /** @type {Record<string, unknown>} */
        this._values = {};
        this.getFields().forEach(field => {
            const value = field.getOutputValue(this._values);
            if (typeof value !== 'undefined') {
                const fieldId = field.getId();
                this._values && fieldId && (this._values[fieldId] = value);
            }
        });
        return this._values;
    }

    getTitle() {
        return this.getProperty('title');
    }

    getVariant() {
        return this.getProperty('variant');
    }

    // #endregion Get

    /////////////////////////////////
    // #region Has
    /////////////////////////////////

    hasInitialValues() {
        const { initialValues = {} } = this._config || {};
        return Object.keys(initialValues).length > 0;
    }

    hasTitle() {
        return this.getProperty('title') || this.hasZone('form-title');
    }

    hasFooter() {
        return this.hasSubmitButton() || this.hasZone('footer') || this.hasZone('controls');
    }

    hasDescription() {
        return this.getProperty('description') || this.hasZone('description');
    }

    hasHeader() {
        return this.hasTitle() || this.hasDescription();
    }

    // #endregion Has

    /////////////////////////////////
    // #region Set
    /////////////////////////////////

    /**
     * Sets the initial values for the form.
     * @param {Record<string, unknown>} values
     */
    setInitialValues(values = {}) {
        this._config && (this._config.initialValues = copyObjectProps(values));
    }

    /**
     * Sets the field values.
     * @param {Record<string, unknown>} values
     */
    setValues(values = {}) {
        if (!values) return;
        for (const [fieldId, value] of Object.entries(values)) {
            this.fields[fieldId]?.setValue(value);
        }
    }

    /**
     * Registers a field to the form.
     * @param {FieldComponent} field
     */
    registerField(field) {
        const id = field.getId();
        id && (this.fields[id] = field);
        field.on('change', this._onChange);
    }

    /**
     * Called when a field changes.
     * @param {FieldComponent} field - The field that changed.
     */
    _onChange(field) {
        this.signal('change', { field, form: this });
    }

    reset() {
        // !this.hasInitialValues() && this.render();
        this.messages?.deleteMessages();
    }

    /**
     * Sets the debounce time for the form.
     * @param {number} value - The debounce time in milliseconds.
     */
    setDebounce(value) {
        this._config && (this._config.debounce = value);
    }

    // #endregion Set

    /////////////////////////////////
    // #region Rendering
    /////////////////////////////////

    /**
     * Returns the template variables for the form.
     * @returns {FormTemplatePropsType}
     */
    getTemplateVars() {
        return {
            submitLabel: this.getSubmitText(),
            formId: this.id,
            title: this.renderTitle(),
            description: this.renderDescription(),
            submitButton: this.renderSubmitButton(),
            header: this.renderHeader(),
            messages: this.renderMessages(),
            footer: this.renderFooter(),
            fullLayout: this.renderFull()
        };
    }

    async _initializeNodes() {
        const { variant } = this._config || {};
        this.bodyNode = this.querySelector('.arpaForm__body');
        /** @type {HTMLFormElement | null} */
        this.formNode = this.querySelector('.arpaForm__form');
        this.messagesNode = this.querySelector('arpa-messages');
        this._initializeFields();
        this._initializeSubmit();
        this._initializeMessages();
        this.classList.add('arpaForm');
        variant && this.classList.add(`arpaForm--${variant}`);
        this.titleNode = this.querySelector('form-title');
        this.headerNode = this.querySelector('.arpaForm__header');
        this.errorsNode = this.querySelector('.arpaForm__errors');
        return true;
    }

    _getTemplate() {
        !this.id && console.warn('Form must have an id.', this);
        const variant = this.getVariant();
        return html`<form class="arpaForm__form" novalidate>${variant === 'mini' ? this.renderMini() : this.renderFull()}</form>`;
    }

    renderFull() {
        return html`{header} {messages}
            <div class="arpaForm__body">
                <div class="arpaForm__fields"></div>
            </div>
            {footer}`;
    }

    renderMessages() {
        return html`<arpa-messages zone="messages" class="arpaForm__messages" id="{formId}-messages"></arpa-messages>`;
    }

    renderHeader() {
        return this.hasHeader() ? html`<div class="arpaForm__header" zone="header">{title}{description}</div>` : '';
    }

    renderDescription() {
        return this.hasDescription() ? html`<div class="arpaForm__description" zone="description"></div>` : '';
    }

    renderMini() {
        return html`${this.renderTitle()}
            <div class="arpaForm__fields"></div>`;
    }

    renderTitle() {
        const title = this.getTitle();
        return this.hasTitle() ? html`<form-title zone="form-title">${title || ''}</form-title>` : '';
    }

    renderFooter() {
        return this.hasFooter()
            ? html`<div class="arpaFrom__footer" zone="footer">
                  <div class="arpaForm__controls" zone="controls">{submitButton}</div>
              </div>`
            : '';
    }

    renderSubmitButton() {
        return render(
            this.hasSubmitButton() && this.getProperty('variant') !== 'mini',
            html`<submit-button icon="${this.getProperty('submit-icon')}" type="submit" class="arpaForm__submitBtn">
                ${this.getSubmitText()}
            </submit-button>`
        );
    }

    hasSubmitButton() {
        return this.hasProperty('has-submit');
    }

    // #endregion Rendering

    /////////////////////////////////
    // #region Validation
    /////////////////////////////////

    /**
     * Validates the form.
     * @returns {boolean}
     */
    validate() {
        this.getValues();
        this._isValid = true;
        this.getFields().forEach(field => !field.validate() && (this._isValid = false));
        if (this._isValid) {
            this.classList.remove('formComponent--invalid');
        } else {
            this.messages?.deleteMessages();
            const msg = this.getErrorMessage();
            msg && this.messages?.error(msg, { canClose: true });
            this.classList.add('formComponent--invalid');
        }
        return this._isValid;
    }

    _validate() {
        return (
            this.getFields()
                .map(field => field._validate())
                .indexOf(false) === -1
        );
    }

    getErrorMessage() {
        return this.getProperty('error-message');
    }

    getSuccessMessage() {
        return this.getProperty('success-message');
    }

    // #endregion Validation

    /////////////////////////////////
    // #region Submit
    /////////////////////////////////

    /**
     * Sets the onSubmit callback.
     * @param {FormSubmitType} callback
     */
    onSubmit(callback) {
        this._config && (this._config.onSubmit = callback);
    }

    /**
     * Returns the onSubmit callback.
     * @returns {FormSubmitType | undefined}
     */
    getOnSubmit() {
        return this._config?.onSubmit;
    }

    /**
     * Debounces submit, validates form and if valid calls the onSubmit callback.
     * @param {Event} event
     * @returns {Promise<FormSubmitResponseType> | undefined | boolean}
     */
    _onSubmit(event) {
        event?.preventDefault();
        const time = new Date().getTime();
        const diff = time - (this.submitTime || 0);
        const debounce = this.getDebounce();
        if (debounce && this.submitTime && diff < debounce) {
            return;
        }
        this.submitTime = time;
        if (this.validate()) {
            return this._callOnSubmit();
        } else {
            this.scrollIntoView();
            this.focusFirstErroredInput();
        }
    }

    /**
     * Submits the form.
     * @param {Event} event
     */
    submitForm(event) {
        this._onSubmit(event);
    }

    getDebounce() {
        if (this.hasAttribute('debounce')) {
            return Number(this.getAttribute('debounce'));
        }
        return Number(this._config?.debounce);
    }

    /**
     * Calls the onSubmit callback.
     * @returns {Promise<FormSubmitResponseType> | undefined | boolean}
     */
    _callOnSubmit() {
        this?.messages?.deleteMessages();
        const onSubmit = this.getOnSubmit();
        if (typeof onSubmit === 'function') {
            const payload = this._values;
            this.startLoading();
            const rv = onSubmit(payload);
            if (rv instanceof Promise && typeof rv?.finally === 'function') {
                this.handlePromise(rv);
                return rv;
            }
            rv && this._onSubmitSuccess();
            this.stopLoading();
            return rv;
        }
    }

    /**
     * Handles the promise returned by the onSubmit callback.
     * @param {Promise<FormSubmitResponseType>} promise - The promise returned by the onSubmit callback.
     * @returns {Promise<FormSubmitResponseType>}
     */
    handlePromise(promise) {
        return promise.then(this._onPromiseResolved).finally(() => this.stopLoading());
    }

    /**
     * Handles a resolved promise.
     * @param {FormSubmitResponseType} response
     * @returns {Promise<FormSubmitResponseType>}
     */
    _onPromiseResolved(response) {
        this._onSubmitSuccess();
        if (response?.formValues) {
            this.setInitialValues(response.formValues);
            this.setValues(response.formValues);
        } else if (!this.hasInitialValues()) {
            this.reset();
        }
        return Promise.resolve(response);
    }

    _onSubmitSuccess() {
        this.getFields().forEach(field => field.onSubmitSuccess());
        const successMessage = this.getSuccessMessage();
        successMessage && this.messages?.success(successMessage, { canClose: true });
    }

    startLoading() {
        if (!this.preloader) {
            this.preloader = renderNode(html`<circular-preloader></circular-preloader>`);
        }
        this.preloader && this.bodyNode?.append(this.preloader);
    }

    stopLoading() {
        this.preloader instanceof HTMLElement && this.preloader?.remove();
        this.getVariant() !== 'mini' && this.scrollIntoView();
    }

    focusFirstErroredInput() {
        const errorInputSelector = '.arpaField--hasError input, .arpaField--hasError textarea, .arpaField--hasError select';
        const firstInput = this.querySelector(errorInputSelector);
        firstInput instanceof HTMLElement && firstInput?.focus();
    }

    // #endregion Submit
}

defineCustomElement('arpa-form', FormComponent);

export default FormComponent;
