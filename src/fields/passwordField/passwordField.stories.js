import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Text/Password',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="passwordForm" is="arpa-form">
                <password-field id="password" label="Password" confirm value=""></password-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('passwordForm');
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
