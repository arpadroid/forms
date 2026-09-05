/**
 * @typedef {import('../../field/field.js').default} Field
 * @typedef {import('./fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../../field/field.js').FieldInput} FieldInput
 */
import { mechanize, defineCustomElement, mergeObjects, ucFirst } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;

/**
 * Represents a field option element.
 */
class FieldOption extends ArpaElement {
    /** @type {FieldOptionConfigType} */
    _config = this._config;

    /**
     * Returns the default configuration for the field option element.
     * @returns {FieldOptionConfigType}
     */
    getDefaultConfig() {
        /** @type {FieldOptionConfigType} */
        const config = {
            template: FieldOption.template,
            className: 'fieldOption',
            attributeList: ['value']
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Returns the field option element's ready promise.
     * @returns {Promise<any>} The ready promise.
     */
    onReady() {
        return customElements.whenDefined('arpa-field');
    }

    getLabel() {
        return this.getProp('label') || ucFirst(this.getProp('value')) || this.getProp('content');
    }

    /**
     * The HTML template for the field option element.
     * @type {string}
     */
    static template = html`
        <arpa-icon class="fieldOption__iconRight">{iconLeft}</arpa-icon>
        {input}
        <div class="fieldOption__content">
            <span class="fieldOption__label">{getLabel()}</span>
            {subtitle}
        </div>
        <arpa-icon class="fieldOption__icon">{icon}</arpa-icon>
    `;

    /**
     * Returns the option ID for the field option element.
     * @returns {string}
     */
    getOptionId() {
        const valueString = mechanize(this.getProp('value'));
        return `field-option-${this.field?.getHtmlId()}-${valueString}`;
    }

    async _preRender() {
        const field = this.getField();
        field && (this.field = field);
    }

    /**
     * Renders the field option element.
     * @returns {Promise<boolean>}
     */
    async render() {
        if (!this.field) return false;
        if (this.tagName.toLowerCase() === 'option') {
            this.removeAttribute('role');
        } else {
            this.setAttribute('role', 'option');
        }
        this.setIsSelected();
        super.render();
        this._config.className && this.classList.add(this._config.className);
        return true;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.handlerNode = this.querySelector('.fieldOption__handler');
        this.contentNode = /** @type {HTMLElement} */ (this.querySelector('.fieldOption__content'));
        return true;
    }

    /**
     * Returns the field for the field option element.
     * @returns {Field | null}
     */
    getField() {
        const optionsNode = /** @type {FieldInput} */ (this.closest('.optionsField__options'));
        return this.field || /** @type {Field} */ (this.closest('.arpaField')) || optionsNode?.field;
    }

    /**
     * Returns the action for the field option element.
     * @returns {FieldOptionConfigType['action']}
     */
    getAction() {
        return this._config.action;
    }

    isSelected() {
        return this.getAttribute('value') === this.field?.getValue();
    }

    setIsSelected() {
        this.isSelected() ? this.setAttribute('aria-selected', 'true') : this.removeAttribute('aria-selected');
    }

    async $onInitialized() {
        await this.onReady();
        this.field?.on('change', () => this.setIsSelected());
        super.$onInitialized();
    }

    /**
     * Handles the connected event for the field option element.
     */
    $onConnected() {}

    /**
     * Returns the template variables for rendering the field option element.
     * @returns {Record<string, unknown>} The template variables.
     */
    getTemplateVars() {
        const subtitle = this.getProp('subtitle');
        return {
            content: this._content,
            icon: this.getProp('icon'),
            iconLeft: this.getProp('icon-left'),
            label: this.getProp('label'),
            subtitle: subtitle && html`<span class="fieldOption__subtitle">${subtitle}</span>`,
            input: this.renderInput(),
            optionId: this.getOptionId(),
            value: this.getProp('value')
        };
    }

    /**
     * Renders the input element for the field option element.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        return html``;
    }
}

defineCustomElement('field-option', FieldOption);

export default FieldOption;
