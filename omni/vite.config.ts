import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@/ui': path.resolve(__dirname, 'src/components/ui'),
			'@/context/*': path.resolve(__dirname, 'src/lib/context/*'),
		},
	},
});
