import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Other/Hidden',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="hiddenFieldForm" is="arpa-form">
                <hidden-field id="hiddenField" value="hidden value"></hidden-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('hiddenFieldForm');
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
