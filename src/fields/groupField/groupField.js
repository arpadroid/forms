import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class GroupField extends Field {
    static template = html`
        <details open="{isOpen}">
            <summary class="groupField__summary">
                <arpa-icon class="groupField__icon">{icon}</arpa-icon>
                <summary class="field__label">{label}</summary>
                <arpa-tooltip position="bottom-right">{tooltip}</arpa-tooltip>
                <arpa-icon class="groupField__icon">{iconRight}</arpa-icon>
            </summary>
            <div class="groupField__fields"></div>
        </details>
    `;

    constructor(config) {
        super(config);
        this._fields = Array.from(this?.childNodes ?? []);
        this._content = this.innerHTML;
        this.innerHTML = '';
    }

    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            isOpen: true,
            rememberToggle: true,
            isCollapsible: true,
            iconRight: 'keyboard_arrow_down',
            template: GroupField.template
        });
    }

    _onConnected() {
        super._onConnected();
        this.fieldsNode = this.querySelector('.groupField__fields');
        this.fieldsNode.append(...this._fields);
    }

    getOutputValue() {
        return undefined;
    }
}

customElements.define('group-field', GroupField);

export default GroupField;
