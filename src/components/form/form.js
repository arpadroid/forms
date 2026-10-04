/**
 * @typedef {import('./form.types').FormConfigType} FormConfigType
 * @typedef {import('./form.types').FormSubmitType} FormSubmitType
 * @typedef {import('./form.types').FormSubmitResponseType} FormSubmitResponseType
 * @typedef {import('../../fields/field/field').default} FieldComponent
 * @typedef {import('@arpadroid/messages').Messages} Messages
 * @typedef {import('../../fields/submitButton/submitButton').default} SubmitButton
 */
import { mergeObjects, copyObjectProps, defineCustomElement } from '@arpadroid/tools';
import { observerMixin, renderNode, dummySignal, dummyListener, dummyOff } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class FormComponent extends ArpaElement {
    /** @type {Record<string, FieldComponent>} */
    fields = {};
    touched = false;

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
    $initialize() {
        this.bind('_onChange');
        if (this.hasAttribute('title')) {
            this._config.title = this.getProp('title');
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
            attributeList: ['id'],
            hasSubmit: true,
            hasMessages: true,
            initialValues: {},
            onSubmit: undefined,
            debounce: 1000,
            successMessage: this.i18n('msgSuccess'),
            submitIcon: 'check_circle',
            errorMessage: this.i18n('msgError'),
            className: 'arpaForm',
            classNames: [() => `arpaForm--${this.getProp('variant')}`]
        };
        return mergeObjects(super.getDefaultConfig(), config);
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

    getFields() {
        return Object.values(this.fields);
    }

    /**
     * @param {string} fieldId
     * @returns {FieldComponent | undefined}
     */
    getField(fieldId) {
        return this.fields?.[fieldId];
    }

    /**
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

    hasInitialValues() {
        const { initialValues = {} } = this._config || {};
        return Object.keys(initialValues).length > 0;
    }

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
        this._config.debounce = value;
    }

    /////////////////////////////////
    // #region Rendering
    /////////////////////////////////

    isMini() {
        return this.getProp('variant') === 'mini';
    }

    $renderBlueprint() {
        !this.id && console.warn('Form must have an id.', this);
        return html`
            <arpa-node name="header">
                <arpa-node name="titleWrapper">
                    <arpa-node tag="arpa-icon" name="titleIcon"></arpa-node>
                    <arpa-node tag="h2" name="title"></arpa-node>
                    <arpa-node tag="arpa-icon" name="titleIconRight"></arpa-node>
                </arpa-node>
                <arpa-node tag="p" name="description"></arpa-node>
            </arpa-node>
            <arpa-node name="messages" tag="arpa-messages" id="{id}-messages" can-render="hasMessages"></arpa-node>
            <arpa-node name="body">
                <arpa-node name="fields" is-content must-render></arpa-node>
            </arpa-node>
            <arpa-node name="footer">
                <arpa-node name="controls">
                    <arpa-node
                        tag="submit-button"
                        name="submitBtn"
                        icon="{submitIcon}"
                        type="submit"
                        class="arpaForm__submitBtn"
                        can-render="!isMini() && hasSubmit"
                    ></arpa-node>
                </arpa-node>
            </arpa-node>
        `;
    }

    $renderTemplate() {
        return html`<arpa-node name="form" tag="form" novalidate on-submit="{submitForm}">
            <arpa-frag name="fullContent" can-render="!isMini()">{header}{messages}{body}{footer}</arpa-frag>
            <arpa-frag name="miniContent" can-render="isMini()">{title}{fields}</arpa-frag>
        </arpa-node>`;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.bodyNode = this.nodes.body;
        this.formNode = /** @type {HTMLFormElement | null} */ (this.nodes.form);
        this.submit = /** @type {SubmitButton | null} */ (this.nodes.submitBtn);
        this.messages = /** @type {Messages | null} */ (this.nodes.messages);
        this.touched = false;
        return true;
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
        this._validate();
        if (this._isValid) {
            this.classList.remove('formComponent--invalid');
        } else {
            this.messages?.deleteMessages();
            const msg = this.getProp('errorMessage');
            msg && this.messages?.error(msg, { canClose: true });
            this.classList.add('formComponent--invalid');
        }
        return Boolean(this._isValid);
    }

    _validate() {
        this.getValues();
        this._isValid = true;
        this.getFields().forEach(field => !field.validate() && (this._isValid = false));
        return this._isValid;
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
        this.touched = true;
        this._config && (this._config.onSubmit = callback);
    }

    /**
     * Debounces submit, validates form and if valid calls the onSubmit callback.
     * @param {Event} event
     * @returns {Promise<FormSubmitResponseType> | undefined | boolean}
     */
    submitForm(event) {
        event?.preventDefault();
        const time = new Date().getTime();
        const diff = time - (this.submitTime || 0);
        const debounce = Number(this.getProp('debounce'));
        if (debounce && this.submitTime && diff < debounce) {
            return;
        }

        this.submitTime = time;
        const isValid = this.validate();
        if (isValid) {
            return this._callOnSubmit();
        } else {
            this.scrollIntoView();
            this.focusFirstErroredInput();
        }
    }

    /**
     * Calls the onSubmit callback.
     * @returns {Promise<FormSubmitResponseType> | undefined | boolean}
     */
    _callOnSubmit() {
        this?.messages?.deleteMessages();
        const onSubmit = this._config?.onSubmit;
        if (typeof onSubmit === 'function') {
            const payload = this._values;
            this.startLoading();
            const rv = onSubmit(payload);
            if (rv instanceof Promise && typeof rv?.finally === 'function') {
                rv.then(this._onPromiseResolved).finally(() => this.stopLoading());
                return rv;
            }
            rv && this._onSubmitSuccess();
            this.stopLoading();
            return rv;
        }
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
        const successMessage = this.getProp('successMessage');
        successMessage && this.messages?.success(successMessage, { canClose: true });
    }

    startLoading() {
        if (!this.preloader) {
            this.preloader = renderNode(html`<circular-spinner></circular-spinner>`);
        }
        this.preloader && this.bodyNode?.append(this.preloader);
    }

    stopLoading() {
        this.preloader instanceof HTMLElement && this.preloader?.remove();
        this.getProp('variant') !== 'mini' && this.scrollIntoView();
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
