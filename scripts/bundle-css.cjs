const StylesheetBundler = require('@arpadroid/stylesheet-bundler');
const argv = require('yargs').argv;
const cwd = process.cwd();
const MINIFY = Boolean(argv.minify);
const bundler = new StylesheetBundler.ThemesBundler({
    themes: [
        {
            path: cwd + '/src/themes/default',
            baseTheme: cwd + '/node_modules/@arpadroid/ui/src/themes/default'
        }
    ],
    patterns: [cwd + '/src/components/**/*', cwd + '/src/fields/**/*'],
    minify: MINIFY,
    exportPath: cwd + '/dist/themes'
});

async function initialize() {
    return await bundler.initialize();
}
initialize();
