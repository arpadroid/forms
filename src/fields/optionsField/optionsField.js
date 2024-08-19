/**
 * @typedef {import('./fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 * @typedef {import('./optionsFieldInterface').OptionsFieldInterface} OptionsFieldInterface
 */
import { attr, mergeObjects, renderNode } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';
import Field from '../field/field.js';
const html = String.raw;

class OptionsField extends Field {
    //////////////////////////
    // #region CONFIGURATION
    /////////////////////////

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

    /////////////////////
    // #region ACCESSORS
    /////////////////////

    /**
     * Sets the options for the options field.
     * @param {FieldOptionInterface[]} _options - The options to set.
     * @param {boolean} [update] - Whether to update the options.
     * @returns {OptionsField} The options field instance.
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
     * Returns the options of the options field.
     * @returns {FieldOptionInterface[]}
     */
    getOptions() {
        return Array.from(this.optionsNode?.children ?? []);
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
     * @returns {HTMLElement}
     */
    getSelectedOption() {
        return this.getOption(this.getValue()) || this.getDefaultOption();
    }

    /**
     * Returns the option with the specified value.
     * @param {unknown} value
     * @returns {HTMLElement | undefined}
     */
    getOption(value) {
        return [...(this.optionsNode?.children ?? [])].find(option => {
            return option?.getAttribute('value') === value;
        });
    }

    getDefaultOption() {
        return (
            [...(this.optionsNode?.children ?? [])].find(option => {
                return option?.hasAttribute('default');
            }) || this.getOption(this.getProperty('default-option'))
        );
    }

    async setFetchOptions(fetchOptions) {
        this._config.fetchOptions = fetchOptions;
        this.initializeOptions();
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

    /**
     * Normalizes the options of the options field.
     * @param {unknown[]} _options - The options to normalize.
     * @returns {FieldOptionInterface[]} The normalized options.
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

    // #endregion

    //////////////////////
    // #region LIFECYCLE
    //////////////////////

    /**
     * Initializes the value of the options field.
     * @protected
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

    _onSlotPlaced(payload) {
        payload?.slotContainer && payload.slotContainer === this.optionsNode && this.updateValue();
    }

    updateValue() {
        // Abstract method
    }

    /**
     * Handles the fetched options for the options field.
     * @param {FieldOptionInterface[]} opt
     */
    onOptionsFetched(opt) {
        this.setOptions(opt);
    }

    // #endregion

    /////////////////////
    // #region RENDERING
    /////////////////////

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
     * @param {FieldOptionInterface[]} options - The options to render.
     */
    renderOptions(options) {
        if (this.isLoadingOptions) {
            this.renderOptionsPreloader();
        } else {
            this._renderOptions(options);
            this.optionsPreloader?.remove();
        }
    }

    async _renderOptions(options) {
        await this.onReady();
        if (!this.optionsNode) {
            return;
        }
        this.optionsNode.field = this;
        this.optionsNode.innerHTML = '';
        if (!this.optionsNode.isConnected || this.optionsNode.parentNode === document.body) {
            this.appendChild(this.optionsNode);
        }
        options?.forEach(option => this._renderOption(option));
    }

    _renderOption(option) {
        const { optionTemplate } = this._config;
        const optionComponent = this.getProperty('option-component');
        const template = I18nTool.processTemplate(optionTemplate, { optionComponent });
        const optionNode = renderNode(template);
        attr(optionNode, option);
        this.optionsNode.appendChild(optionNode);
        if (typeof optionNode?.setConfig === 'function') {
            optionNode.setConfig(option);
        }

        return optionNode;
    }

    renderOptionsPreloader() {
        if (!this.optionsPreloader) {
            this.optionsPreloader = renderNode(html`<circular-preloader></circular-preloader>`);
        }
        this.optionsNode.append(this.optionsPreloader);
    }

    // #endregion
}

customElements.define(OptionsField.prototype.getTagName(), OptionsField);

export default OptionsField;
