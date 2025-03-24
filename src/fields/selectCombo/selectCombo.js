/**
 * @typedef {import('./selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField/optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType
 * @typedef {import('../optionsField/optionsField.types').OptionsNodeType} OptionsNodeType
 * @typedef {import('../optionsField//fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('./selectCombo.types').SelectComboConfigType} SelectComboConfigType
 * @typedef {import('@arpadroid/tools').SearchToolCallbackType} SearchToolCallbackType
 * @typedef {import('@arpadroid/ui').InputComboNodeType} InputComboNodeType
 */
import { mergeObjects, addSearchMatchMarkers, SearchTool, attrString, defineCustomElement, renderNode } from '@arpadroid/tools';
import SelectField from '../selectField/selectField.js';
import { I18n } from '@arpadroid/i18n';
import { InputCombo } from '@arpadroid/ui';

const html = String.raw;
class SelectCombo extends SelectField {
    /** @type {SelectComboConfigType} */
    _config = this._config;
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////

    /**
     * Returns the default configuration for the select combo field.
     * @returns {SelectComboConfigType} The default configuration object.
     */
    getDefaultConfig() {
        this.bind('onLabelClick', 'onSearch', 'onOpenCombo', 'onCloseCombo', 'onSearchInputFocus', 'onSearchInputBlur');
        /** @type {SelectComboConfigType} */
        const config = {
            hasSearch: false,
            debounceSearch: 500,
            searchItemContentSelector: '.fieldOption__label, .fieldOption__subTitle',
            placeholder: I18n.getText('forms.fields.selectCombo.lblNoSelection'),
            optionsPosition: 'bottom-left',
            inputAttributes: { type: undefined },
            inputTemplate: html`
                {comboInput}
                <div class="selectCombo__options optionsField__options comboBox">{options}</div>
            `,
            optionComponent: 'select-option'
        };
        return /** @type {SelectComboConfigType} */ (mergeObjects(super.getDefaultConfig(), config));
    }

    /**
     * Sets the value of the select combo field.
     * @param {string} value - The value to set on the select combo field.
     * @returns {this} The instance of the select combo field.
     */
    setValue(value) {
        super.setValue(value);
        this.updateValue();
        return this;
    }

    // #endregion

    ////////////////////
    // #region LIFECYCLE
    ////////////////////

    static get observedAttributes() {
        return ['value', 'has-search'];
    }

