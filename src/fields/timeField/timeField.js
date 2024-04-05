import { mergeObjects, attr } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';

import TextField from '../textField/textField.js';

class TimeField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'time' }
        });
    }

    async _onInitialized() {
        await this.onReady();
        super._onInitialized();
        this.timeButton = this.renderTimeButton();
        this.inputMask.addRhs('timeButton', this.timeButton);
    }

    renderTimeButton() {
        const button = new IconButton({
            icon: 'schedule',
            onClick: () => this.input?.showPicker(),
            label: 'show time picker'
        });
        attr(button, { variant: 'minimal', 'tooltip-position': 'left' });
        return button;
    }
}

customElements.define('time-field', TimeField);

export default TimeField;
