import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Checkboxes',
    tags: ['autodocs'],
    render: args => {
        // const { allowMultiple, hasDropArea, extensions, minSize, maxSize } = args;
        return html`
            <form id="demoForm" is="arpa-form">
                <checkboxes-field
                    id="checkboxes"
                    label="Checkboxes Field"
                    value="option1"
                    ${args.binary ? 'binary' : ''}
                >
                    <checkbox-option value="option1" label="Option 1" icon="grocery"></checkbox-option>
                    <checkbox-option value="option2" label="Option 2" icon="nutrition"></checkbox-option>
                    <checkbox-option value="option3" label="Option 3" icon="person"></checkbox-option>
                </checkboxes-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demoForm');
                    form.onSubmit(values => {
                        console.log('Form values', values);
                        return true;
                    });
                });
            </script>
        `;
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'mini']
        }
    },
    args: { onClick: fn() }
};

export const Default = {
    args: {
        variant: 'default',
        binary: false
    }
};
