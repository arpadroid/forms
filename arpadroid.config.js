const html = String.raw;
const config = {
    deps: ['messages'],
    style_patterns: 'fields/**/*',
    storybookPreviewHead: () => {
        return html`
            <link rel="stylesheet" href="/material-symbols/outlined.css" />
            <link rel="stylesheet" href="/themes/default/default.bundled.final.css" />
            <script type="module" src="/arpadroid-forms.js"></script>
        `;
    },
    storybookSort: ['Components', 'Fields']
};

export default config;
