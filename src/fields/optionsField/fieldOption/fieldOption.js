/**
 * @typedef {import('../../field/field.js').default} Field
 * @typedef {import('./fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 */
import { mechanize, defineCustomElement, mergeObjects } from '@arpadroid/tools';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;

class FieldOption extends ListItem {
    /** @type {FieldOptionConfigType} */
    _config = this._config;

    /** @returns {FieldOptionConfigType} */
    getDefaultConfig() {
        this.field = this.getField();
        /** @type {FieldOptionConfigType} */
        const config = {
            className: 'fieldOption',
            attributeList: ['value'],
            inputType: undefined,
            inputTag: undefined,
            attributes: {
                role: 'option'
            },
            blueprint: () => ListItem.prototype.$renderTemplate.call(this)
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /** @returns {string} */
    getOptionId() {
        const valueString = mechanize(this.getProp('value'));
        return `${this.getField()?.getId()}-${valueString}`;
    }

    /** @returns {Field | null} */
    getField() {
        return this.field || /** @type {Field} */ (this.closest('.arpaField'));
    }

    isSelected() {
        return this.getAttribute('value') === this.getField()?.getValue();
    }

    setIsSelected() {
        this.isSelected() ? this.setAttribute('aria-selected', 'true') : this.removeAttribute('aria-selected');
    }

    getAction() {
        return this.getProp('action');
    }

    getName() {
        return this.getField()?.getId() || '';
    }

    getWrapperAttr() {
        return {
            ...super.getWrapperAttr(),
            className: 'fieldOption__handler'
        };
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            optionId: this.getOptionId()
        };
    }

    getLabelId() {
        return this.getOptionId() + '-label';
    }

    $renderTemplate() {
        return html`
            <arpa-node ${this.wrapperAttr()}>
                <arpa-node
                    name="input"
                    tag="{inputTag}"
                    type="{inputType}"
                    on-change="{onChange}"
                    value="{value}"
                    checked="{isSelected()}"
                    id="{optionId}"
                    aria-labelledby="{getLabelId()}"
                    can-render="inputTag"
                ></arpa-node>
                <div class="fieldOption__content">
                    <arpa-node name="label" tag="span" id="{getLabelId()}" is-content></arpa-node>
                    {subtitle}
                </div>
                {icon}
            </arpa-node>
            {rhs}
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.input = /** @type {HTMLInputElement} */ (this.nodes.input);
        this.handlerNode = this.querySelector('.fieldOption__handler');
        this.labelNode = /** @type {HTMLLabelElement} */ (this.nodes.label);
        if (this.input instanceof HTMLInputElement) {
            this.input.name = this.getName();
        }
        return true;
    }

    /** @param {Event} _event */
    onChange(_event) {
        this.field?._callOnChange(_event);
        this.setIsSelected();
    }
}

defineCustomElement('field-option', FieldOption);

export default FieldOption;
