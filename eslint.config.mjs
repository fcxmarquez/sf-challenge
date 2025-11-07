import { defineConfig, globalIgnores } from 'eslint/config';
import { fileURLToPath } from 'url';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map(
	(config) => ({
		...config,
		files: config.files ?? ['**/*.{ts,tsx,cts,mts}'],
		languageOptions: {
			...config.languageOptions,
			parserOptions: {
				...config.languageOptions?.parserOptions,
				projectService: true,
				tsconfigRootDir,
			},
		},
	})
);

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	...typeCheckedConfigs,
	{
		rules: {
			...(importPlugin.configs?.recommended?.rules ?? {}),
			...(importPlugin.configs?.typescript?.rules ?? {}),
		},
	},
	{
		settings: {
			'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
	security.configs.recommended,
	sonarjs.configs.recommended,
	eslintConfigPrettier,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
