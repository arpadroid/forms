import { mechanize, appendNodes, isIOsSafari } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

/**
 * @typedef {import('../../field/field.js').default} Field
 * @typedef {import('./fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 */
const html = String.raw;

/**
 * Represents a field option element.
 */
class FieldOption extends ArpaElement {
    /**
     * Returns the default configuration for the field option element.
     * @returns {FieldOptionInterface} The default configuration.
     */
    getDefaultConfig() {
        return {
            template: FieldOption.template,
            className: 'fieldOption'
        };
    }

    onReady() {
        return customElements.whenDefined('arpa-field');
    }

    /**
     * The HTML template for the field option element.
     * @type {string}
     */
    static template = html`
        <arpa-icon class="fieldOption__iconRight">{iconLeft}</arpa-icon>
        {input}
        <div class="fieldOption__content">
            <span class="fieldOption__label">{label}</span>
            {subTitle}
        </div>
        <arpa-icon class="fieldOption__icon">{icon}</arpa-icon>
    `;

    /**
     * Returns the option ID for the field option element.
     * @returns {string}
     */
    getOptionId() {
        const valueString = mechanize(this.getProperty('value'));
        return `field-option-${this.field.getHtmlId()}-${valueString}`;
    }

    /**
     * Renders the field option element.
     */
    async render() {
        await this.onReady();
        /** @type {Field} */
        const field = this.getField();
        field && (this.field = field);
        if (!field) return;
        if (this.tagName.toLowerCase() === 'option') {
            this.removeAttribute('role');
        } else {
            this.setAttribute('role', 'option');
        }
        this.setIsSelected();
        super.render();
        this.classList.add(this._config.className);
        this._onConnected();
    }

    _initializeNodes() {
        this.handlerNode = this.querySelector('.fieldOption__handler');
        this.contentNode = this.querySelector('.fieldOption__content');
        const childNodes = isIOsSafari() ? this._childNodes : this._childNodes?.filter(node => !node?.tagName?.toLowerCase().includes('dialog'));
        appendNodes(this.contentNode, childNodes);
    }

    getField() {
        return this.field || this.closest('.arpaField') || this.closest('.optionsField__options')?.field;
    }

    isSelected() {
        return this.getAttribute('value') === this.field?.getValue();
    }

    setIsSelected() {
        this.isSelected() ? this.setAttribute('aria-selected', 'true') : this.removeAttribute('aria-selected');
    }

    async _onInitialized() {
        await this.onReady();
        this.field?.on('change', () => this.setIsSelected());
        super._onInitialized();
    }

    /**
     * Handles the connected event for the field option element.
     * @protected
     */
    _onConnected() {}

    /**
     * Returns the template variables for rendering the field option element.
     * @returns {Record<string, unknown>} The template variables.
     */
    getTemplateVars() {
        const subTitle = this.getProperty('subtitle');
        return {
            content: this._content,
            icon: this.getProperty('icon'),
            iconLeft: this.getProperty('icon-left'),
            label: this.getProperty('label'),
            subTitle: subTitle && html`<span class="fieldOption__subTitle">${subTitle}</span>`,
            input: this.renderInput(),
            optionId: this.getOptionId(),
            value: this.getProperty('value')
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

customElements.define('field-option', FieldOption);

export default FieldOption;
