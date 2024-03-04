const html = String.raw;

export const InputTemplate = html`<input is="field-input" />`;

export const FieldTemplate = html`
    <div class="arpaField__header">
        <label is="field-label"></label>
        <arpa-tooltip>{tooltip}</arpa-tooltip>
        <field-errors></field-errors>
    </div>

    <div class="arpaField__body">
        <p is="field-description"></p>
        <field-input-wrapper>
            {input}
            <field-input-mask></field-input-mask>
        </field-input-wrapper>
    </div>

    <div class="arpaField__footer">
        <p is="field-footnote"></p>
    </div>
`;
