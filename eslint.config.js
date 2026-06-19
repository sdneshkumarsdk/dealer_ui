import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,vue}'],
        plugins: {
            vue: pluginVue,
        },
        languageOptions: {
            globals: globals.browser,
            parser: vueParser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },
        rules: {
            ...pluginVue.configs['flat/essential']?.rules,
            'vue/multi-word-component-names': 'off',
            'vue/no-unused-vars': 'off',
        },
    },
])
