import { CountryOptions, IconOptions } from './demoFormOptions.js';

customElements.whenDefined('arpa-form').then(() => {
    const form = document.getElementById('demoForm');
    const radio = form.getField('radio');
    radio?.listen('onChange', value => {
        console.log('radio on change', value);
    });

    const checks = form.getField('binaryCheckboxes');
    checks?.listen('onChange', payload => {
        console.log('checkboxes changed', payload);
    });

    const selectComboSearch = form.getField('select-combo-search');
    selectComboSearch?.setOptions(CountryOptions);

    const selectCombo = form.getField('selectCombo');
    selectCombo?.setOptions(IconOptions);
    selectCombo?.listen('onChange', value => {
        console.log('selectCombo on change', value);
    });

    const simpleText = form.getField('simpleText');
    simpleText?.setValue('Hello World');
    simpleText?.listen('onChange', value => {
        console.log('simpleText on change', value);
    });

    const selectField = form.getField('selectField');
    selectField?.listen('onChange', value => {
        console.log('selectField on change', value);
    });

    const textarea = form.getField('textarea');
    textarea?.listen('onChange', value => {
        console.log('textarea on change', value);
    });

    const colorField = form.getField('color');
    colorField?.listen('onChange', value => {
        console.log('colorField on change', value);
    });

    form.onSubmit(payload => {
        console.log('Form submitted', payload);
    });
});
