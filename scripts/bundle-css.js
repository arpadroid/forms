const arpadroidThemes = require('arpadroid-themes');
const { ThemesBundler } = arpadroidThemes;
const argv = require('yargs').argv;
const mode = argv.mode === 'production' ? 'production' : 'development';
const cwd = process.cwd();
const basePath = cwd + '/src/themes/';
const bundler = new ThemesBundler({
    themes: [{ path: basePath + '/default' }],
    patterns: [cwd + '/src/components/**/*', cwd + '/src/fields/**/*'],
    minify: mode === 'production'
});
bundler.promise.then(async () => {
    bundler.cleanup();
    await bundler.bundle();
    if (mode === 'development') {
        bundler.watch();
    }
});
