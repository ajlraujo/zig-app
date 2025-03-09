// .prettierrc.js
module.exports = {
	singleQuote: true,
	trailingComma: 'all',
	bracketSpacing: false,
	jsxSingleQuote: false,
	// Adicione estas regras específicas para TSX
	arrowParens: 'avoid',
	printWidth: 100,
	tabWidth: 2,
	semi: true,
	// Regra crucial para elementos JSX
	bracketSameLine: false
};