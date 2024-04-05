import { mergeObjects, attr } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import TextField from '../textField/textField.js';

class WeekField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'week' }
        });
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
            label: 'show week picker'
        });
        attr(button, { variant: 'minimal', 'tooltip-position': 'left' });
        return button;
    }
}

customElements.define('week-field', WeekField);

export default WeekField;
