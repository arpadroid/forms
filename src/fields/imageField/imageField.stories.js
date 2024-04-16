import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Image',
    tags: ['autodocs'],
    render: args => {
        const { allowMultiple, hasDropArea, minSize, maxSize } = args;
        return html`
            <form id="demoForm" is="arpa-form">
                <image-field
                    id="file"
                    label="Image field"
                    allow-multiple="${allowMultiple}"
                    has-drop-area="${hasDropArea}"
                    min-size="${minSize}"
                    max-size="${maxSize}"
                >
                    <image-item
                        size="10000"
                        src="http://localhost:8000/demo/assets/very long document name to test for layout.txt"
                    ></image-item>
                </image-field>
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
        extensions: {
            control: 'text',
            // options: []
        },
        minSize: {
            control: 'number'
        }
    },
    args: { onClick: fn() }
};

export const Default = {
    args: {
        allowMultiple: true,
        hasDropArea: true,
        minSize: 0,
        maxSize: 0
    }
};