    /**
     * Handles attribute changes and updates the value if the 'value' attribute has changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string} oldValue
     * @param {string} newValue
     */
    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'has-search') {
            this._convertInputToSearch();
        }
    }

    _convertInputToSearch() {
        const oldInput = this.searchInput || this.buttonInput;
        const newInput = renderNode(this.renderComboInput());
        if (oldInput && newInput) {
            oldInput.replaceWith(newInput);
            this.searchInput = newInput;
            this._initializeSearch();
            this._initializeInputCombo();
        }
    }

    async _initializeValue() {
        /** @type {OptionsNodeType} */
        this.optionsNode = this.querySelector('.selectCombo__options');
        this.selectedOption = this.getSelectedOption();
        this.updateValue();
    }

    async _initializeNodes() {
        await super._initializeNodes();
        this._initializeButtonInput();
        this._initializeSearchInput();
        this._initializeOptionsNode();
        this._initializeInputCombo();
        if (this.label) {
            this.label.removeEventListener('click', this.onLabelClick);
            this.label.addEventListener('click', this.onLabelClick);
        }
        return true;
    }

    async _initializeOptionsNode() {
        /** @type {OptionsNodeType} */
        this.optionsNode = this.querySelector('.selectCombo__options');
        return true;
    }

    _initializeButtonInput() {
        this.buttonInput = this.querySelector('button.optionsField__input');
    }

    _initializeSearchInput() {
        this.searchInput = /** @type {HTMLInputElement | null} */ (this.querySelector('input.optionsField__searchInput'));
        if (this.searchInput) {
            this.searchInput.removeEventListener('focus', this.onSearchInputFocus);
            this.searchInput.addEventListener('focus', this.onSearchInputFocus);
            this.searchInput.removeEventListener('blur', this.onSearchInputBlur);
            this.searchInput.addEventListener('blur', this.onSearchInputBlur);
        }
        this._initializeSearch();
    }

    async _initializeSearch() {
        await this.onReady();
        if (this.searchInput && !this.search) {
            this.search = new SearchTool(this.searchInput, {
                container: this.optionsNode,
                searchSelector: this.getProperty('search-item-content-selector'),
                onSearch: this.onSearch,
                debounceDelay: this.getProperty('debounce-search')
            });
        }
    }

    /**
     * Initializes the input combo for the select combo field.
     * @protected
     */
    _initializeInputCombo() {
        const handler = this.getInput();
        this.optionsNode = this.optionsNode || this.querySelector('.selectCombo__options');
        if (!handler || !this.optionsNode) return;
        if (!this.inputCombo) {
            this.inputCombo = new InputCombo(handler, this.optionsNode, {
                containerSelector: this.getProperty('option-component'),
                position: this.getProperty('options-position'),
                closeOnClick: true,
                onOpen: () => this.onOpenCombo(),
                onClose: () => this.onCloseCombo()
            });
        } else {
            this.inputCombo.initialize(handler, this.optionsNode);
        }
    }

    getValue() {
        const input = this.getInput();
        return this.preProcessValue(input?.getAttribute('value') || this.getProperty('value') || '');
    } 
    // #endregion

    ////////////////////
    // #region ACCESSORS
    ////////////////////

    getFieldType() {
        return 'selectCombo';
    }

    getTagName() {
        return 'select-combo';
    }

    /**
     * Returns the input element for the select combo field.
     * @returns {HTMLInputElement | null} The input element for the select combo field.
     */
    getInput() {
        return this.hasSearch() ? this.querySelector('.optionsField__searchInput') : this.querySelector('.optionsField__input');
    }

    getContentSelector() {
        return this.getProperty('search-item-content-selector');
    }

    hasSearch() {
        const { fetchOptions } = this._config;
        const hasSearch = this.hasAttribute('has-search') || this._config.hasSearch;
        return Boolean(hasSearch || (fetchOptions && !this.getOptionCount()));
    }

    /**
     * Sets the options for the select combo field.
     * @param {FieldOptionConfigType[]} options - The options to set on the select combo field.
     * @returns {this} The instance of the select combo field.
     */
    setOptions(options) {
        super.setOptions(options);
        if (options.length && !this._initializedOptions) {
            this.updateValue();
            this._initializedOptions = true;
        }
        return this;
    }

    /**
     * Updates the value of the select combo field based on the selected option.
     */
    async updateValue() {
        await this.promise;
        await this.onReady();
        this.optionsNode = this.querySelector('.selectCombo__options');
        /** @type {SelectOption} */
        this.selectedOption = this.getSelectedOption();
        const options = this.getOptions();
        options.forEach(option => option.removeAttribute('aria-selected'));
        this.selectedOption?.setAttribute('aria-selected', 'true');
        const label = this.getValueLabel();
        this.updateButtonLabel(label);
        this.updateSearchInputLabel(label);
    }

    getValueLabel() {
        const { renderValue } = this._config;
        const configValue = typeof renderValue === 'function' && renderValue(this.selectedOption);
        return (
            configValue ||
            this.selectedOption?.getProperty('label') ||
            this.selectedOption?.textContent?.trim() ||
            this.getPlaceholder()
        );
    }

    /**
     * Updates the label of the button input of the select combo field.
     * @param {string | HTMLElement} label - The label to set on the button input.
     */
    updateButtonLabel(label) {
        if (this.buttonInput) {
            this.buttonInput.innerHTML = '';
            if (typeof label === 'string') {
                this.buttonInput.innerHTML = label;
            } else if (label instanceof HTMLElement) {
                this.buttonInput.appendChild(label);
            }
        }
    }

    /**
     * Updates the value of the search input label.
     * @param {string | HTMLElement} label - The label to set on the search input.
     */
    updateSearchInputLabel(label) {
        if (this.searchInput instanceof HTMLInputElement) {
            this.searchInput.value = typeof label === 'string' ? label : label?.textContent || '';
        }
    }

    // #endregion

    /////////////////////
    // #region RENDERING
    /////////////////////

    /**
     * Returns the template variables for the select combo field.
     * @returns {Record<string, unknown>} The template variables for the select combo field.
     */
    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            comboInput: this.renderComboInput()
        };
    }

    renderComboInput() {
        const placeholder = this.getPlaceholder();
        const inputAttributes = attrString({ placeholder });
        return this.hasSearch()
            ? html`<input id="${this.getHtmlId()}" type="text" class="optionsField__searchInput fieldInput" ${inputAttributes} />`
            : html`<button id="${this.getHtmlId()}" type="button" class="optionsField__input fieldInput">
                  ${this.getPlaceholder()}
              </button>`;
    }

    /**
     * Renders the options for the select combo field.
     * @param {FieldOptionConfigType[]} options - The options to render.
     */
    renderOptions(options) {
        super.renderOptions(options);
        requestAnimationFrame(() => this.inputCombo?.place());
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    onLabelClick() {
        const input = this.getInput();
        return input instanceof HTMLElement && input.focus();
    }

    onSearchInputFocus() {
        this.searchInput?.select();
    }

    onSearchInputBlur() {
        this.searchInput && (this.searchInput.value = this.getSelectedOption()?.getProperty('label') || '');
    }

    onOpenCombo() {
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function' && this.query) {
            this.fetchOptions();
        }
    }

    onCloseCombo() {
        this.resetSearchState();
    }

    resetSearchState() {
        if (this.hasSearch()) {
            this.getOptions().forEach(node => {
                node.style.display = '';
                addSearchMatchMarkers(node, '', this.getContentSelector());
            });
        }
    }

    /**
     * Handles the search event for the select combo field.
     * @type {SearchToolCallbackType}
     */
    async onSearch(payload) {
        const { query, event } = payload;
        if (event) {
            this.query = query;
        }
        const { fetchOptions } = this._config ?? {};
        if (fetchOptions) {
            if (event) {
                await this.fetchOptions(query);
            }
            requestAnimationFrame(() => {
                this.getOptions().forEach(node => {
                    addSearchMatchMarkers(node, query, this.getContentSelector());
                });
            });
            return false;
        }
    }

    // #endregion
}

defineCustomElement('select-combo', SelectCombo);

export default SelectCombo;
