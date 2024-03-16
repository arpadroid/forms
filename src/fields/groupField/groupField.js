import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';

/**
 * @typedef {import('./groupFieldInterface').GroupFieldInterface} GroupFieldInterface
 */

const html = String.raw;
class GroupField extends Field {
    static template = html`
        <details {isOpen}>
            <summary class="groupField__summary">
                <arpa-icon class="groupField__icon">{icon}</arpa-icon>
                <span class="groupField__summary__label">{label}</span>
                <arpa-tooltip position="bottom-right">{tooltip}</arpa-tooltip>
                <arpa-icon class="groupField__iconRight">{iconRight}</arpa-icon>
            </summary>
            <div class="groupField__fields"></div>
        </details>
    `;

    /**
     * Creates a new GroupField instance.
     * @param {GroupFieldInterface} config - The configuration object for the GroupField.
     */
    constructor(config) {
        super(config);
        this._fields = Array.from(this?.childNodes ?? []);
        this._content = this.innerHTML;
        this.innerHTML = '';
        this.classList.add('groupField');
        this.classList.remove('arpaField');
    }

    getIconRight() {
        const { openIcon, closedIcon } = this._config;
        return this.details && this.details.open ? openIcon : closedIcon || super.getIconRight();
    }

    /**
     * Returns the default configuration for the GroupField.
     * @returns {GroupFieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            isOpen: false,
            rememberToggle: false,
            isCollapsible: true,
            openIcon: 'keyboard_arrow_down',
            closedIcon: 'keyboard_arrow_right',
            template: GroupField.template
        });
    }

    _onConnected() {
        super._onConnected();
        this.fieldsNode = this.querySelector('.groupField__fields');
        this.fieldsNode.append(...this._fields);
        this.details = this.querySelector('details');
        if (this.details) {
            this.details.addEventListener('toggle', () => {
                this.update();
            });
        }
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            isOpen: (this.hasAttribute('open') || this._config.isOpen) && 'open'
        };
    }

    update() {
        const isOpen = this.details?.open;
        const icon = isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_left';
        this.iconNode = this.querySelector('.groupField__iconRight');
        if (this.iconNode) {
            this.iconNode.innerHTML = icon;
        }
    }

    getOutputValue() {
        return undefined;
    }
}

customElements.define('group-field', GroupField);

export default GroupField;
