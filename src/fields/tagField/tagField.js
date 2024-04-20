import { mergeObjects } from '@arpadroid/tools';
import { TagList } from '@arpadroid/ui';
import SelectCombo from '../selectCombo/selectCombo.js';
import Field from '../field/field.js';

const html = String.raw;
class TagField extends SelectCombo {
    value = [];
    /**
     * Returns default config for select field.
     * @returns {*}
     */
    getDefaultConfig() {
        this._onDeleteTag = this._onDeleteTag.bind(this);
        return mergeObjects(super.getDefaultConfig(), {
            hasSearch: true,
            classNames: ['selectComboField', 'tagField'],
            placeholder: 'Search tags',
            allowTextInput: true,
            optionComponent: 'tag-option'
        });
    }

    async _initializeNodes() {
        super._initializeNodes();
        if (!this.tagList) {
            this.tagList = this.renderTagList();
        }
        if (this.tagList) {
            this.headerNode.after(this.tagList);
        }
    }

    renderTagList() {
        const node = new TagList({
            noItemsContent: html`<i18n-text key="modules.form.fields.tag.txtNoTagsSelected"></i18n-text>`,
            noItemsIcon: 'label'
        });
        node.setAttribute('variant', 'mini');
        node.innerHTML = this.renderTags();
        return node;
    }

    renderTags() {
        return this.value?.map(tag => html`<tag-item>${tag}</tag-item>`).join('');
    }

    getFieldType() {
        return 'tag';
    }

    setValue(value) {
        return Field.prototype.setValue.call(this, value);
    }

    addValue(item) {
        const existing = this.value?.find(tag => tag.value === item?.value);
        if (existing) {
            return;
        }
        if (!this.value.includes(item)) {
            this.value.push(item.value);
        }
        this?.tagList.addItem({
            text: item.label,
            id: item.value,
            onDelete: this._onDeleteTag,
            icon: 'label'
        });
        return this;
    }

    removeValue(value) {
        this.value = this.value?.filter(val => val !== value);
        this.tagList.removeItem({ id: value });
        const hiddenOption = this.optionsNode?.querySelector(`[value="${value}"]`);
        if (hiddenOption) {
            hiddenOption.style.display = '';
        }
        return this;
    }

    addValues(values) {
        this.value = this.value?.concat(values);
        return this;
    }

    removeValues(values) {
        this.value = this.value?.filter(val => !values.includes(val));
        return this;
    }

    getValue() {
        return this.value;
    }

    getOutputValue() {
        return this.value;
    }

    _onDeleteTag(tag) {
        this.removeValue(tag.getValue());
        this.signal('DELETE_TAG', tag);
        return false;
    }

    onOptionsFetched(options) {
        const opt = options.filter(option => {
            const existing = this?.value?.find(val => val.value === option.value);
            return !existing;
        });
        super.onOptionsFetched(opt);
    }
}

customElements.define('tag-field', TagField);

export default TagField;
