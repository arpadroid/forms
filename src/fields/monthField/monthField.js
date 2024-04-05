import { mergeObjects, attr } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import TextField from '../textField/textField.js';

class MonthField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'month' }
        });
    }

    async _onInitialized() {
        await this.onReady();
        super._onInitialized();
        this.monthButton = this.renderMonthButton();
        this.inputMask.addRhs('monthButton', this.monthButton);
    }

    renderMonthButton() {
        const button = new IconButton({
            icon: 'calendar_month',
            onClick: () => this.input?.showPicker(),
            label: 'show month picker'
        });
        attr(button, { variant: 'minimal', 'tooltip-position': 'left' });
        return button;
    }
}

customElements.define('month-field', MonthField);

export default MonthField;
