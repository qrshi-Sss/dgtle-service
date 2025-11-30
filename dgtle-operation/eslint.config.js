import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist', 'node_modules']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    languageOptions: {
      ...(c.languageOptions || {}),
      parserOptions: {
        ...(c.languageOptions?.parserOptions || {}),
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd()
      }
    }
  })),
  prettierConfig,
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
]
