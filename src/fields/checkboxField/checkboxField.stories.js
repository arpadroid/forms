import { fn } from '@storybook/test';
const html = String.raw;
export default {
    title: 'Fields/Checkbox',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="demoForm" is="arpa-form">
                <checkbox-field
                    icon="check_circle"
                    id="checkbox"
                    tooltip="This is a tooltip"
                    label="Checkbox"
                    value="true"
                    checked
                ></checkbox-field>
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
        variant: 'default'
    }
};
