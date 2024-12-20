import { mergeObjects, attr, timeStringToSeconds, renderNode } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';
const html = String.raw;
class TimeField extends TextField {
    _validations = [...super.getValidations(), 'min', 'max'];
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'time' },
            pickerLabel: I18n.getText('forms.fields.time.lblShowPicker')
        });
    }

    getI18nKey() {
        return 'forms.fields.time';
    }

    getFieldType() {
        return 'time';
    }

    getTagName() {
        return 'time-field';
    }

    async _initializeNodes() {
        super._initializeNodes();
        super._onInitialized();
        this.timeButton = this.renderTimeButton();
        this.inputMask.addRhs('timeButton', this.timeButton);
    }

    async _onConnected() {
        await this.onReady();
        super._onConnected();
        const min = this.getProperty('min');
        const max = this.getProperty('max');
        attr(this.input, { min, max });
    }

    renderTimeButton() {
        const { pickerLabel } = this._config;
        const button = renderNode(
            html`<button
                is="icon-button"
                icon="schedule"
                label="${pickerLabel}"
                tooltip-position="left"
                variant="minimal"
            ></button>`
        );
        button.addEventListener('click', () => this.input?.showPicker());
        return button;
    }

    validateMin(value) {
        const min = this.getProperty('min');
        if (value && min) {
            const minSeconds = timeStringToSeconds(min);
            const seconds = timeStringToSeconds(value);
            if (seconds < minSeconds) {
                this.validator.setError(
                    html`<i18n-text key="${this.getI18nKey()}.errMin" replacements="min::${min}"></i18n-text>`
                );
                return false;
            }
        }
        return true;
    }

    validateMax(value) {
        const max = this.getProperty('max');
        if (value && max) {
            const maxSeconds = timeStringToSeconds(max);
            const seconds = timeStringToSeconds(value);
            if (seconds > maxSeconds) {
                this.validator.setError(
                    html`<i18n-text key="${this.getI18nKey()}.errMax" replacements="max::${max}"></i18n-text>`
                );
                return false;
            }
        }
        return true;
    }
}

customElements.define(TimeField.prototype.getTagName(), TimeField);

export default TimeField;
