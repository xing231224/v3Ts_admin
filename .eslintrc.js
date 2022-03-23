/*
 * @Author: your name
 * @Date: 2022-02-12 15:53:45
 * @LastEditTime: 2022-03-17 10:29:10
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vitecamp\.eslintrc.js
 */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    globals: {
        defineEmits: true,
        document: true,
        localStorage: true,
        GLOBAL_VAR: true,
        window: true,
        defineProps: true,
        defineExpose: true,
    },
    extends: [
        './.eslintrc-auto-import.json',
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended', // 添加 prettier 插件
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint', 'import'],
    rules: {
        // eslint-disable-next-line prettier/prettier
        'no-console': 'off',
        'eol-last': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/ban-types': ['off'],
        'consistent-return': ['off'],
        'no-shadow': ['off'],
        'vue/multi-word-component-names': ['off'],
        bracketSameLine: true,
        camelcase: 'off',
    },
};
