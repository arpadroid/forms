/**
 * @typedef {import('./tagField.types').TagFieldConfigType} TagFieldConfigType
 * @typedef {import('@arpadroid/lists').TagList} TagList
 * @typedef {import('./components/tagOption/tagOption.js').TagOptionConfigType} TagOptionConfigType
 * @typedef {import('@arpadroid/lists').TagItem} TagItem
 * @typedef {import('@arpadroid/lists').TagItemConfigType} TagItemConfigType
 */

import { mergeObjects, isObject, defineCustomElement } from '@arpadroid/tools';
import SelectCombo from '../selectCombo/selectCombo.js';
import Field from '../field/field.js';
import ArrayField from '../arrayField/arrayField.js';
import { I18n } from '@arpadroid/i18n';

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
        this.bind('_onDeleteTag', '_onSearchInputKeyDown');
        /** @type {TagFieldConfigType} */
        const conf = {
            hasSearch: true,
            classNames: ['selectComboField', 'tagField'],
            placeholder: I18n.getText('forms.fields.tag.lblSearchTags'),
            allowTextInput: false,
            optionComponent: 'tag-option',
            icon: 'label',
            tagDefaults: {
                onDelete: this._onDeleteTag
                // icon: 'label'
            }
        };
        return /** @type {TagFieldConfigType} */ (mergeObjects(super.getDefaultConfig(), conf));
    }

    getTemplateVars() {
        return mergeObjects(super.getTemplateVars(), {
            afterInput: this.renderTagList()
        });
    }

    // #endregion

    //////////////////////
    // #region LIFECYCLE
    /////////////////////

    async _initializeValue() {
        // await this.load;
        if (this._hasInitializedValue) {
            return;
        }
        ArrayField.prototype._initializeValue.call(this);
        this._hasInitializedValue = true;
    }

    async _initializeNodes() {
        super._initializeNodes();
        /** @type {TagList | null} */
        this.tagList = this.querySelector('tag-list');
    }

    _initializeSearchInput() {
        super._initializeSearchInput();
        if (this.searchInput) {
            this.searchInput.removeEventListener('keydown', this._onSearchInputKeyDown);
            this.searchInput.addEventListener('keydown', this._onSearchInputKeyDown);
        }
    }

    // #endregion

    //////////////////////
    // #region RENDERING
    /////////////////////

    renderTagList() {
        return html`
            <tag-list id="${this.getHtmlId()}--tagList" no-items-content="" variant="mini" has-resource>
                ${this.renderTags()}
            </tag-list>
        `;
    }

    renderTags() {
        return this.value?.map(tag => html`<tag-item>${tag}</tag-item>`).join('');
    }

    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    getFieldType() {
        return 'tag';
    }

    getTagName() {
        return 'tag-field';
    }

    /**
     * Sets the value of the field.
     * @param {unknown} value - The value to set.
     * @returns {this} The field instance.
     */
    setValue(value) {
        const tags = this.setTags(value);
        return /** @type {this} */ (
            Field.prototype.setValue.call(
                this,
                tags?.map(tag => tag.value)
            )
        );
    }

    /**
     * Sets the tags.
     * @param {unknown[] | unknown} tags
     * @returns {TagItemConfigType[] | undefined}
     */
    setTags(tags) {
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
            this?.tagList?.addItem({
                ...tagDefaults,
                text: item.label,
                value: item.value,
                template: undefined
            });
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
        item && this.tagList?.removeItem(item);
        const hiddenOption = this.optionsNode?.querySelector(`[value="${value}"]`);
        if (hiddenOption instanceof HTMLElement) {
            hiddenOption.style.display = '';
        }
        return this;
    }

    getValue() {
        /** @type {TagItem[]} */
        const items = /** @type {TagItem[]} */ (Array.from(this.tagList?.getChildren() || []));
        return items?.map(item => item.getValue()) ?? this.value;
    }

    allowTextInput() {
        return this.getProperty('allow-text-input');
    }

    async updateSearchInputLabel() {
        // override
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

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
     * Handles the search input keydown event.
     * @param {KeyboardEvent} event - The event object.
     */
    _onSearchInputKeyDown(event) {
        if (this.allowTextInput() && event.key === 'Enter') {
            event.preventDefault();
            this.addValue({ label: this.searchInput?.value, value: this.searchInput?.value });
            // this.searchInput.value = '';
        }
    }

    // #endregion
}

defineCustomElement(TagField.prototype.getTagName(), TagField);

export default TagField;
