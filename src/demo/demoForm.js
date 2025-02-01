/**
 * @typedef {import('../components/form/form.js').default} Form
 */
import { CountryOptions, IconOptions } from './demoFormOptions.js';

customElements.whenDefined('arpa-form').then(() => {
    const form = /** @type {Form} */ (document.getElementById('demoForm'));

    // const messages = form.querySelector('arpa-messages');
    // const message = messages.resource.error('This is a dynamically added error message.', {
    //     canClose: true
    // });
    // setTimeout(() => {
    //     messages.resource.deleteMessage(message);
    // }, 2000);

    const radio = form.getField('radio');
    radio?.on('change', value => {
        console.log('radio on change', value);
    });

    const checks = form.getField('binaryCheckboxes');
    checks?.on('change', payload => {
        console.log('checkboxes changed', payload);
    });

    const selectComboSearch = form.getField('select-combo-search');
    selectComboSearch?.setOptions(CountryOptions);

    const selectCombo = form.getField('selectCombo');
    selectCombo?.setOptions(IconOptions);
    selectCombo?.on('change', value => {
        console.log('selectCombo on change', value);
    });

    const selectFetch = form.getField('select-combo-fetch');
    selectFetch?.setFetchOptions(async query => {
        return await import('./demoFormOptions.js').then(async ({ People }) => {
            // await new Promise(resolve => setTimeout(resolve, 1600));
            if (!query) {
                return [...People].splice(0, 10);
            }
            return [...People].filter(
                option =>
                    option.label.toLowerCase().includes(query.toLowerCase()) ||
                    option.subTitle.toLowerCase().includes(query.toLowerCase())
            );
        });
    });

    const simpleText = form.getField('simpleText');
    simpleText?.setValue('Hello World');
    simpleText?.on('change', value => {
        console.log('simpleText on change', value);
    });

    const selectField = form.getField('selectField');
    selectField?.on('change', value => {
        console.log('selectField on change', value);
    });

    const textarea = form.getField('textarea');
    textarea?.on('change', value => {
        console.log('textarea on change', value);
    });

    const colorField = form.getField('color');
    colorField?.on('change', value => {
        console.log('colorField on change', value);
    });

    form.onSubmit(payload => {
        // return new Promise(resolve => {
        //     setTimeout(() => {
        //         resolve(payload);
        //     }, 2000);
        // });
        console.log('Form submitted', payload);
        return true;
    });
});
