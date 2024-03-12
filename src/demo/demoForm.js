import { CountryOptions, IconOptions } from './demoFormOptions.js';

const form = document.getElementById('demoForm');
console.log('form', form);

customElements.whenDefined('arpa-form').then(() => {
    // form.getField('options-programmed')?.setOptions(options);
    const radio = form.getField('radio');
    radio?.listen('onChange', value => {
        console.log('radio on change', value);
    });

    const checks = form.getField('checkboxes');
    // checks.setOptions(options);
    checks?.listen('onChange', payload => {
        console.log('checkboxes changed', payload);
    });

    const selectComboSearch = form.getField('select-combo-search');
    selectComboSearch?.setOptions(CountryOptions);

    const selectCombo = form.getField('select-combo');
    selectCombo?.setOptions(IconOptions);

    const simpleText = form.getField('simpleText');
    simpleText?.setValue('Hello World');
    

    form.onSubmit(payload => {
        console.log('Form submitted', payload);
    });
});
