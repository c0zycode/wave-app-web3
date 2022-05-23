import reactRefresh from '@vitejs/plugin-react-refresh'
const mySecret = process.env['STAGING_ALCHEMY_KEYSTAGING_ALCHEMY_KEY']

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    }
  }
}
