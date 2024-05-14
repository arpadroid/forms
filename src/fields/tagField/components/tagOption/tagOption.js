import SelectOption from '../../../selectField/selectOption/selectOption.js';

class TagOption extends SelectOption {
    _onSelected(event) {
        event.stopImmediatePropagation();
        const button = this.querySelector('button');

        if (!button?.getAttribute('data-value')) {
            return;
        }
        const { value, label } = this._config;
        this.classList.add('selectComboOption--selected');
        this.field.addValue({ value, label });
        this.field._callOnChange(event);
        this.style.display = 'none';
        this.focusNext();
        this.field?.inputCombo?.place();
    }

    focusNext() {
        const node = (this.nextSibling ?? this.previousSibling)?.querySelector('button') ?? this.parentNode;
        node?.focus();
    }
}

customElements.define('tag-option', TagOption);

export default TagOption;
