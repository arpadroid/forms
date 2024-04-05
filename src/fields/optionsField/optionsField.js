import { attr, mergeObjects } from '@arpadroid/tools';
import { CircularPreloader } from '@arpadroid/ui';
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

    _onInitialized() {
        super._onInitialized();
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
        return this.getOptions()?.length || this.optionsNode?.children?.length || 0;
    }

    /**
     * Initializes the options of the options field.
     */
    async initializeOptions() {
        const { options, autoFetchOptions, fetchOptions } = this._config;
        if (Array.isArray(options)) {
            this.setOptions(options);
        }
        if (autoFetchOptions && typeof fetchOptions === 'function') {
            await this.onReady();
            this.fetchOptions();
        }
    }

    /**
     * Fetches the options for the options field.
     * @param {string} query - The query to fetch the options.
     * @returns {Promise} A promise that resolves with the fetched options.
     */
    fetchOptions(query = '') {
        this.fetchQuery = query;
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function') {
            this.isLoadingOptions = true;
            this.renderOptions();
            return fetchOptions(query, undefined, this)?.then(opt => {
                this.isLoadingOptions = false;
                this.onOptionsFetched(opt);
                return Promise.resolve(opt);
            });
        }
        return Promise.resolve();
    }

    async setFetchOptions(fetchOptions) {
        this._config.fetchOptions = fetchOptions;
        this.initializeOptions();
    }

    /**
     * Handles the fetched options for the options field.
     * @param {FieldOptionInterface[]} opt
     */
    onOptionsFetched(opt) {
        this.setOptions(opt);
    }

    /**
     * Renders the options for the options field.
     * @param {FieldOptionInterface[]} options - The options to render.
     */
    renderOptions(options) {
        if (this.isLoadingOptions) {
            this._renderOptionsPreloader();
        } else {
            this._renderOptions(options);
            this.optionsPreloader?.remove();
        }
    }

    _renderOptionsPreloader() {
        if (!this.optionsPreloader) {
            this.optionsPreloader = new CircularPreloader();
        }
        this.optionsNode.append(this.optionsPreloader);
    }

    _renderOptions(options) {
        this.optionsNode.innerHTML = '';
        this.appendChild(this.optionsNode);
        const node = document.createElement('div');
        node.innerHTML = this._config.optionTemplate;
        options?.forEach(option => {
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
