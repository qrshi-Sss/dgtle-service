// TypeScript ESLint 官方提供的规则与工具
import tseslint from 'typescript-eslint'
// 预定义的环境全局变量集合，这里使用 Node.js 环境
import globals from 'globals'
// 将 Prettier 作为 ESLint 插件以便通过 ESLint 报告格式问题
import eslintPluginPrettier from 'eslint-plugin-prettier'
// 关闭与 Prettier 冲突的 ESLint 规则，避免重复或相互抵触
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    // 忽略不需要检查的目录
    ignores: ['dist', 'node_modules']
  },
  ...tseslint.configs.recommended,
  {
    // 适配 JS/TS 文件
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parserOptions: {
        // 最新语法支持版本
        ecmaVersion: 'latest',
        // 使用 ES Module 解析方式
        sourceType: 'module'
      },
      // 指定运行环境的全局变量集合为 Node
      globals: globals.node
    },
    plugins: {
      // 注册 prettier 插件
      prettier: eslintPluginPrettier
    },
    rules: {
      // 未使用变量仅警告；允许以下划线开头的变量被忽略
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      // 允许使用 any 类型（按需放宽）
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许不安全的函数类型（按需放宽）
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // 将 Prettier 的格式问题以 warn 级别呈现
      'prettier/prettier': 'warn'
    }
  },
  // 关闭与 Prettier 冲突的所有规则，以 Prettier 为准
  eslintConfigPrettier
]
