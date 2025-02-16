/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./form.types').FormConfigType} FormConfigType
 * @typedef {import('./form.types').FormTemplatePropsType} FormTemplatePropsType
 * @typedef {import('./form.types').FormSubmitType} FormSubmitType
 * @typedef {import('./form.types').FormSubmitResponseType} FormSubmitResponseType
 * @typedef {import('../../fields/field/field').default} FieldComponent
 * @typedef {import('@arpadroid/messages').Messages} Messages
 * @typedef {import('@arpadroid/resources').MessageResource} MessageResource
 */
import { mergeObjects, copyObjectProps, zoneMixin, appendNodes, processTemplate } from '@arpadroid/tools';
import { observerMixin, attr, renderNode, render, handleZones } from '@arpadroid/tools';
import { onDestroy, getProperty, hasProperty, hasZone, canRender } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';

const html = String.raw;

class FormComponent extends HTMLFormElement {
    /** @type {Record<string, FieldComponent>} */
    fields = {};
    /** @type {FormConfigType} */ // @ts-ignore
    _config = this._config;

    //////////////////////////////////
    // #region Initialization & Config
    //////////////////////////////////

    /**
     * Creates a new form component.
     * @param {FormConfigType} config - The form configuration.
     */
    constructor(config) {
        super();
        zoneMixin(this);
        observerMixin(this);
        this.setConfig(config);
        this.promise = this.getPromise();
        this._childNodes = [...this.childNodes];
    }

