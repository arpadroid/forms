import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Select/Select Combo',
    tags: ['autodocs'],
    render: () => {
        // const { allowMultiple, hasDropArea } = args;
        return html`
            <form id="demoForm" is="arpa-form">
                <select-combo id="select-combo" label="Select Combo"> </select-combo>
            </form>
            <script type="module">
                import { CountryOptions, IconOptions } from '../../demo/demoFormOptions.js';
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demoForm');
                    form.onSubmit(values => {
                        console.log('values', values);
                        return true;
                    });
                    const selectCombo = form.getField('select-combo');
                    selectCombo.setOptions(IconOptions);
                });
            </script>
        `;
    },
    argTypes: {},
    args: { onClick: fn() }
};

export const Default = {
    args: {}
};
