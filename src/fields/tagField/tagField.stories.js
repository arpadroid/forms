import { fn } from '@storybook/test';
const html = String.raw;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
    title: 'Fields/Select/Tag',
    tags: ['autodocs'],
    render: args => {
        return html`
            <form id="demoForm" is="arpa-form">
                <tag-field id="tag-field" label="Tag field">
                    <tag-item>Item 1</tag-item>
                </tag-field>
                
            </form>
            <script type="module">
                import { People } from '../../demo/demoFormOptions.js';
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demoForm');
                    form.onSubmit(values => {
                        console.log('form values', values);
                        return true;
                    });
                    const tagField = form.getField('tag-field');
                    tagField.setFetchOptions(async query => {
                        if (!query) {
                            return [...People].splice(0, 10);
                        }
                        return [...People].filter(
                            option =>
                                option.label.toLowerCase().includes(query.toLowerCase()) ||
                                option.subTitle.toLowerCase().includes(query.toLowerCase())
                        );
                    });
                });
            </script>
        `;
    },
    argTypes: {
        extensions: {
            control: 'text'
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
        minSize: 0,
        maxSize: 0
    }
};
