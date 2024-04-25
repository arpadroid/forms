import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Text/Number',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="numberForm" is="arpa-form">
                <number-field
                    id="number"
                    label="Number"
                    min="1"
                    max="100"
                    step="3"
                    value="50"
                    required
                ></number-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('numberForm');
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
