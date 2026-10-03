/**
 * @typedef {import('./tagField.types').TagFieldConfigType} TagFieldConfigType
 * @typedef {import('@arpadroid/lists').TagList} TagList
 * @typedef {import('./components/tagOption/tagOption.js').TagOptionConfigType} TagOptionConfigType
 * @typedef {import('@arpadroid/lists').TagItem} TagItem
 * @typedef {import('@arpadroid/lists').TagItemConfigType} TagItemConfigType
 */

import { mergeObjects, isObject, defineCustomElement, mapHTML } from '@arpadroid/tools';
import SelectCombo from '../selectCombo/selectCombo.js';
import ArrayField from '../arrayField/arrayField.js';
import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';

const html = String.raw;
class TagField extends SelectCombo {
    /** @type {TagFieldConfigType} */
    _config = this._config;
    /** @type {string[]} */
    value = [];

    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    /**
     * Returns default config for select field.
     * @returns {TagFieldConfigType}
     */
    getDefaultConfig() {
        this.bind('_onDeleteTag');
        /** @type {TagFieldConfigType} */
        const conf = {
            hasSearch: true,
            className: 'arpaField',
            classNames: ['selectComboField', 'tagField'],
            placeholder: I18n.getText('forms.fields.tag.lblSearchTags'),
            allowTextInput: false,
            optionComponent: 'tag-option',
            icon: 'label',
            tagDefaults: {
                onDelete: this._onDeleteTag
            }
        };
        return /** @type {TagFieldConfigType} */ (mergeObjects(super.getDefaultConfig(), conf));
    }

    // #endregion

    //////////////////////
    // #region LIFECYCLE
    /////////////////////

    async _initializeValue() {
        await this.promise;
        if (this._hasInitializedValue) {
            return;
        }
        ArrayField.prototype._initializeValue.call(this);
        this._hasInitializedValue = true;
    }

    // #endregion

    //////////////////////
    // #region RENDERING
    /////////////////////

    getSearchInput() {
        return /** @type {HTMLInputElement | null} */ (this.nodes.input);
    }

    $renderTemplate() {
        return html`
            ${Field.prototype.$renderTemplate.call(this)}

            <arpa-node
                name="input"
                tag="input"
                id="{getHtmlId()}"
                type="text"
                class="arpaField__input"
                placeholder="{placeholder}"
                autocomplete="off"
                can-render="hasSearch()"
                on-keydown="{onSearchInputKeyDown}"
            ></arpa-node>

            <arpa-node
                id="{getHtmlId()}-options"
                tag="select-options"
                name="options"
                class-name="optionsField__options"
                zone="{optionsZone}"
                is-content
            ></arpa-node>

            <arpa-zone name="body">
                <tag-list id="${this.getHtmlId()}--tagList" no-items-content="" variant="mini" has-resource>
                    ${mapHTML(this.value, tag => html`<tag-item>${tag}</tag-item>`)}
                </tag-list>
            </arpa-zone>
        `;
    }

    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    getFieldType() {
        return 'tag';
    }

    /**
     * Sets the value of the field.
     * @param {unknown} value
     * @returns {this}
     */
    setValue(value) {
        this.setTags(value);
        return this;
    }

    /**
     * Sets the tags.
     * @param {unknown[] | unknown} tags
     * @returns {TagItemConfigType[] | undefined}
     */
    setTags(tags) {
        this.tagList = /** @type {TagList | null} */ (this.querySelector('tag-list'));
        /** @type {TagItemConfigType[]} */
        const _tags = /** @type {TagItemConfigType[]} */ (this.parseTags(tags));
        this.tagList?.setItems(_tags);
        return _tags;
    }

    /**
     * Parses the tags.
     * @param {unknown[] | unknown} tags - The tags to parse.
     * @returns {TagOptionConfigType[]} The parsed tags.
     */
    parseTags(tags) {
        if (!Array.isArray(tags)) {
            tags = typeof tags === 'undefined' ? [] : [tags];
        }
        return (Array.isArray(tags) && tags.map(tag => this.parseTag(tag))) || [];
    }