    /**
     * Returns a promise that resolves when the form is rendered.
     * @returns {Promise<boolean>} - The promise that resolves when the form is rendered.
     */
    getPromise() {
        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
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
        return {
            variant: 'default',
            hasSubmit: true,
            initialValues: {},
            onSubmit: undefined,
            debounce: 1000,
            successMessage: this.i18n('msgSuccess'),
            errorMessage: this.i18n('msgError')
        };
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

    connectedCallback() {
        if (!this._hasRendered) {
            this.render();
        }
    }

    disconnectedCallback() {
        this._onDestroy();
    }

    _onDestroy() {
        onDestroy(this);
    }

    attributeChangedCallback() {
        this.update();
    }

    _initializeNodes() {
        this.bodyNode = this.querySelector('.arpaForm__body');
        this.messagesNode = this.querySelector('arpa-messages');
    }

    async _initializeMessages() {
        await customElements.whenDefined('arpa-messages');
        /** @type {Messages | null} */
        this.messages = this.querySelector('arpa-messages');
        /** @type {MessageResource} */
        this.messageResource = this.messages?.resource;
    }

    _initializeSubmit() {
        this.submitButton = this.querySelector('button[type="submit"]');
        this.addEventListener('submit', this._onSubmit.bind(this));
    }

    _initializeFields() {
        this.formFields = this.querySelector('.arpaForm__fields');
        if (this.formFields) {
            appendNodes(this.formFields, this._childNodes);
        }
    }

    _onRenderComplete() {
        this._hasRendered = true;
        this._onComplete();
        this.resolvePromise?.(true);
    }

    _onComplete() {}

    // #endregion Lifecycle

    /////////////////////////////////
    // #region Get
    /////////////////////////////////

    getSubmitText() {
        return getProperty(this, 'submit-text') || html`<i18n-text key="common.labels.lblSubmit" />`;
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
        return this.getAttribute('title') || this._config?.title;
    }

    getVariant() {
        return this.getAttribute('variant') || this._config.variant;
    }

    // #endregion Get

    /////////////////////////////////
    // #region Has
    /////////////////////////////////

    hasInitialValues() {
        const { initialValues = {} } = this._config;
        return Object.keys(initialValues).length > 0;
    }

    hasTitle() {
        return getProperty(this, 'title') || hasZone(this, 'form-title');
    }

    hasFooter() {
        return this.hasSubmitButton() || hasZone(this, 'footer') || hasZone(this, 'controls');
    }

    hasDescription() {
        return getProperty(this, 'description') || hasZone(this, 'description');
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
        this._config.initialValues = copyObjectProps(values);
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
    }

    reset() {
        // !this.hasInitialValues() && this.render();
        this.messageResource?.deleteMessages();
    }

    // #endregion Set

    /////////////////////////////////
    // #region Rendering
    /////////////////////////////////

    /**
     * Returns the template variables for the form.
     * @returns {FormTemplatePropsType}
     */
    getTemplateVariables() {
        return {
            submitLabel: this.getSubmitText(),
            formId: this.id,
            title: this.renderTitle(),
            description: this.renderDescription(),
            submitButton: this.renderSubmitButton()
        };
    }

    /**
     * Renders the form.
     * @returns {void}
     * @throws {Error} If the form has no id.
     */
    render() {
        if (!this.id) throw new Error('Form must have an id.');
        if (!canRender(this)) return;
        attr(this, { novalidate: true, 'aria-label': this.getTitle() });
        const { variant } = this._config;
        this.renderTemplate();
        this._initializeFields();
        this._initializeNodes();
        this._initializeSubmit();
        this._initializeMessages();
        this.classList.add('arpaForm');
        variant && this.classList.add(`arpaForm--${variant}`);
        this.titleNode = this.querySelector('form-title');
        this.headerNode = this.querySelector('.arpaForm__header');
        this.errorsNode = this.querySelector('.arpaForm__errors');
        handleZones();
        this._onRenderComplete();
    }

    /**
     * Renders the form template.
     */
    renderTemplate() {
        const variant = this.getVariant();
        const template = variant === 'mini' ? this.renderMini() : this.renderFull();
        const content = processTemplate(template, this.getTemplateVariables());
        this.innerHTML = content;
    }

    renderFull() {
        return html`
            ${this.hasHeader() ? html`<div class="arpaForm__header" zone="header">{title}{description}</div>` : ''}
            <arpa-messages zone="messages" class="arpaForm__messages" id="{formId}-messages"></arpa-messages>
            <div class="arpaForm__body">
                <div class="arpaForm__fields"></div>
            </div>
            ${this.hasFooter() ? this.renderFooter() : ''}
        `;
    }

    renderDescription() {
        return this.hasDescription() ? html`<div class="arpaForm__description" zone="description"></div>` : '';
    }

    renderMini() {
        return html`
            ${this.renderTitle()}
            <div class="arpaForm__fields"></div>
        `;
    }

    renderTitle() {
        return this.hasTitle() ? html`<form-title zone="form-title"></form-title>` : '';
    }

    renderFooter() {
        return html`<div class="arpaFrom__footer" zone="footer">
            <div class="arpaForm__controls" zone="controls">{submitButton}</div>
        </div>`;
    }

    renderSubmitButton() {
        return render(
            this.hasSubmitButton() && getProperty(this, 'variant') !== 'mini',
            html`<button icon-right="check_circle" type="submit" class="arpaForm__submitBtn" is="submit-button">
                ${this.getSubmitText()}
            </button>`
        );
    }

    hasSubmitButton() {
        return hasProperty(this, 'has-submit');
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
            this.messageResource?.deleteMessages();
            const msg = this.getErrorMessage();
            msg &&
                this.messageResource?.error(msg, {
                    canClose: true
                });
            this.classList.add('formComponent--invalid');
        }
        return this._isValid;
    }

    getErrorMessage() {
        return this.getAttribute('error-message') || this._config?.errorMessage;
    }

    getSuccessMessage() {
        return this.getAttribute('success-message') || this._config?.successMessage;
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
        this._config.onSubmit = callback;
    }

    /**
     * Returns the onSubmit callback.
     * @returns {FormSubmitType | undefined}
     */
    getOnSubmit() {
        return this._config.onSubmit;
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
        return Number(this._config.debounce);
    }

    /**
     * Calls the onSubmit callback.
     * @returns {Promise<FormSubmitResponseType> | undefined | boolean}
     */
    _callOnSubmit() {
        this?.messageResource?.deleteMessages();
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
        successMessage && this.messageResource?.success(successMessage, { canClose: true });
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

customElements.define('arpa-form', FormComponent, { extends: 'form' });

export default FormComponent;
