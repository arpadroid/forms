/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@arpadroid/ui/src/index').Messages} Messages
 * @typedef {import('@arpadroid/application/src/index').MessageResource} MessageResource
 */
import { mergeObjects, copyObjectProps, zoneMixin, appendNodes } from '@arpadroid/tools';
import { ObserverTool, attr, renderNode, render, CustomElementTool, handleZones, hasZone } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';

const { hasProperty, getProperty } = CustomElementTool;

/**
 * The form configuration.
 * @typedef {object} FormConfigInterface
 * @property {string} id - The form id.
 * @property {Record<string,unknown>} initialValues - The initial values for the form.
 * @property {string} [variant=default] - The form variant.
 * @property {string} [submitButtonText=Submit] - The text for the submit button.
 * @property {(values: Record<string, unknown>, form: FormComponent) => void} [onSubmit] - The submit event handler.
 * @property {number} [debounce=500] - The debounce time for the submit event.
 * @property {string} [template] - The form template.
 * @property {boolean} [hasSubmit=true] - Whether the form has a submit button.
 * @property {string} [submitText] - The submit button text.
 */

const html = String.raw;

class FormComponent extends HTMLFormElement {
    fields = {};

    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    constructor(config) {
        super();
        zoneMixin(this);
        ObserverTool.mixin(this);
        this.setConfig(config);
        this.promise = this.getPromise();
        this._childNodes = [...this.childNodes];
    }

    getPromise() {
        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
    }

    i18n(key, replacements, attributes) {
        return I18nTool.arpaElementI18n(this, key, replacements, attributes, 'modules.form.formComponent');
    }

    /**
     * Returns the form configuration.
     * @returns {FormConfigInterface} The form configuration.
     */
    getDefaultConfig() {
        return {
            variant: 'default',
            hasSubmit: true,
            initialValues: {},
            onSubmit: undefined,
            debounce: 1000,
            useTemplate: true,
            successMessage: this.i18n('msgSuccess'),
            errorMessage: this.i18n('msgError')
        };
    }

    /**
     * Sets the form configuration.
     * @param {FormConfigInterface} config - The form configuration.
     */
    setConfig(config) {
        this._config = mergeObjects(this.getDefaultConfig(), config);
    }

    // #endregion

    ////////////////////
    // #region LIFECYCLE
    ////////////////////

    static get observedAttributes() {}

    connectedCallback() {
        if (!this._hasRendered) {
            this.render();
        }
    }

    disconnectedCallback() {
        this._onDestroy();
    }

    _onDestroy() {}

    attributeChangedCallback() {
        this.update();
    }

    _initializeNodes() {
        this.bodyNode = this.querySelector('.arpaForm__body');
        this.messagesNode = this.querySelector('arpa-messages');
    }

    async _initializeMessages() {
        await customElements.whenDefined('arpa-messages');
        /** @type {Messages} */
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

    // #endregion

    /////////////////////
    // #region ACCESSORS
    /////////////////////

    canUseTemplate() {
        return this.getAttribute('useTemplate') !== 'false' && this._config.useTemplate;
    }

    getSubmitText() {
        return getProperty(this, 'submit-text') || html`<i18n-text key="common.labels.lblSubmit" />`;
    }

    getFields() {
        return Object.values(this.fields);
    }

    getField(fieldId) {
        return this.fields[fieldId];
    }

    reset() {
        if (!this.hasInitialValues()) {
            // this.render();
        }
        this.messageResource.deleteMessages();
    }

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
        if (values) {
            for (const [fieldId, value] of Object.entries(values)) {
                if (this.fields[fieldId]) {
                    this.fields[fieldId].setValue(value);
                }
            }
        }
    }

    getValues() {
        this._values = {};
        this.getFields().forEach(field => {
            const value = field.getOutputValue(this._values);
            if (typeof value !== 'undefined') {
                this._values[field.getId()] = value;
            }
        });
        return this._values;
    }

    /**
     * Registers a field to the form.
     * @param {*} field
     */
    registerField(field) {
        this.fields[field.getId()] = field;
    }

