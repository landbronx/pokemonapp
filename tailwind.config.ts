import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
	},

	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui') // Add DaisyUI plugin here
	],

	// Optional: DaisyUI specific configurations
	daisyui: {
		themes: true, // Enables DaisyUI themes (default)
		// Customize your DaisyUI themes or settings here if needed
	}
} as Config;
