import { mergeObjects, attr } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';

class WeekField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'week' }
        });
    }

    getFieldType() {
        return 'week';
    }

    getTagName() {
        return 'week-field';
    }

    async _onInitialized() {
        await this.onReady();
        super._onInitialized();
        this.weekButton = this.renderWeekButton();
        this.inputMask.addRhs('timeButton', this.weekButton);
    }

    renderWeekButton() {
        const button = new IconButton({
            icon: 'date_range',
            onClick: () => this.input?.showPicker(),
            label: I18n.getText('modules.form.fields.week.lblShowPicker')
        });
        attr(button, { variant: 'minimal', 'tooltip-position': 'left' });
        return button;
    }
}

customElements.define(WeekField.prototype.getTagName(), WeekField);

export default WeekField;