    /**
     * Parses a tag.
     * @param {Record<string, unknown>} tag - The tag to parse.
     * @returns {TagOptionConfigType} The parsed tag.
     */
    parseTag(tag) {
        const { tagDefaults } = this._config;
        if (typeof tag === 'string') {
            const parts = /** @type {string}*/ (tag)?.split('::');
            Object.assign(tag, {});
            return {
                ...tagDefaults,
                text: parts[1] || parts[0],
                value: parts[0]
            };
        }
        if (isObject(tag)) {
            return mergeObjects(tagDefaults, tag);
        }
        return tag;
    }

    /**
     * Adds a value to the tag list.
     * @param {TagItemConfigType} item - The item to add.
     * @returns {this} The updated tag field.
     */
    addValue(item) {
        const { tagDefaults } = this._config;
        const value = this.getValue();
        if (!value.includes(item.value)) {
            const payload = {
                ...tagDefaults,
                text: item.label,
                value: item.value
            };
            this.tagList?.addItem(payload);
            const hiddenOption = this.optionsNode?.querySelector(`[value="${item.value}"]`);
            if (hiddenOption instanceof HTMLElement) {
                hiddenOption.style.display = 'none';
            }
        }
        return this;
    }

    /**
     * Removes a tag from the tag list given uts value.
     * @param {string} value
     * @returns {this}
     */
    removeValue(value) {
        const item = this.tagList?.listResource?.items?.find(item => item.value === value);
        // @ts-ignore
        item && this.tagList?.removeItem(item);
        const hiddenOption = this.optionsNode?.querySelector(`[value="${value}"]`);
        if (hiddenOption instanceof HTMLElement) {
            hiddenOption.style.display = '';
        }
        return this;
    }

    getValue() {
        /** @type {TagItem[]} */
        const items = /** @type {TagItem[]} */ (Array.from(this.tagList?.childNodes || []));
        return (
            items
                ?.filter(item => item instanceof HTMLElement)
                .map(item => {
                    return item.getValue();
                }) ?? this.value
        );
    }

    allowTextInput() {
        return this.getProp('allow-text-input');
    }

    updateInputLabel() {
        // override
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    /**
     * @param {import('../selectCombo/selectCombo.js').SelectOption} option
     * @param {MouseEvent} event
     */
    onOptionSelected(option, event) {
        const val = option.getAttribute('value') || '';
        this.addValue({ label: option.nodes.label.textContent, value: val });
        this._callOnChange(event);
    }

    /**
     * Handles the delete tag event.
     * @param {TagItem} tag - The tag to delete.
     * @returns {boolean} False.
     */
    _onDeleteTag(tag) {
        this.removeValue(tag.getValue());
        this.signal('deleteTag', tag);
        return false;
    }

    /**
     * Handles the options when fetched.
     * @param {TagOptionConfigType[]} options - The options to handle.
     */
    onOptionsFetched(options) {
        const opt = options.filter(option => {
            return !this.tagList?.listResource?.items?.find(item => item.value === option.value);
        });
        super.onOptionsFetched(opt);
    }

    /**
     * Handles the search event for the select combo field.
     * @type {import('@arpadroid/tools').SearchToolCallbackType}
     */
    async onSearch(payload) {
        this.inputCombo?.open();
        return super.onSearch(payload);
    }

    /**
     * Handles the search input keydown event.
     * @param {KeyboardEvent} event - The event object.
     */
    onSearchInputKeyDown(event) {
        if (this.searchInput && this.allowTextInput() && event.key === 'Enter') {
            event.preventDefault();
            this.addValue({ label: this.searchInput?.value, value: this.searchInput?.value });
            this.searchInput.value = '';
        }
    }

    // #endregion
}

defineCustomElement('tag-field', TagField);

export default TagField;
