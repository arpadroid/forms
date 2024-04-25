import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Date & Time/Date',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="demoForm" is="arpa-form">
                <date-field id="date" label="Date field"></date-field>
            </form>
            <script type="module">
                import { People } from '../../demo/demoFormOptions.js';
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demoForm');
                    form.onSubmit(values => {
                        console.log('form values', values);
                        return true;
                    });
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
