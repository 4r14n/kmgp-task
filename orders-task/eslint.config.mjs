import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.angular/**', '**/*.html'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      '@angular-eslint': angular,
      '@stylistic': stylistic,
      import: importPlugin,
      prettier: prettier,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Semicolons обязательны
      '@stylistic/semi': 'error',

      // Import ordering
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [['external', 'builtin'], ['internal'], ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-duplicates': 'error',

      // Angular specific
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'error',

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'off',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
);
