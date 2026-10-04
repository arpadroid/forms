/**
 * @typedef {import('./passwordField.types').PasswordFieldConfigType} PasswordFieldConfigType
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { $attr, defineCustomElement, mergeObjects, RegexTool } from '@arpadroid/tools';
import TextField from '../textField/textField.js';

const html = String.raw;
class PasswordField extends TextField {
    _validations = [...super.getValidations(), 'confirm'];

    /** @type {PasswordFieldConfigType} */
    _config = this._config;

    /**
     * @returns {PasswordFieldConfigType}
     */
    getDefaultConfig() {
        /** @type {PasswordFieldConfigType} */
        const conf = {
            icon: 'lock',
            confirm: false,
            required: true,
            mode: 'register',
            inputType: 'password',
            confirmField: {},
            isConfirm: false,
            hasVisibilityButton: true,
            lblShowPassword: this.i18nText('lblShowPassword'),
            lblConfirmPassword: this.i18nText('lblConfirmPassword')
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    setConfig(_config = {}) {
        super.setConfig(_config);
        this._initializeMode();
    }

    _initializeMode(config = this._config ?? {}) {
        const mode = this.getProp('mode');
        if (!config.inputAttributes) config.inputAttributes = {};
        if (mode === 'register') {
            config.inputAttributes.autocomplete = 'new-password';
            this.setAttribute('regex', RegexTool.password.toString());
            this.setAttribute('regex-message', this.i18nText('errRegex'));
        } else if (mode === 'login') {
            config.inputAttributes.autocomplete = 'current-password';
            config.confirm = undefined;
            this.deleteProperties('regex', 'regex-message');
        }
    }

    getFieldType() {
        return 'password';
    }

    getOutputValue() {
        return this.hasProp('isConfirm') ? undefined : super.getOutputValue();
    }

    hasConfirm() {
        return Boolean(!this.hasProp('isConfirm') && this.getProp('mode') !== 'login' && this.hasProp('confirm')) ?? true;
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputMaskRhs">
                <arpa-node
                    name="visibilityButton"
                    tag="icon-button"
                    icon="visibility"
                    tooltip="{lblShowPassword}"
                    on-click="{togglePasswordVisibility}"
                    variant="minimal"
                    tooltip-position="left"
                    can-render="hasVisibilityButton"
                ></arpa-node>
            </arpa-zone>
            <arpa-node
                name="confirm"
                tag="password-field"
                id="{id}-confirm"
                is-confirm
                class-name="arpaField"
                required
                can-render="confirm"
                label="{lblConfirmPassword}"
                ${$attr(this._config.confirmField || {})}
            ></arpa-node>
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.waitForArpaNodes();
        this.visButton = /** @type {IconButton | null} */ (this.nodes.visibilityButton);
        this.confirmField = /** @type {PasswordField | null} */ (this.nodes.confirm);
        return true;
    }

    togglePasswordVisibility() {
        const isPassword = this.input?.getAttribute('type') === 'password';
        this.input?.setAttribute('type', isPassword ? 'text' : 'password');
        this.visButton?.setTooltip(this.i18nText(isPassword ? 'lblHidePassword' : 'lblShowPassword'));
        this.visButton?.setIcon(isPassword ? 'visibility_off' : 'visibility');
    }

    validateConfirm() {
        if (!this.confirmField) {
            return true;
        }
        const confirmValue = this.confirmField.getValue();
        if (!confirmValue) {
            return true;
        }
        if (this.confirmField.getValue() !== this.getValue()) {
            this.setError(this.i18n('errPasswordMatch'));
            return false;
        }
        return true;
    }
}

defineCustomElement('password-field', PasswordField);

export default PasswordField;
