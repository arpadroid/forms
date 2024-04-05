/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@arpadroid/ui/src/index').Messages} Messages
 * @typedef {import('@arpadroid/application/src/index').MessageResource} MessageResource
 */
import { mergeObjects, processTemplate, copyObjectProps } from '@arpadroid/tools';
import { ComponentTool, ObserverTool, attr } from '@arpadroid/tools';
import { CircularPreloader } from '@arpadroid/ui';
import { I18n } from '@arpadroid/i18n';

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
 * @property {boolean} [hasSubmitButton=true] - Whether the form has a submit button.
 * @property {string} [submitText] - The submit button text.
 */

const html = String.raw;

class FormComponent extends HTMLFormElement {
    fields = {};
    template = html`
        <form-header>
            <form-title></form-title>
            <form-description></form-description>
        </form-header>
        <arpa-messages class="arpaForm__messages" id="{formId}-messages"></arpa-messages>
        <div class="arpaForm__body">
            <div class="arpaForm__fields"></div>
        </div>

        <form-footer>
            <form-controls>
                <button
                    icon-right="check_circle"
                    type="submit"
                    class="arpaForm__submitBtn"
                    is="submit-button"
                >
                    {submitLabel}
                </button>
            </form-controls>
        </form-footer>
    `;

    /**
     * CUSTOM ELEMENT.
     */

    static get observedAttributes() {}

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.update();
    }

    constructor(config) {
        super();
        ObserverTool.mixin(this);
        this.i18n = I18n.get('modules.form.formComponent');
        ComponentTool.applyOnReady(this, 'arpa-form');
        this.setConfig(config);
    }

    /**
     * Sets the form configuration.
     * @param {FormConfigInterface} config - The form configuration.
     */
    setConfig(config) {
        this._config = mergeObjects(this.getDefaultConfig(), config);
    }

    /**
     * Returns the form configuration.
     * @returns {FormConfigInterface} The form configuration.
     */
    getDefaultConfig() {
        return {
            variant: 'default',
            template: this.template,
            hasSubmitButton: true,
            initialValues: {},
            onSubmit: undefined,
            debounce: 1000,
            useTemplate: true,
            successMessage: this.i18n.msgSuccess,
            errorMessage: this.i18n.msgError
        };
    }

    /**
     * ACCESSORS.
     */

    canUseTemplate() {
        return this.getAttribute('useTemplate') !== 'false' && this._config.useTemplate;
    }

    getSubmitText() {
        return (
            this.getAttribute('submitText') ||
            this._config.submitText ||
            '<i18n-text key="common.labels.lblSubmit" />'
        );
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

    /**
     * RENDER.
     */

    /**
     * Renders the form.
     */
    render() {
        attr(this, { novalidate: true });
        const { variant } = this._config;
        const contentNodes = [...this.childNodes];
        this.renderTemplate();
        this._initializeFields(contentNodes);
        this._initializeNodes();
        this._initializeSubmit();
        this._initializeMessages();
        this._hasRendered = true;
        this.classList.add('arpaForm');
        if (variant) {
            this.classList.add(`arpaForm--${variant}`);
        }
    }

    /**
     * Renders the form template.
     */
    renderTemplate() {
        const { template } = this._config;
        if (template && this.canUseTemplate()) {
            this.innerHTML = processTemplate(template, this.getTemplateVariables());
        }
    }

    getTemplateVariables() {
        return {
            submitLabel: this.getSubmitText(),
            formId: this.id
        };
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

    _initializeFields(contentNodes) {
        this.formFields = this.querySelector('.arpaForm__fields');
        if (this.formFields) {
            this.formFields.append(...contentNodes);
        }
    }

    /**
     * VALIDATION.
     */

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
            this.messageResource.error(this._config.errorMessage, {
                canClose: true
            });
            this.classList.add('formComponent--invalid');
        }
        return this._isValid;
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
        if (event) {
            event.preventDefault();
        }
        const time = new Date().getTime();
        const diff = time - this.submitTime;
        const debounce = Number(this._config.debounce);
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
            if (rv) {
                this._onSubmitSuccess();
            }
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
        this.getFields().forEach(field => {
            field.onSubmitSuccess();
        });
        const { successMessage } = this._config;
        if (successMessage) {
            this?.messageResource.success(successMessage);
        }
    }

    startLoading() {
        if (!this.preloader) {
            this.preloader = new CircularPreloader();
        }
        this.bodyNode.append(this.preloader);
    }

    stopLoading() {
        this.preloader?.remove();
        const { variant } = this._config;
        if (variant !== 'mini') {
            this.scrollIntoView();
        }
    }

    focusFirstErroredInput() {
        const errorInputSelector =
            '.arpaField--hasError input, .arpaField--hasError textarea, .arpaField--hasError select';
        const firstInput = this.querySelector(errorInputSelector);
        if (firstInput?.focus) {
            firstInput.focus();
        }
    }
}

customElements.define('arpa-form', FormComponent, { extends: 'form' });

export default FormComponent;
