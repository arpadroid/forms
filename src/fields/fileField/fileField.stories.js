import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'File Field',
    tags: ['autodocs'],
    render: args => {
        console.log('args', args);
        const { allowMultiple, hasDropArea } = args;
        return html`
            <form id="demoForm" is="arpa-form">
                <file-field
                    id="file"
                    label="File field"
                    allow-multiple="${allowMultiple}"
                    has-drop-area="${hasDropArea}"
                >
                    <file-item
                        size="10000"
                        src="http://localhost:8000/demo/assets/andrea-segovia.jpg"
                    ></file-item>
                </file-field>
            </form>
        `;
    },
    argTypes: {},
    args: { onClick: fn() }
};

export const Default = {
    args: {
        allowMultiple: true,
        hasDropArea: true
    }
};