    getTitle() {
        return this.getAttribute('title') || this._config.title;
    }

    getVariant() {
        return this.getAttribute('variant') || this._config.variant;
    }

    // #endregion

    ////////////////////
    // #region RENDERING
    ////////////////////

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
        if (!this.id) {
            throw new Error('Form must have an id.');
        }
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
        requestAnimationFrame(() => this._onRenderComplete());
    }

    _onRenderComplete() {
        this._hasRendered = true;
        this._onComplete();
        this.resolvePromise?.();
    }

    _onComplete() {}

    /**
     * Renders the form template.
     */
    renderTemplate() {
        const variant = this.getVariant();
        const template = variant === 'mini' ? this.renderMini() : this.renderFull();
        if (template && this.canUseTemplate()) {
            this.innerHTML = I18nTool.processTemplate(template, this.getTemplateVariables());
        }
    }

    renderFull() {
        return html`
            <div class="arpaForm__header" zone="header">{title}{description}</div>
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
            <arpa-messages zone="messages" class="arpaForm__messages" id="{formId}-messages"></arpa-messages>
            <div class="arpaForm__fields"></div>
        `;
    }

    renderTitle() {
        return html`<form-title zone="form-title"></form-title>`;
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

    // #endregion

    //////////////////////
    // #region VALIDATION
    //////////////////////

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
            this.messageResource.deleteMessages();
            this.messageResource.error(this.getErrorMessage(), {
                canClose: true
            });
            this.classList.add('formComponent--invalid');
        }
        return this._isValid;
    }

    getErrorMessage() {
        return this.getAttribute('error-message') || this._config.errorMessage;
    }

    getSuccessMessage() {
        return this.getAttribute('success-message') || this._config.successMessage;
    }

    /**
     * SUBMISSION.
     */

    onSubmit(callback) {
        this._config.onSubmit = callback;
    }

    getOnSubmit() {
        return this._config.onSubmit;
    }

    /**
     * Debounces submit, validates form and if valid calls the onSubmit callback.
     * @param {Event} event
     * @returns {Promise<Response> | undefined}
     */
    _onSubmit(event) {
        event?.preventDefault();
        const time = new Date().getTime();
        const diff = time - this.submitTime;
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

    submitForm(event) {
        this._onSubmit(event);
    }

    getDebounce() {
        if (this.hasAttribute('debounce')) {
            return parseFloat(this.getAttribute('debounce'));
        }
        return Number(this._config.debounce);
    }

    /**
     * Calls the onSubmit callback.
     * @returns {Promise<Response> | undefined}
     */
    _callOnSubmit() {
        this?.messageResource?.deleteMessages();
        const onSubmit = this.getOnSubmit();
        if (typeof onSubmit === 'function') {
            const payload = this._values;
            this.startLoading();
            const rv = onSubmit(payload);
            if (typeof rv?.finally === 'function') {
                this.handlePromise(rv);
                return rv;
            }
            rv && this._onSubmitSuccess();
            this.stopLoading();
            return rv;
        }
    }

    handlePromise(promise) {
        return promise
            .then(response => {
                this._onSubmitSuccess();
                if (response?.formValues) {
                    this.setInitialValues(response.formValues);
                    this.setValues(response.formValues);
                } else if (!this.hasInitialValues()) {
                    this.reset();
                }
                return Promise.resolve(response);
            })
            .finally(() => this.stopLoading());
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
        this.bodyNode?.append(this.preloader);
    }

    stopLoading() {
        this.preloader?.remove();
        this.getVariant() !== 'mini' && this.scrollIntoView();
    }

    focusFirstErroredInput() {
        const errorInputSelector = '.arpaField--hasError input, .arpaField--hasError textarea, .arpaField--hasError select';
        const firstInput = this.querySelector(errorInputSelector);
        firstInput?.focus();
    }

    // #endregion
}

customElements.define('arpa-form', FormComponent, { extends: 'form' });

export default FormComponent;
