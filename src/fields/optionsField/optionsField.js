/**
 * @typedef {import('./fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('./optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType
 * @typedef {import('./fieldOption/fieldOption.js').default} FieldOption
 * @typedef {import('./optionsField.types').OptionsNodeType} OptionsNodeType
 */
import { attr, defineCustomElement, mergeObjects, processTemplate, renderNode } from '@arpadroid/tools';
import Field from '../field/field.js';

const html = String.raw;

class OptionsField extends Field {
    //////////////////////////
    // #region CONFIGURATION
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
        return mergeObjects(super.getDefaultConfig(), {
            autoFetchOptions: true,
            inputTemplate: html`
                {input}
                <div role="listbox" class="optionsField__options" aria-labelledby="{labelId}">{options}</div>
            `,
            optionComponent: 'field-option',
            options: undefined,
            optionTemplate: html`<{optionComponent} role="option"></{optionComponent}`
        });
    }

    getFieldType() {
        return 'options';
    }

    getTagName() {
        return 'options-field';
    }

    // #endregion

    /////////////////////////////
    // #region Get
    ////////////////////////////
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
     * @returns {FieldOption | undefined}
     */
    getSelectedOption() {
        return /** @type {FieldOption} */ (this.getOption(this.getValue()) || this.getDefaultOption());
    }

    /**
     * Returns the option with the specified value.
     * @param {unknown} value
     * @returns {FieldOption | undefined}
     */
    getOption(value) {
        return /** @type {FieldOption} */ (
            [...(this.optionsNode?.children ?? [])].find(option => {
                return option?.getAttribute('value') === value;
            })
        );
    }

    getDefaultOption() {
        return (
            [...(this.optionsNode?.children ?? [])].find(option => {
                return option?.hasAttribute('default');
            }) || this.getOption(this.getProperty('default-option'))
        );
    }

    // #endregion Get

    ////////////////////////
    // #region Set
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
            this.renderOptions(this._options);
        }
        return this;
    }

    /**
     * Sets the fetch options for the options field.
     * @param {OptionsFieldConfigType['fetchOptions']} fetchOptions - The fetch options function.
     */
    async setFetchOptions(fetchOptions) {
        this._config.fetchOptions = fetchOptions;
        this.initializeOptions();
    }

    // #endregion Set

    ////////////////////////
    // #region Options
    ///////////////////////

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
            this.renderOptions();
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
            return {
                value: option,
                label: option,
                content: option
            };
        }
        return rv;
    }

    // #endregion Options

    ////////////////////////////////
    // #region Lifecycle
    ///////////////////////////////

    /**
     * Initializes the value of the options field.
     */
    async _initializeValue() {
        this.selectedOption = this.getSelectedOption();
    }

    _onInitialized() {
        super._onInitialized();
        this.initializeOptions();
    }

    _initializeNodes() {
        super._initializeNodes();
        /** @type {OptionsNodeType | null} */
        this.optionsNode = this.querySelector('.optionsField__options');
    }

    /**
     * Initializes the options of the options field.
     */
    async initializeOptions() {
        const { options, autoFetchOptions, fetchOptions } = this._config;
        Array.isArray(options) && this.setOptions(options);
        if (autoFetchOptions && typeof fetchOptions === 'function') {
            await this.onReady();
            this.fetchOptions();
        }
    }

    /**
     * Called when a zone is placed.
     * @param {Record<string, any>} payload - The payload of the event.
     */
    _onPlaceZone(payload) {
        payload?.zoneContainer && payload.zoneContainer === this.optionsNode && this.updateValue();
    }

    updateValue() {
        // Abstract method
    }

    /**
     * Handles the fetched options for the options field.
     * @param {FieldOptionConfigType[]} opt
     */
    onOptionsFetched(opt) {
        this.setOptions(opt);
    }

    // #endregion Lifecycle

    ///////////////////////////
    // #region Render
    //////////////////////////

    /**
     * Returns the template variables for the input element.
     * @returns {Record<string, any>} The template variables.
     */
    getInputTemplateVars() {
        return mergeObjects(super.getInputTemplateVars(), {
            options: this._content
        });
    }

    reRender() {
        super.reRender();
        this._options?.length && this.setOptions(this._options);
    }

    /**
     * Renders the options for the options field.
     * @param {FieldOptionConfigType[]} options - The options to render.
     */
    renderOptions(options = this._options) {
        if (this.isLoadingOptions) {
            this.renderOptionsPreloader();
        } else {
            this._renderOptions(options);
            this.optionsPreloader?.remove();
        }
    }

    /**
     * Renders the options for the options field.
     * @param {FieldOptionConfigType[]} options
     */
    async _renderOptions(options) {
        await this.onReady();
        if (!this.optionsNode) {
            return;
        }
        /** @type {HTMLElement & {field: Field}} */ (this.optionsNode).field = this;
        this.optionsNode.innerHTML = '';
        if (!this.optionsNode.isConnected || this.optionsNode.parentNode === document.body) {
            this.appendChild(this.optionsNode);
        }
        options?.forEach(option => this._renderOption(option));
    }

    /**
     * Renders an option for the options field.
     * @param {FieldOptionConfigType} option - The option to render.
     * @returns {FieldOption} The rendered option.
     */
    _renderOption(option) {
        const { optionTemplate = '' } = this._config;
        const optionComponent = this.getProperty('option-component');
        const template = processTemplate(optionTemplate, { optionComponent });
        /** @type {FieldOption} */
        const optionNode = renderNode(template);
        if (optionNode instanceof HTMLElement) {
            attr(optionNode, option);
            this.optionsNode?.appendChild(optionNode);
            if (typeof optionNode?.setConfig === 'function') {
                optionNode.setConfig(option);
            }
        }

        return optionNode;
    }

    renderOptionsPreloader() {
        if (!this.optionsPreloader) {
            this.optionsPreloader = renderNode(html`<circular-preloader></circular-preloader>`);
        }
        this.optionsPreloader && this.optionsNode?.append(this.optionsPreloader);
    }

    // #endregion Render
}

defineCustomElement(OptionsField.prototype.getTagName(), OptionsField);

export default OptionsField;
