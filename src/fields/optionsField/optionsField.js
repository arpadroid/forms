/**
 * @typedef {import('./fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('./optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType
 * @typedef {import('./fieldOption/fieldOption.js').default} FieldOption
 * @typedef {import('./fieldOptions/fieldOptions.js').default} FieldOptions
 * @typedef {import('./optionsField.types').OptionsNodeType} OptionsNodeType
 * @typedef {import('@arpadroid/ui').CircularSpinner} CircularSpinner
 */
import { $attr, defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';
import Field from '../field/field.js';

const html = String.raw;

class OptionsField extends Field {
    //////////////////////////
    // #region Setup
    /////////////////////////

    /** @type {OptionsFieldConfigType} */
    _config = this._config;
    /** @type {Record<string, FieldOptionConfigType>} */
    _optionsByValue = {};
    /** @type {FieldOptionConfigType[]} */
    _options = [];

    /**
     * Returns the default configuration for the options field.
     * @returns {OptionsFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {OptionsFieldConfigType} */
        const config = {
            autoFetchOptions: true,
            optionComponent: 'field-option',
            options: undefined,
            optionsTag: 'field-options',
            optionsClass: 'optionsField__options',
            optionsAttributes: {}
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getFieldType() {
        return 'options';
    }

    // #endregion

    ////////////////////////
    // #region Options
    ///////////////////////

    /**
     * Sets the options for the options field.
     * @param {FieldOptionConfigType[]} _options - The options to set.
     * @param {boolean} [update] - Whether to update the options.
     * @returns {this} The options field instance.
     */
    setOptions(_options = [], update = true) {
        this._optionsByValue = {};
        this._options = this.normalizeOptions(_options);
        this._config.options = this._options;
        if (update) {
            const optionsNode = /** @type {FieldOptions | null} */ (this.optionsNode);
            optionsNode?.setItems(this._options);
            this.handlePreloader();
        }
        return this;
    }

    /**
     * Sets the fetch options for the options field.
     * @param {OptionsFieldConfigType['fetchOptions']} fetchOptions - The fetch options function.
     */
    async setFetchOptions(fetchOptions) {
        await this.promise;
        this._config.fetchOptions = fetchOptions;
        this.initializeOptions();
    }

    /**
     * Returns the options of the options field.
     * @returns {FieldOption[] | HTMLElement[]}
     */
    getOptions() {
        return /** @type {FieldOption[]} */ (Array.from(this.optionsNode?.children ?? []));
    }

    /**
     * Returns the count of options in the options field.
     * @returns {number}
     */
    getOptionCount() {
        return this.getOptions()?.length || this.optionsNode?.children?.length || 0;
    }

    /**
     * Returns the selected option of the options field.
     * @param {boolean} [returnDefault] - Whether to return the default option if no option is selected.
     * @returns {FieldOption | undefined}
     */
    getSelectedOption(returnDefault = true) {
        const option = this.getOption(this.getValue());
        return /** @type {FieldOption} */ (option || (returnDefault && this.getDefaultOption()) || undefined);
    }

    /**
     * Returns the option with the specified value.
     * @param {unknown} value
     * @returns {FieldOption | undefined}
     */
    getOption(value) {
        const option = /** @type {FieldOption | undefined} */ (this.optionsNode?.querySelector(`[value="${value}"]`));
        return option;
    }

    getDefaultOption() {
        return (
            this.getOptions().find(option => {
                return option?.hasAttribute('default');
            }) || this.getOption(this.getProp('default-option'))
        );
    }

    /**
     * Fetches the options for the options field.
     * @param {string} query - The query to fetch the options.
     * @returns {Promise<any>} A promise that resolves with the fetched options.
     */
    fetchOptions(query = '') {
        this.fetchQuery = query;
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function') {
            this.isLoadingOptions = true;
            this.handlePreloader();
            return fetchOptions(query, undefined, this)?.then(opt => {
                this.isLoadingOptions = false;
                this.onOptionsFetched(opt);
                return Promise.resolve(opt);
            });
        }
        return Promise.resolve();
    }

    /**
     * Normalizes the options of the options field.
     * @param {string[] | string | FieldOptionConfigType[]} _options - The options to normalize.
     * @returns {FieldOptionConfigType[]} The normalized options.
     */
    normalizeOptions(_options) {
        let options = _options;
        if (typeof _options === 'string') {
            options = _options.split(',').map(option => {
                const [value, label] = option.trim().split('::');
                return { value, label: label || value };
            });
        }
        if (!Array.isArray(options)) {
            options = [];
        }
        return options.map(option => {
            const opt = this.preprocessOption(option);
            const val = String(opt.value);
            this._optionsByValue[val] = opt;
            return opt;
        });
    }

    /**
     * Pre-processes an option.
     * @param {FieldOptionConfigType | string | any} option - The option to preprocess.
     * @returns {FieldOptionConfigType} The preprocessed option.
     */
    preprocessOption(option) {
        const rv = option;
        if (typeof option === 'string') {
            return { value: option, label: option, content: option };
        }
        return rv;
    }
    /**
     * Handles the fetched options for the options field.
     * @param {FieldOptionConfigType[]} opt
     */
    onOptionsFetched(opt) {
        this.setOptions(opt);
    }

    // #endregion Options

    ///////////////////////////
    // #region Render
    //////////////////////////

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-node
                id="{id}-options"
                tag="{optionsTag}"
                name="input"
                class-name="{optionsClass}"
                is-content
                role="listbox"
                aria-label="options"
                ${$attr(this._config.optionsAttributes || {})}
            ></arpa-node>
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.optionsNode = /** @type {OptionsNodeType | null} */ (this.querySelector(`.${this.getProp('optionsClass')}`));
        return true;
    }

    /**
     * Returns the template variables for the input element.
     * @returns {Record<string, any>} The template variables.
     */
    getTemplateVars() {
        return mergeObjects(super.getTemplateVars(), {
            options: this._content
        });
    }

    handlePreloader() {
        if (!this.isLoadingOptions) {
            this.optionsPreloader?.remove();
            return;
        }
        if (!this.optionsPreloader) {
            this.optionsPreloader = /** @type {CircularSpinner} */ (
                renderNode(html`<circular-spinner size="mini" thickness="medium" inline></circular-spinner>`)
            );
        }
        this.nodes.labelWrapper?.append(this.optionsPreloader);
    }

    // #endregion Render

    ////////////////////////////////
    // #region Lifecycle
    ///////////////////////////////

    /**
     * Initializes the value of the options field.
     */
    async _initializeValue() {
        await this.promise;
        super._initializeValue();
        this.selectedOption = this.getSelectedOption();
    }

    $onInitialized() {
        super.$onInitialized();
        this.initializeOptions();
    }

    /**
     * Initializes the options of the options field.
     */
    async initializeOptions() {
        const { options, autoFetchOptions, fetchOptions } = this._config;
        Array.isArray(options) && this.setOptions(options);
        if (autoFetchOptions && typeof fetchOptions === 'function') {
            this.fetchOptions();
        }
    }

    updateValue() {
        // Abstract method
    }
}

defineCustomElement('options-field', OptionsField);

export default OptionsField;
