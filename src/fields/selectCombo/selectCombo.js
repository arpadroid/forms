/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('../selectField/selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 */
import { mergeObjects, addSearchMatchMarkers, SearchTool } from '@arpadroid/tools';
import { InputCombo } from '@arpadroid/ui';
import SelectField from '../selectField/selectField.js';

const html = String.raw;
class SelectCombo extends SelectField {
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////

    /**
     * Returns the default configuration for the select combo field.
     * @returns {OptionsFieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            hasSearch: false,
            debounceSearch: 500,
            searchItemContentSelector: '.fieldOption__label, .fieldOption__subTitle',
            inputTemplate: html`
                {input}
                <div class="selectCombo__options comboBox">{options}</div>
            `,
            optionComponent: 'select-option'
        });
    }

    _bindMethods() {
        super._bindMethods();
        this._onLabelClick = this._onLabelClick.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._onOpenCombo = this._onOpenCombo.bind(this);
        this._onCloseCombo = this._onCloseCombo.bind(this);
        this._onSearchInputFocus = this._onSearchInputFocus.bind(this);
        this._onSearchInputBlur = this._onSearchInputBlur.bind(this);
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
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.updateValue();
        } else if (name === 'has-search') {
            this.reRender();
        }
    }

    _initializeNodes() {
        super._initializeNodes();
        this._initializeButtonInput();
        this._initializeSearchInput();
        this.optionsNode = this.querySelector('.selectCombo__options');
        this._initializeInputCombo();
        this?.label.removeEventListener('click', this._onLabelClick);
        this?.label.addEventListener('click', this._onLabelClick);
    }

    _initializeButtonInput() {
        this.buttonInput = this.querySelector('button.optionsField__input');
    }

    _initializeSearchInput() {
        this.searchInput = this.querySelector('input.optionsField__searchInput');
        if (this.searchInput) {
            this.searchInput.removeEventListener('focus', this._onSearchInputFocus);
            this.searchInput.addEventListener('focus', this._onSearchInputFocus);
            this.searchInput.removeEventListener('blur', this._onSearchInputBlur);
            this.searchInput.addEventListener('blur', this._onSearchInputBlur);
        }
        this._initializeSearch();
    }

    async _initializeSearch() {
        await this.onReady();
        if (this.searchInput && !this.search) {
            this.search = new SearchTool(this.searchInput, {
                container: this.optionsNode,
                searchSelector: this.getProperty('search-item-content-selector'),
                onSearch: this._onSearch,
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
        if (handler && !this.inputCombo) {
            this.optionsNode = this.querySelector('.selectCombo__options');
            this.inputCombo = new InputCombo(handler, this.optionsNode, {
                containerSelector: 'select-option',
                onOpen: () => this._onOpenCombo(),
                onClose: () => this._onCloseCombo()
            });
        }
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
    updateValue() {
        /** @type {SelectOption} */
        const selectedOption = this.getSelectedOption();
        const label = selectedOption?.getProperty('label');
        this.getOptions().forEach(option => option.removeAttribute('aria-selected'));
        if (selectedOption) {
            if (this.buttonInput) {
                this.buttonInput.textContent = label;
            }
            if (this.searchInput) {
                this.searchInput.value = label;
            }
            selectedOption.setAttribute('aria-selected', 'true');
        }
    }

    // #endregion

    /////////////////////
    // #region RENDERING
    /////////////////////

    /**
     * Renders the input element of the select combo field.
     * @returns {string} The rendered input element.
     */
    getInputTemplateVars() {
        return {
            ...super.getInputTemplateVars(),
            input: this.hasSearch()
                ? html`<input type="text" class="optionsField__searchInput fieldInput" />`
                : html`<button type="button" class="optionsField__input fieldInput"></button>`
        };
    }

    renderOptions(options) {
        super.renderOptions(options);
        requestAnimationFrame(() => this.inputCombo?.place());
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    _onLabelClick() {
        return this.getInput()?.focus();
    }

    _onSearchInputFocus() {
        this.searchInput.select();
    }

    _onSearchInputBlur() {
        this.searchInput.value = this.getSelectedOption()?.getProperty('label') || '';
    }

    _onOpenCombo() {
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function' && this.query) {
            this.fetchOptions();
        }
    }

    _onCloseCombo() {
        this._resetSearchState();
    }

    _resetSearchState() {
        if (this.hasSearch()) {
            this.getOptions().forEach(node => {
                node.style.display = '';
                addSearchMatchMarkers(node, '', this.getContentSelector());
            });
        }
    }

    async _onSearch({ query, event }) {
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

customElements.define('select-combo', SelectCombo);

export default SelectCombo;
