/**
 * @typedef {import('@arpadroid/ui').ButtonConfigType} ButtonConfigType
 */
import { Button } from '@arpadroid/ui';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
class SubmitButton extends Button {
    /**
     * Returns the default configuration for the button.
     * @returns {ButtonConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'forms.form';
        this.bind('_handleButtonState');
        /** @type {ButtonConfigType} */
        const config = {
            type: 'submit',
            labelText: this.i18nText('lblSubmit'),
            variant: 'submit'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    _initialize() {
        this.onRenderReady(() => {
            /** @type {import('../field/field').FormComponent | null} */
            this.form = this.closest('arpa-form');
            this.form?.on('change', this._handleButtonState);
            this._handleButtonState();
        });
    }

    _handleButtonState() {
        const isValid = this.form?._validate();
        if (isValid) {
            this.removeAttribute('data-invalid');
        } else {
            this.setAttribute('data-invalid', '');
        }
    }
}

defineCustomElement('submit-button', SubmitButton);

export default SubmitButton;
