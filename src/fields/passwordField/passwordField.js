import { mergeObjects, Regex } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import TextField from '../textField/textField.js';

class PasswordField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            label: this.i18n?.lblPassword,
            icon: 'lock',
            confirm: false,
            isLoginField: true,
            required: true,
            regex: Regex.password,
            regexMessage: this.i18n?.errRegex,
            required: true,
            inputAttributes: {
                type: 'password'
            },
            confirmField: {}
        });
    }

    hasConfirm() {
        return this.hasAttribute('confirm') ?? this._config.confirm;
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    render() {
        if (this.hasConfirm()) {
            this._initializeConfirmField();
        }
        this.visButton = this.renderVisibilityButton();
        customElements.whenDefined('field-input-mask').then(() => {
            this.inputMask.rhs.appendChild(this.visButton);
        });
    }

    _initializeConfirmField() {
        this.confirmField = new PasswordField({
            id: this._id + '-confirmField',
            label: this.i18n?.lblConfirmPassword,
            required: true,
            ...this._config.confirmField,
            validation: () => this.validateConfirm()
        });
        this.form.registerField(this.confirmField);
        this.after(this.confirmField);
    }

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

    togglePasswordVisibility() {
        const isPassword = this.input.getAttribute('type') === 'password';
        this.input.setAttribute('type', isPassword ? 'text' : 'password');
        this.visButton.setAttribute('label', isPassword ? 'Hide password' : 'Show password');
        this.visButton.setAttribute('icon', isPassword ? 'visibility_off' : 'visibility');
    }
}

customElements.define('password-field', PasswordField);

export default PasswordField;
