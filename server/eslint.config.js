const js = require('@eslint/js');
const globals = require('globals');

const tseslint = require('typescript-eslint');
const parser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  { ignores: ['dist', 'node_modules', 'build'] },
  {
    extends: [
      js.configs.recommended, // Use ESLint's recommended rules
      ...tseslint.configs.recommended, // TypeScript recommended rules
      eslintPluginPrettierRecommended, // Integrate Prettier formatting with ESLint
    ],
    files: ['**/*.{js,ts}'], // Focus on JavaScript and TypeScript files for the server
    languageOptions: {
      parser: parser, // Use TypeScript parser
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      globals: { ...globals.node, ...globals.es2020 }, // Set globals for Node.js environment
    },
    plugins: {
      prettier: prettier, // Use Prettier plugin for auto-fixing formatting issues
    },
    rules: {
      // Disable prop-types and React-specific rules since it's a server-side code
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-deprecated': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',

      // TypeScript specific rules
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',

      // General Node.js rules
      'no-process-exit': 'off', // Warn against using process.exit()
      'no-unused-vars': 'warn', // Warn if variables are defined but not used
      'no-shadow': 'warn', // Warn if variables shadow outer scope
      'no-redeclare': 'warn', // Warn if variables are redeclared

      // Disable specific rules that might be less relevant for server-side code
      'no-empty': 'off', // Allow empty blocks
      'no-case-declarations': 'warn', // Warn if `case` blocks declare variables
      'prefer-const': 'warn', // Encourage the use of `const` when variables are never reassigned
    },
  },
);
