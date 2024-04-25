import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Other/Group',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="groupFieldForm" is="arpa-form">
                <group-field label="Text fields" id="tex-fields-group" icon="title" open>
                    <email-field id="email" label="Email" required value=""></email-field>
                    <text-field id="text" label="Text" required value=""></text-field>
                    <text-area-field id="text-area" label="Text area" required value=""></text-area-field>
                    <number-field id="number" label="Number" required value=""></number-field>
                </group-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('groupFieldForm');
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
