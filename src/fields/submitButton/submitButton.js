/**
 * @typedef {import('./submitButton.types').SubmitButtonConfigType} SubmitButtonConfigType
 */
import { Button } from '@arpadroid/ui';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
class SubmitButton extends Button {
    /**
     * Returns the default configuration for the button.
     * @returns {SubmitButtonConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'forms.form';
        this.bind('_handleButtonState');
        /** @type {SubmitButtonConfigType} */
        const config = {
            type: 'submit',
            label: this.i18nText('lblSubmit'),
            iconInvalid: 'block',
            variant: 'submit'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this._handleButtonState();
        /** @type {import('../field/field').FormComponent | null} */
        this.form = this.closest('arpa-form');
        this.form?.on('change', this._handleButtonState);
        return true;
    }

    _handleButtonState() {
        const isValid = this.form?._validate();
        const iconInvalid = this.getProp('icon-invalid');
        const icon = this.form?.getProp('submit-icon') || this.getProp('icon');
        if (isValid) {
            this.button?.removeAttribute('data-invalid');
            icon && this.setIcon(icon);
        } else {
            this.button?.setAttribute('data-invalid', '');
            iconInvalid && this.setIcon(iconInvalid);
        }
    }
}

defineCustomElement('submit-button', SubmitButton);

export default SubmitButton;
