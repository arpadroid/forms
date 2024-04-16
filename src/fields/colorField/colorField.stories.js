import { fn } from '@storybook/test';
const html = String.raw;
export default {
    title: 'Fields/Text/Color',
    tags: ['autodocs'],
    render: () => {
        return html`
            <form id="demoForm" is="arpa-form">
                <color-field id="color" label="Color" value="yellowgreen"></color-field>
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
    }
};
