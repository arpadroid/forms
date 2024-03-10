import { ComponentTool, ObserverTool, attr, isObject, mergeObjects, processTemplate } from '@arpadroid/tools';

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
        <form-body>
            <div class="arpaForm__fields"></div>
        </form-body>

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

    static get observedAttributes() {
        return ['initialValues'];
    }

    constructor(config) {
        super();
        ObserverTool.mixin(this);
        ComponentTool.applyOnReady(this, 'arpa-form');
        this.setConfig(config);
    }

    connectedCallback() {
        this.render();
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
            useTemplate: true
        };
    }

    attributeChangedCallback() {
        this.update();
    }

    /**
     * Renders the form.
     */
    render() {
        // this.content = this.innerHTML;
        attr(this, { novalidate: true });
        const { variant } = this._config;
        const contentNodes = [...this.childNodes];
        this.renderTemplate();
        this.formFields = this.querySelector('.arpaForm__fields');
        if (this.formFields) {
            this.formFields.append(...contentNodes);
        }
        // if (!this._hasRendered) {
        //     this.setInitialValues(initialValues);
        //     this.setValues(initialValues);
        // }
        this._hasRendered = true;
        if (variant) {
            this.classList.add(`arpaForm--${variant}`);
        }
        this.submitButton = this.querySelector('button[type="submit"]');
        this.addEventListener('submit', this._onSubmit.bind(this));
    }

    /**
     * Renders the form template.
     */
    renderTemplate() {
        const { template } = this._config;
        if (template && this.canUseTemplate()) {
            this.innerHTML = processTemplate(template, {
                submitLabel: this.getSubmitText()
            });
        }
    }

    canUseTemplate() {
        return this.getAttribute('useTemplate') !== 'false' && this._config.useTemplate;
    }

    /**
     * Sets the initial values for the form.
     * @param {Record<string, unknown>} _values
     */
    setInitialValues(_values = {}) {
        const values = {};
        for (const [key, value] of Object.entries(_values)) {
            if (Array.isArray(value)) {
                values[key] = [...value];
            } else if (isObject(value)) {
                values[key] = { ...value };
            } else {
                values[key] = value;
            }
        }
        this._config.initialValues = values;
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

    getSubmitText() {
        return (
            this.getAttribute('submitText') ||
            this._config.submitText ||
            '<i18n-text key="common.labels.lblSubmit" />'
        );
    }

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
            this.classList.add('formComponent--invalid');
        }
        if (!this._isValid) {
            // this.messenger.deleteMessages();
            // this.messenger.error(this.i18n.errForm);
        }
        return this._isValid;
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

    getFields() {
        return Object.values(this.fields);
    }

    getField(fieldId) {
        return this.fields[fieldId];
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
            this.focusFirstErroredInput();
        }
    }

    /**
     * Calls the onSubmit callback.
     * @returns {Promise<Response> | undefined}
     */
    _callOnSubmit() {
        // this?.messenger?.deleteMessages();
        const onSubmit = this.getOnSubmit();
        if (typeof onSubmit === 'function') {
            const payload = this._values;
            // this.startLoading();
            const rv = onSubmit(payload);
            if (typeof rv?.finally === 'function') {
                rv.then(response => {
                    // this._onSubmitSuccess();
                    // if (response?.formValues) {
                    //     this.setInitialValues(response.formValues);
                    //     this.setValues(response.formValues);
                    // } else if (!this.hasInitialValues()) {
                    //     // this.reset();
                    // }
                    return Promise.resolve(response);
                }).finally(() => {
                    // this.stopLoading();
                });
            } else {
                if (rv) {
                    this._onSubmitSuccess();
                }
                // this.stopLoading();
            }
            return rv;
        }
    }

    onSubmit(callback) {
        this._config.onSubmit = callback;
    }

    /**
     * Registers a field to the form.
     * @param {*} field
     */
    registerField(field) {
        this.fields[field.getId()] = field;
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
