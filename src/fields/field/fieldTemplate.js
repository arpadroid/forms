const html = String.raw;

export const InputTemplate = html`<input is="field-input" />`;

export const FieldTemplate = html`
    <div class="arpaField__header">
        <label is="field-label"></label>
        <field-errors></field-errors>
        <arpa-tooltip position="bottom-right">{tooltip}</arpa-tooltip>
    </div>
    {subHeader}
    <div class="arpaField__body">
        <p is="field-description"></p>
        <div class="arpaField__inputWrapper">
            {input}
            {inputMask}
        </div>
    </div>

    <div class="arpaField__footer">
        <p is="field-footnote"></p>
    </div>
`;
