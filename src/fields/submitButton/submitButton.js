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
            labelText: this.i18nText('lblSubmit'),
            iconInvalid: 'block',
            variant: 'submit'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    async _initializeNodes() {
        await super._initializeNodes();
        this._handleButtonState();
        /** @type {import('../field/field').FormComponent | null} */
        this.form = this.closest('arpa-form');
        this.form?.on('change', this._handleButtonState);
        console.log('Submit button initialized', this.button);
        return true;
    }

    _handleButtonState() {
        const isValid = this.form?._validate();
        const iconInvalid = this.getProperty('icon-invalid');
        const icon = this.form?.getProperty('submit-icon') || this.getIcon();
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
