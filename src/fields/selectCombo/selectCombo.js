/**
 * @typedef {import('./selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField//fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('./selectCombo.types').SelectComboConfigType} SelectComboConfigType
 * @typedef {import('@arpadroid/tools').SearchToolCallbackType} SearchToolCallbackType
 */
import { mergeObjects, addSearchMatchMarkers, SearchTool, defineCustomElement } from '@arpadroid/tools';
import Field from '../field/field.js';
import SelectField from '../selectField/selectField.js';
import { I18n } from '@arpadroid/i18n';
import { InputCombo } from '@arpadroid/ui';

const html = String.raw;
class SelectCombo extends SelectField {
    /** @type {SelectComboConfigType} */
    _config = this._config;

    /** @returns {SelectComboConfigType} The default configuration object. */
    getDefaultConfig() {
        /** @type {SelectComboConfigType} */
        const config = {
            hasSearch: false,
            debounceSearch: 500,
            searchItemContentSelector: '.fieldOption__label, .comboBox__item__label, .fieldOption__subtitle',
            placeholder: I18n.getText('forms.fields.selectCombo.lblNoSelection'),
            optionsPosition: 'bottom-left',
            inputTag: undefined,
            inputType: undefined,
            optionComponent: 'select-option'
        };
        return /** @type {SelectComboConfigType} */ (mergeObjects(super.getDefaultConfig(), config));
    }

    // #endregion

    // #region Get

    getFieldType() {
        return 'selectCombo';
    }

    getValue() {
        const input = this.getInput();
        return this.preProcessValue(input?.getAttribute('value') || this.getProp('value') || '');
    }

    getContentSelector() {
        return this.getProp('search-item-content-selector');
    }

    hasSearch() {
        const { fetchOptions } = this._config;
        const hasSearch = this.hasAttribute('has-search') || this._config.hasSearch;
        return Boolean(hasSearch || (fetchOptions && !this.getOptionCount()));
    }

    /**
     * @param {FieldOptionConfigType[]} options
     * @returns {this}
     */
    setOptions(options) {
        super.setOptions(options);
        this.updateValue();
        return this;
    }

    /**
     * @param {string} value
     * @returns {this}
     */
    setValue(value) {
        super.setValue(value);
        this.updateValue();
        return this;
    }

    /////////////////////
    // #region Render
    /////////////////////

    $renderTemplate() {
        return html`
            ${Field.prototype.$renderTemplate.call(this)}
            <arpa-node
                id="{getHtmlId()}-options"
                tag="select-options"
                name="options"
                class-name="optionsField__options"
                zone="{optionsZone}"
                is-content
            ></arpa-node>
            <arpa-zone name="inputWrapper">
                <arpa-node
                    name="searchInput"
                    tag="input"
                    aria-labelledby="{labelId}"
                    type="text"
                    class="optionsField__searchInput arpaField__input"
                    placeholder="{placeholder}"
                    autocomplete="off"
                    data-value="{value}"
                    on-focus="{onSearchInputFocus}"
                    on-blur="{onSearchInputBlur}"
                    can-render="hasSearch()"
                ></arpa-node>
                <arpa-node
                    name="input"
                    tag="button"
                    data-value="{value}"
                    id="{getHtmlId()}"
                    type="button"
                    class="arpaField__input"
                    can-render="!hasSearch()"
                    aria-labelledby="{labelId}"
                >
                    {placeholder}
                </arpa-node>
            </arpa-zone>
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.waitForArpaNodes();
        this.initializeInputCombo();
        this.searchInput = this.getSearchInput();
        this.initializeSearch(this.searchInput);
        return true;
    }

    getSearchInput() {
        return /** @type {HTMLInputElement | null} */ (this.nodes.searchInput);
    }

    /**
     * Initializes the search functionality for the select combo field.
     * @param {HTMLInputElement | null} [input]
     */
    initializeSearch(input) {
        if (!this.hasSearch() || this.search || !input) {
            return;
        }
        this.onSearch = this.onSearch.bind(this);
        this.search = new SearchTool(input, {
            container: this.optionsNode,
            searchSelector: this.getProp('search-item-content-selector'),
            onSearch: this.onSearch,
            debounceDelay: this.getProp('debounce-search')
        });
    }

    // #endregion Render

    /////////////////////////
    // #region Lifecycle
    /////////////////////////

    async _initializeValue() {
        this.selectedOption = this.getSelectedOption();
        this.updateValue();
    }

    // #endregion

    ////////////////////////
    // #region Updates
    ///////////////////////

    /**
     * @param {SelectOption} option
     * @param {MouseEvent} event
     */
    onOptionSelected(option, event) {
        const val = option.getAttribute('value') || '';
        this.setValue(val);
        this._callOnChange(event);
        this.inputCombo?.close();
        this.updateValue();
    }

    /**
     * Updates the value of the select combo field based on the selected option.
     */
    async updateValue() {
        await this.promise;
        await this.waitForArpaNodes();
        /** @type {SelectOption} */
        this.selectedOption = this.getSelectedOption();
        this.getOptions().forEach(option => option.removeAttribute('aria-selected'));
        this.selectedOption?.setAttribute('aria-selected', 'true');
        this.updateInputLabel();
        this.resetSearchState();
    }

    getValueLabel(option = this.getSelectedOption()) {
        const { renderValue } = this._config;
        const configValue = typeof renderValue === 'function' && renderValue(option);
        return configValue || option?.getProp('label') || option?.nodes.main.innerHTML?.trim() || this.getProp('placeholder');
    }

    /**
     * Updates the label of the button input of the select combo field.
     * @param {string | HTMLElement} label
     */
    updateInputLabel(label = this.getValueLabel()) {
        if (this.searchInput instanceof HTMLInputElement) {
            this.searchInput.value = typeof label === 'string' ? label : label?.textContent || '';
        }
        if (this.input instanceof HTMLButtonElement) {
            this.input.innerHTML = '';
            if (typeof label === 'string') {
                this.input.innerHTML = label;
            } else if (label instanceof HTMLElement) {
                this.input.appendChild(label);
            }
        }
    }

    // #endregion Updates

    ///////////////////////////
    // #region Combo
    ///////////////////////////

    onOpenCombo() {
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function' && this.query) {
            this.fetchOptions();
        }
    }

    onCloseCombo() {
        this.resetSearchState();
    }

    /**
     * Initializes the input combo for the select combo field.
     * @param {HTMLInputElement} [input]
     * @param {HTMLElement | null} [optionsNode]
     */
    initializeInputCombo(input = this.input, optionsNode = this.optionsNode) {
        optionsNode && (this.zoneTarget = optionsNode);
        if (!input || !optionsNode) return;
        if (this.inputCombo) {
            this.inputCombo.initialize(input, optionsNode);
            return;
        }
        this.inputCombo = new InputCombo(input, optionsNode, {
            containerSelector: this.getProp('option-component'),
            position: {
                position: this.getProp('optionsPosition')
            },
            closeOnClick: true,
            onOpen: () => this.onOpenCombo(),
            onClose: () => this.onCloseCombo()
        });
    }

    // #endregion

    ////////////////////////
    // #region Search
    ///////////////////////

    onSearchInputFocus() {
        this.input?.select();
    }

    onSearchInputBlur() {
        if (this.input) {
            this.input.value = this.getSelectedOption()?.getProp('label') || '';
        }
    }

    resetSearchState() {
        if (this.hasSearch()) {
            this.getOptions().forEach(node => {
                node.style.display = '';
                addSearchMatchMarkers(node, '', this.getContentSelector());
            });
        }
    }

    /** @type {SearchToolCallbackType} */
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
