import { defineConfig, globalIgnores } from 'eslint/config';
import { fileURLToPath } from 'url';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

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

const importTypeScriptConfig = {
	...importPlugin.flatConfigs.typescript,
	files: ['**/*.{ts,tsx,cts,mts}'],
};

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	...typeCheckedConfigs,
	importPlugin.flatConfigs.recommended,
	importTypeScriptConfig,
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
