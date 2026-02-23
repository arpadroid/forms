/** @type {import('@arpadroid/module').BuildConfigType} */
const config = {
    deps: ['messages'],
    style_patterns: 'fields/**/*',
    buildTypes: true,
    storybook_port: 6005,
    turbo: false,
    buildType: 'uiComponent',
    logo: `            ┓    • ┓  ┏        
   ┏┓┏┓┏┓┏┓┏┫┏┓┏┓┓┏┫  ╋┏┓┏┓┏┳┓┏
   ┗┻┛ ┣┛┗┻┗┻┛ ┗┛┗┗┻  ┛┗┛┛ ┛┗┗┛
-------┛---------------------------`
};

export default config;
