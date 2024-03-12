import { attr, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
/**
 * @typedef {import('./fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 * @typedef {import('./optionsFieldInterface').OptionsFieldInterface} OptionsFieldInterface
 */

/**
 * Represents an options field.
 */
class OptionsField extends Field {
    /** @type {Record<string, FieldOptionInterface>} */
    _optionsByValue = {};
    /** @type {FieldOptionInterface} */
    options = [];

    /**
     * Returns the default configuration for the options field.
     * @returns {OptionsFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            options: undefined,
            hasInput: true,
            inputTemplate: html`
                {input}
                <div role="listbox" class="optionsField__options">{options}</div>
            `,
            optionTemplate: html`<field-option role="option"></field-option>`,
            autoFetchOptions: true
        });
    }

    /**
     * Renders the input element of the options field.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        return html``;
    }

    /**
     * Returns the template variables for the input element.
     * @returns {Record<string, any>} The template variables.
     */
    getInputTemplateVars() {
        return mergeObjects(super.getInputTemplateVars(), {
            options: this._content,
            input: this.renderInput()
        });
    }

    /**
     * Initializes the properties of the options field.
     */
    initializeProperties() {
        super.initializeProperties();
        this.initializeOptions();
    }

    _initializeNodes() {
        super._initializeNodes();
        this.optionsNode = this.querySelector('.optionsField__options');
    }

    /**
     * Initializes the value of the options field.
     * @protected
     */
    _initializeValue() {
        this.selectedOption = this.getSelectedOption();
    }

    /**
     * Sets the options for the options field.
     * @param {FieldOptionInterface[]} _options - The options to set.
     * @param {boolean} [update] - Whether to update the options.
     * @returns {OptionsField} The options field instance.
     */
    setOptions(_options = [], update = true) {
        this._optionsByValue = {};
        this._options = this.normalizeOptions(_options);
        if (this._config.hasEmptyOption) {
            this._options.unshift(this._config.emptyOption);
        }
        if (update) {
            this.renderOptions(this._options);
        }
        return this;
    }

    /**
     * Returns the count of options in the options field.
     * @returns {number}
     */
    getOptionCount() {
        return this.getOptions()?.length || (this.optionsNode?.children?.length ?? 0);
    }

    /**
     * Initializes the options of the options field.
     */
    initializeOptions() {
        const { options, autoFetchOptions } = this._config;
        if (Array.isArray(options)) {
            this.setOptions(options);
        }

        if (autoFetchOptions) {
            this.fetchOptions();
        }
    }

    /**
     * Fetches the options for the options field.
     * @returns {Promise} A promise that resolves with the fetched options.
     */
    fetchOptions() {
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function') {
            const input = this.getInputNode();
            const query = input?.value ?? '';
            return fetchOptions(query, undefined, this)?.then(opt => {
                this.onOptionsFetched(opt);
                return Promise.resolve(opt);
            });
        }
        return Promise.resolve();
    }

    /**
     * Handles the fetched options for the options field.
     * @param {FieldOptionInterface[]} opt
     */
    onOptionsFetched(opt) {
        this.setOptions(opt);
        this.renderOptions(opt);
        //this.getInputComponent()?.updateOptions();
    }

    /**
     * Renders the options for the options field.
     * @param {FieldOptionInterface[]} options - The options to render.
     */
    renderOptions(options) {
        this.optionsNode.innerHTML = '';
        const node = document.createElement('div');
        node.innerHTML = this._config.optionTemplate;
        options.forEach(option => {
            const optionNode = node.firstElementChild.cloneNode(true);
            optionNode.setConfig(option);
            attr(optionNode, option);
            this.optionsNode.appendChild(optionNode);
        });
    }

    /**
     * Returns the options of the options field.
     * @returns {FieldOptionInterface[]}
     */
    getOptions() {
        return Array.from(this.optionsNode?.children ?? []);
    }

    /**
     * Returns the selected option of the options field.
     * @returns {HTMLElement}
     */
    getSelectedOption() {
        return this.getOption(this.getValue());
    }

    /**
     * Returns the option with the specified value.
     * @param {unknown} value
     * @returns {HTMLElement | undefined}
     */
    getOption(value) {
        if (typeof value === 'undefined' || value === null) {
            return;
        }
        return [...(this.optionsNode?.children ?? [])].find(option => {
            return option?.getAttribute('value') === value;
        });
    }

    /**
     * Normalizes the options of the options field.
     * @param {unknown[]} _options - The options to normalize.
     * @returns {FieldOptionInterface[]} The normalized options.
     */
    normalizeOptions(_options) {
        let options = _options;
        if (!Array.isArray(options)) {
            options = [];
        }
        return options.map(option => {
            const opt = this.preprocessOption(option);
            this._optionsByValue[opt.value] = opt;
            return opt;
        });
    }

    /**
     * Pre-processes an option.
     * @param {unknown} option - The option to preprocess.
     * @returns {FieldOptionInterface} The preprocessed option.
     */
    preprocessOption(option) {
        const rv = option;
        if (typeof option === 'string') {
            return {
                value: option,
                label: option,
                content: option
            };
        }
        return rv;
    }
}

customElements.define('options-field', OptionsField);

export default OptionsField;
