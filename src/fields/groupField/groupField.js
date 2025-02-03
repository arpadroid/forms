import { mergeObjects, appendNodes } from '@arpadroid/tools';
import Field from '../field/field.js';

/**
 * @typedef {import('./groupField.types').GroupFieldConfigType} GroupFieldConfigType
 */

const html = String.raw;
class GroupField extends Field {
    /** @type {GroupFieldConfigType} */  // @ts-ignore
    _config = this._config;
    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    /**
     * Creates a new GroupField instance.
     * @param {GroupFieldConfigType} config - The configuration object for the GroupField.
     */
    constructor(config) {
        super(config);
        this._fields = Array.from(this?.childNodes ?? []);
        this._content = this.innerHTML;
        this.innerHTML = '';
        this.classList.add('groupField');
        this.classList.remove('arpaField');
    }

    /**
     * Returns the default configuration for the GroupField.
     * @returns {GroupFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        /** @type {GroupFieldConfigType} */
        const conf = {
            open: undefined,
            rememberToggle: undefined,
            isCollapsible: undefined,
            openIcon: 'keyboard_arrow_down',
            closedIcon: 'keyboard_arrow_right',
            template: GroupField.template
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

    getRememberToggle() {
        return this.hasProperty('remember-toggle');
    }

    getSavedToggleState() {
        return localStorage.getItem(this.getHtmlId() + '-toggleState');
    }

    getTagName() {
        return 'group-field';
    }

    isCollapsible() {
        return this.hasProperty('is-collapsible') ?? true;
    }

    _isOpen() {
        const savedToggle = this.getSavedToggleState();
        if (this.getRememberToggle() && savedToggle) {
            return savedToggle === 'true';
        }
        return this.hasProperty('open');
    }

    isOpen() {
        return this.details?.open;
    }

    // #endregion

    //////////////////////
    // #region RENDERING
    /////////////////////

    static template = html`
        <{detailsTag} {isOpen} class="groupField__details">
            <{summaryTag} class="groupField__summary">
                <arpa-icon class="groupField__icon">{icon}</arpa-icon>
                <span class="groupField__summary__label">{label}</span>
                <arpa-tooltip position="bottom-right">{tooltip}</arpa-tooltip>
                <arpa-icon class="groupField__iconRight">{iconRight}</arpa-icon>
            </{summaryTag}>
            <div class="groupField__fields"></div>
        </{detailsTag}>
    `;

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            isOpen: this._isOpen() && 'open',
            detailsTag: this.isCollapsible() ? 'details' : 'div',
            summaryTag: this.isCollapsible() ? 'summary' : 'div',
            iconRight: this.isCollapsible() && this.getIconRight()
        };
    }

    renderLabel() {
        return this.getLabel();
    }

    // #endregion

    /////////////////////////
    // #region LIFECYCLE
    /////////////////////////

    _onConnected() {
        super._onConnected();
        this.fieldsNode = this.querySelector('.groupField__fields');
        this.fieldsNode && appendNodes(this.fieldsNode, this._fields);
        this.details = this.querySelector('details');
        if (this.isCollapsible()) {
            this.details?.addEventListener('toggle', event => {
                const target = /** @type {HTMLDetailsElement | undefined} */ (event?.target);
                const isOpen = Boolean(target?.open);
                if (this.getRememberToggle()) {
                    localStorage.setItem(this.getHtmlId() + '-toggleState', isOpen.toString());
                }
                this.update();
            });
        }
    }

    update() {
        const isOpen = this.details?.open;
        const icon = isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_left';
        this.iconNode = this.querySelector('.groupField__iconRight');
        if (this.iconNode) {
            this.iconNode.innerHTML = icon;
        }
    }

    _initializeNodes() {
        super._initializeNodes();
        this.fieldsNode = this.querySelector('.groupField__fields');
    }

    // #endregion
}

customElements.define(GroupField.prototype.getTagName(), GroupField);

export default GroupField;
