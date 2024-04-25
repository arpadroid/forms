import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Select/Radio',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="radioForm" is="arpa-form">
                <radio-field id="radio" label="radio" value="option2">
                    <radio-option value="option1" label="Option 1" icon="grocery"></radio-option>
                    <radio-option value="option2" label="Option 2" icon="nutrition"></radio-option>
                    <radio-option value="option3" label="Option 3" icon="person"></radio-option>
                </radio-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('radioForm');
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
