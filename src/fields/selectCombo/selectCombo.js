import { mergeObjects, searchNodes, addSearchMatchMarkers } from '@arpadroid/tools';
import { InputCombo } from '@arpadroid/ui';
import SelectField from '../selectField/selectField.js';

/**
 * @typedef {import('../selectField/selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 */

const html = String.raw;

/**
 * Represents a custom select combo field.
 */
class SelectCombo extends SelectField {
    constructor(config) {
        super(config);
        this._searchTimeout = null;
        this._onLabelClick = this._onLabelClick.bind(this);
        this._onSearchInput = this._onSearchInput.bind(this);
        this._onOpenCombo = this._onOpenCombo.bind(this);
        this._onCloseCombo = this._onCloseCombo.bind(this);
        this._onSearchInputFocus = this._onSearchInputFocus.bind(this);
    }

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
                {input} {button}
                <div class="selectCombo__options comboBox">{options}</div>
            `,
            optionTemplate: html`<select-option role="option"></select-option>`
        });
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
        }
    }

    /**
     * Updates the value of the select combo field based on the selected option.
     */
    updateValue() {
        /** @type {SelectOption} */
        const selectedOption = this.getSelectedOption();
        const label = selectedOption?.getProperty('label');
        if (selectedOption) {
            if (this.buttonInput) {
                this.buttonInput.textContent = label;
            }
            if (this.searchInput) {
                this.searchInput.value = label;
            }
        }
    }

    _initializeNodes() {
        super._initializeNodes();
        this._initializeButtonInput();
        this._initializeSearchInput();
        this.optionsNode = this.querySelector('.selectCombo__options');
        this._initializeInputCombo();
        this.updateValue();
        this?.label.addEventListener('click', this._onLabelClick);
    }

    _onLabelClick() {
        return this.getInput()?.focus();
    }

    getInput() {
        return this.searchInput ?? this.buttonInput;
    }

    _initializeButtonInput() {
        this.buttonInput = this.querySelector('button.optionsField__input');
    }

    _initializeSearchInput() {
        this.searchInput = this.querySelector('input.optionsField__searchInput');
        if (this.searchInput) {
            this.searchInput.removeEventListener('input', this._onSearchInput);
            this.searchInput.addEventListener('input', this._onSearchInput);
            this.searchInput.removeEventListener('focus', this._onSearchInputFocus);
            this.searchInput.addEventListener('focus', this._onSearchInputFocus);
        }
    }

    _onSearchInputFocus() {
        this.searchInput.select();
    }

    _onSearchInput(event) {
        const { debounceSearch } = this._config;
        clearTimeout(this._searchTimeout);
        this._searchTimeout = setTimeout(() => {
            if (this.searchInput.value !== this._prevValue) {
                this._onSearch(this.searchInput.value, event);
            }
            this._prevValue = this.searchInput.value;
        }, debounceSearch);
    }

    _onOpenCombo() {
        this._resetSearchState();
    }

    _onCloseCombo() {
        // this._resetSearchState();
    }

    _onSearch(query) {
        const { matches, nonMatches } = searchNodes(query, this.optionsNode.children);
        const searchSelector = this.getProperty('search-item-content-selector');
        if (matches.length === 0) {
            [...matches, ...nonMatches].forEach(node => (node.style.display = 'block'));
        } else {
            matches.forEach(node => {
                node.style.display = 'block';
                addSearchMatchMarkers(node, query, searchSelector);
            });
            nonMatches.forEach(node => (node.style.display = 'none'));
        }
    }

    _resetSearchState() {
        if (this.hasSearch()) {
            this.getOptions().forEach(node => (node.style.display = 'block'));
        }
    }

    setOptions(options) {
        super.setOptions(options);
        this.updateValue();
    }

    /**
     * Renders the input element of the select combo field.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        if (this.hasSearch()) {
            return html`<input type="text" class="optionsField__searchInput fieldInput" />`;
        }
        return html`<button type="button" class="optionsField__input fieldInput"></button>`;
    }

    /**
     * Initializes the input combo for the select combo field.
     * @protected
     */
    _initializeInputCombo() {
        const handler = this.getInput();
        if (handler && !this.inputCombo) {
            this.inputCombo = new InputCombo(handler, this.optionsNode, {
                containerSelector: 'select-option',
                onOpen: () => this._onOpenCombo(),
                onClose: () => this._onCloseCombo()
            });
        }
    }

    hasSearch() {
        const { fetchOptions, options } = this._config;
        const hasSearch = this.hasAttribute('has-search') || this._config.hasSearch;
        return Boolean(hasSearch || (fetchOptions && !options.length));
    }
}

customElements.define('select-combo', SelectCombo);

export default SelectCombo;
