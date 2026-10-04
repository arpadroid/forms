import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import Field from '../field/field.js';

/**
 * @typedef {import('./groupField.types').GroupFieldConfigType} GroupFieldConfigType
 */

const html = String.raw;
class GroupField extends Field {
    /** @type {GroupFieldConfigType} */
    _config = this._config;

    /**
     * Returns the default configuration for the GroupField.
     * @returns {GroupFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        /** @type {GroupFieldConfigType} */
        const conf = {
            open: undefined,
            classNames: ['groupField'],
            rememberToggle: undefined,
            isCollapsible: undefined,
            openIcon: 'keyboard_arrow_down',
            closedIcon: 'keyboard_arrow_right'
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    getFieldType() {
        return 'group';
    }

    getFields() {
        return this.fieldsNode?.children;
    }

    /**
     * Returns the icon to display on the right side of the group field.
     * @returns {string | undefined} The icon to display.
     */
    getIconRight() {
        const { openIcon, closedIcon } = this._config;
        return this.details && this.details.open ? openIcon : closedIcon || super.getIconRight();
    }

    getOutputValue() {
        return undefined;
    }

    getSavedToggleState() {
        return localStorage.getItem(this.getHtmlId() + '-toggleState');
    }

    isCollapsible() {
        return this.hasProp('is-collapsible') ?? true;
    }

    _isOpen() {
        const savedToggle = this.getSavedToggleState();
        if (this.hasProp('rememberToggle') && savedToggle) {
            return savedToggle === 'true';
        }
        return this.hasProp('open');
    }

    isOpen() {
        return this.details?.open;
    }

    // #endregion

    //////////////////////
    // #region RENDERING
    /////////////////////

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            isOpen: this._isOpen() && 'open',
            detailsTag: this.hasProp('isCollapsible') ? 'details' : 'div',
            summaryTag: this.hasProp('isCollapsible') ? 'summary' : 'div',
            iconRight: this.hasProp('isCollapsible') && this.getIconRight()
        };
    }

    $renderTemplate() {
        return html`
            <arpa-node tag="{detailsTag}" name="details" {isOpen} class="groupField__details" on-toggle="{toggle}">
                <arpa-node tag="{summaryTag}" name="summary" class="groupField__summary">
                    <arpa-icon class="groupField__icon">{icon}</arpa-icon>
                    <span class="groupField__summary__label" zone="label">{label}</span>
                    {tooltip}
                    <arpa-icon class="groupField__iconRight">{iconRight}</arpa-icon>
                </arpa-node>
                <arpa-node name="fields" class="groupField__fields" is-content></arpa-node>
            </arpa-node>
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.fieldsNode = this.querySelector('.groupField__fields');
        this.details = /** @type {HTMLDetailsElement | undefined} */ (this.nodes.details);
        return true;
    }

    // #endregion

    /////////////////////////
    // #region LIFECYCLE
    /////////////////////////

    /** @param {Event} event */
    toggle(event) {
        if (!this.hasProp('isCollapsible')) return;
        const target = /** @type {HTMLDetailsElement | undefined} */ (event?.target);
        const isOpen = Boolean(target?.open);
        if (this.hasProp('rememberToggle')) {
            localStorage.setItem(this.getHtmlId() + '-toggleState', isOpen.toString());
        }
        this.update();
    }

    update() {
        const isOpen = this.details?.open;
        const icon = isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_left';
        this.iconNode = this.querySelector('.groupField__iconRight');
        if (this.iconNode) {
            this.iconNode.innerHTML = icon;
        }
    }

    // #endregion
}

defineCustomElement('group-field', GroupField);

export default GroupField;
