import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Text/Email',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="emailFieldForm" is="arpa-form">
                <email-field id="email" label="Email" required value="andriusain@hotmail.com"></email-field>
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
