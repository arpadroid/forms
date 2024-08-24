import { mergeObjects, isObject } from '@arpadroid/tools';
import SelectCombo from '../selectCombo/selectCombo.js';
import Field from '../field/field.js';
import ArrayField from '../arrayField/arrayField.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;
class TagField extends SelectCombo {
    value = [];

    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    _bindMethods() {
        super._bindMethods();
        this._onDeleteTag = this._onDeleteTag.bind(this);
        this._onSearchInputKeyDown = this._onSearchInputKeyDown.bind(this);
    }

    /**
     * Returns default config for select field.
     * @returns {*}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            hasSearch: true,
            classNames: ['selectComboField', 'tagField'],
            placeholder: I18n.getText('modules.form.fields.tag.lblSearchTags'),
            allowTextInput: false,
            optionComponent: 'tag-option',
            icon: 'label',
            tagDefaults: {
                onDelete: this._onDeleteTag
                // icon: 'label'
            }
        });
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
        await this.load;
        if (this._hasInitializedValue) {
            return;
        }
        ArrayField.prototype._initializeValue.call(this);
        this._hasInitializedValue = true;
    }

    async _initializeNodes() {
        super._initializeNodes();
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
            <tag-list id="${this.getHtmlId()}--tagList" no-items-content="" variant="mini"> ${this.renderTags()} </tag-list>
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

    setValue(value) {
        const tags = this.setTags(value);
        return Field.prototype.setValue.call(
            this,
            tags.map(tag => tag.value)
        );
    }

    setTags(tags) {
        const _tags = this.parseTags(tags);
        this.tagList.setItems(_tags);
        return _tags;
    }

    parseTags(tags) {
        if (!Array.isArray(tags)) {
            tags = typeof tags === 'undefined' ? [] : [tags];
        }
        return tags.map(tag => this.parseTag(tag));
    }

    parseTag(tag) {
        const { tagDefaults } = this._config;
        if (typeof tag === 'string') {
            const parts = tag.split('::');
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

    addValue(item) {
        const { tagDefaults } = this._config;
        const value = this.getValue();
        if (!value.includes(item.value)) {
            this?.tagList.addItem({
                ...tagDefaults,
                text: item.label,
                value: item.value
            });
        }
        return this;
    }

    removeValue(value) {
        const item = this.tagList.listResource.items.find(item => item.value === value);
        this.tagList.removeItem(item);
        const hiddenOption = this.optionsNode?.querySelector(`[value="${value}"]`);
        if (hiddenOption) {
            hiddenOption.style.display = '';
        }
        return this;
    }

    getValue() {
        const items = Array.from(this.tagList?.getChildren() || []);
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

    _onDeleteTag(tag) {
        this.removeValue(tag.getValue());
        this.signal('onDeleteTag', tag);
        return false;
    }

    onOptionsFetched(options) {
        const opt = options.filter(option => {
            return !this.tagList.listResource.items.find(item => item.value === option.value);
        });
        super.onOptionsFetched(opt);
    }

    _onSearchInputKeyDown(event) {
        if (this.allowTextInput && event.key === 'Enter') {
            event.preventDefault();
            this.addValue({ label: this.searchInput.value, value: this.searchInput.value });
            // this.searchInput.value = '';
        }
    }

    // #endregion
}

customElements.define(TagField.prototype.getTagName(), TagField);

export default TagField;
