module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		// Semicolons
		semi: "error",
		"semi-style": ["error", "last"],

		// Spaces / Tabs
		indent: ["error", "tab"],
		"no-trailing-spaces": "error",

		// Comments
		"multiline-comment-style": ["error", "starred-block"],
		"spaced-comment": "error",

		// Variables
		"no-var": "error",
		"prefer-const": "error",

		// Logic
		"no-self-compare": "warn",
		"eqeqeq": "error",

		// Mistakes
		"no-template-curly-in-string": "error",

		// Formatting
		"dot-notation": "error",
		"array-bracket-newline": ["error", { multiline: true, minItems: 2 }],
		"multiline-ternary": ["error", "always-multiline"],
		"arrow-spacing": [
			"error",
			{
				before: true,
				after: true,
			},
		],
	},
};
