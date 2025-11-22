import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	server: {
    // This allows Vite to be accessed over the network (e.g., via ngrok or LAN)
    host: true, 
	allowedHosts: [
		'localhost',
		'33ea3ed8df3a.ngrok-free.app'
	]
  	}
});
