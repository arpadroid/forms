import { fn } from '@storybook/test';
const html = String.raw;
export default {
    title: 'Fields/Text/Search',
    tags: ['autodocs'],
    render: args => {
        return html`
            <form id="demoForm" is="arpa-form">
                <search-field variant="${args.variant}" id="file"> </search-field>
            </form>
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demoForm');
                    form.onSubmit(payload => {
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
