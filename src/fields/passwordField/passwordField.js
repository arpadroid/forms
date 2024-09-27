import { mergeObjects, Regex, renderNode } from '@arpadroid/tools';
import TextField from '../textField/textField.js';

const html = String.raw;
class PasswordField extends TextField {
    /**
     * Returns the default configuration for the PasswordField.
     * @returns {import('./passwordFieldInterface.js').PasswordFieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            label: this._i18n?.lblPassword,
            icon: 'lock',
            confirm: false,
            required: true,
            mode: 'register',
            inputAttributes: { type: 'password' },
            confirmField: {},
            isConfirm: false,
            lblShowPassword: this._i18n?.lblShowPassword
        });
    }

    setConfig(_config = {}) {
        super.setConfig(_config);
        this._initializeConfig();
    }

    _initializeConfig() {
        const config = this._config;
        const mode = this.getAttribute('mode') ?? config.mode;
        if (mode === 'register') {
            config.inputAttributes.autocomplete = 'new-password';
            this.setAttribute('regex', Regex.password);
            this.setAttribute('regex-message', this._i18n?.errRegex);
        } else if (mode === 'login') {
            config.inputAttributes.autocomplete = 'current-password';
            config.confirm = undefined;
            this.deleteProperties('regex', 'regex-message');
        }
    }

    getFieldType() {
        return 'password';
    }

    getTagName() {
        return 'password-field';
    }

    getOutputValue() {
        return this._config?.isConfirm ? undefined : super.getOutputValue();
    }

    getMode() {
        return this.getProperty('mode');
    }

    /**
     * Checks if the PasswordField has a confirm field.
     * @returns {boolean} True if the PasswordField has a confirm field, false otherwise.
     */
    hasConfirm() {
        const { isConfirm } = this._config;
        return (!isConfirm && this.getMode() !== 'login' && this.hasProperty('confirm')) ?? true;
    }

    /**
     * Renders the visibility button for toggling password visibility.
     * @returns {HTMLButtonElement}
     */
    renderVisibilityButton() {
        const { lblShowPassword } = this._config;
        const button = renderNode(
            html`<button
                is="icon-button"
                icon="visibility"
                label="${lblShowPassword}"
                variant="minimal"
                tooltip-position="left"
            ></button>`
        );
        button.addEventListener('click', () => this.togglePasswordVisibility());
        return button;
    }

    //////////////////////
    // #region Lifecycle
    //////////////////////

    /**
     * Initializes the confirm field if the PasswordField has a confirm field.
     * @protected
     */
    async _onConnected() {
        await this.onReady();
        super._onConnected();
        this._initializeConfirmField();
        if (!this.visButton) {
            this.visButton = this.renderVisibilityButton();
            this.inputMask.addRhs('visibilityButton', this.visButton);
        }
    }

    static get observedAttributes() {
        return ['confirm', 'mode'];
    }

    attributeChangedCallback(name) {
        if (this._config?.isConfirm) {
            return;
        }
        if (name === 'confirm') {
            this._initializeConfirmField();
        } else if (name === 'mode') {
            this.connectedCallback();
        }
    }

    /**
     * Initializes the confirm field for password confirmation.
     * @protected
     */
    _initializeConfirmField() {
        if (this._config.isConfirm) {
            return;
        }
        if (!this.hasConfirm()) {
            if (this.confirmField) {
                this.confirmField.remove();
                this.confirmField = null;
            }
            return;
        }
        if (!this.confirmField) {
            this.confirmField = new PasswordField({
                form: this.form,
                id: this._id + '-confirm',
                isConfirm: true,
                label: this._i18n?.lblConfirmPassword,
                required: true,
                inputAttributes: { autocomplete: 'new-password' },
                ...this._config.confirmField,
                validation: () => this.validateConfirm()
            });
            this.form?.registerField(this.confirmField);
        }
        this.after(this.confirmField);
    }

    /**
     * Toggles the visibility of the password.
     */
    togglePasswordVisibility() {
        const isPassword = this.input.getAttribute('type') === 'password';
        this.input.setAttribute('type', isPassword ? 'text' : 'password');
        this.visButton.setAttribute('label', isPassword ? this._i18n.lblHidePassword : this._i18n.lblShowPassword);
        this.visButton.setAttribute('icon', isPassword ? 'visibility_off' : 'visibility');
    }

    // #endregion Lifecycle

    /////////////////////
    // #region Validation
    /////////////////////

    /**
     * Validates the password confirmation.
     * @returns {boolean} True if the password confirmation is valid, false otherwise.
     */
    validateConfirm() {
        if (!this.confirmField) {
            return true;
        }
        const confirmValue = this.confirmField.getValue();
        if (!confirmValue) {
            return true;
        }
        if (this.confirmField.getValue() !== this.getValue()) {
            this.confirmField.setError(this.i18n('errPasswordMatch'));
            return false;
        }
        return true;
    }

    // #endregion Validation
}

customElements.define(PasswordField.prototype.getTagName(), PasswordField);

export default PasswordField;
