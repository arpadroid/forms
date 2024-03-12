import { mergeObjects, Regex } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import TextField from '../textField/textField.js';

/**
 * Represents a password field that extends the TextField class.
 */
class PasswordField extends TextField {
    /**
     * Returns the default configuration for the PasswordField.
     * @returns {import('./passwordFieldInterface.js').PasswordFieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            label: this.i18n?.lblPassword,
            icon: 'lock',
            confirm: false,
            required: true,
            regex: Regex.password,
            regexMessage: this.i18n?.errRegex,
            inputAttributes: {
                type: 'password'
            },
            confirmField: {}
        });
    }

    /**
     * Checks if the PasswordField has a confirm field.
     * @returns {boolean} True if the PasswordField has a confirm field, false otherwise.
     */
    hasConfirm() {
        return this.hasAttribute('confirm') ?? this._config.confirm;
    }

    /**
     * Called when the PasswordField is connected to the DOM.
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * Initializes the confirm field if the PasswordField has a confirm field.
     * @protected
     */
    _onConnected() {
        super._onConnected();
        if (this.hasConfirm()) {
            this._initializeConfirmField();
        }
        this.visButton = this.renderVisibilityButton();
        customElements.whenDefined('field-input-mask').then(() => {
            this.inputMask.rhs.appendChild(this.visButton);
        });
    }

    /**
     * Initializes the confirm field for password confirmation.
     * @protected
     */
    _initializeConfirmField() {
        this.confirmField = new PasswordField({
            form: this.form,
            id: this._id + '-confirmField',
            label: this.i18n?.lblConfirmPassword,
            required: true,
            ...this._config.confirmField,
            validation: () => this.validateConfirm()
        });
        this.form.registerField(this.confirmField);
        this.after(this.confirmField);
    }

    /**
     * Validates the password confirmation.
     * @returns {boolean} True if the password confirmation is valid, false otherwise.
     */
    validateConfirm() {
        const confirmValue = this.confirmField.getValue();
        if (!confirmValue) {
            return true;
        }
        if (this.confirmField.getValue() !== this.getValue()) {
            this.confirmField.setError(this.i18n.errPasswordMatch);
            return false;
        }
        return true;
    }

    /**
     * Renders the visibility button for toggling password visibility.
     * @returns {IconButton}
     */
    renderVisibilityButton() {
        const button = new IconButton({
            icon: 'visibility',
            label: 'Show password',
            tooltipPosition: 'left',
            onClick: () => this.togglePasswordVisibility()
        });
        button.setAttribute('variant', 'minimal');
        return button;
    }

    /**
     * Toggles the visibility of the password.
     */
    togglePasswordVisibility() {
        const isPassword = this.input.getAttribute('type') === 'password';
        this.input.setAttribute('type', isPassword ? 'text' : 'password');
        this.visButton.setAttribute('label', isPassword ? 'Hide password' : 'Show password');
        this.visButton.setAttribute('icon', isPassword ? 'visibility_off' : 'visibility');
    }
}

customElements.define('password-field', PasswordField);

export default PasswordField;
