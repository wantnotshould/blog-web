import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  // root __dirname
  const root = process.cwd()
  const srcPath = path.resolve(root, 'src')
  const envPath = path.resolve(root, `.env.${mode}`)
  const envExamplePath = path.resolve(root, '.env.example')

  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log(`.env.${mode} created from .env.example`)
  }

  // In production?
  const isProduction = mode == 'production'

  // load env
  const env = loadEnv(mode, root)
  const { VITE_PORT, VITE_API_URL, VITE_ADMIN_PREFIX } = env
  const port = parseInt(VITE_PORT)

  return defineConfig({
    base: isProduction ? VITE_ADMIN_PREFIX : '/',
    server: {
      // open: true,
      port: isNaN(port) ? 5173 : port,
      proxy: {
        '/api': {
          target: VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      vue(),
      // https://element-plus.org/zh-CN/guide/quickstart.html#自动导入-推荐
      AutoImport({
        // https://github.com/sxzz/element-plus-best-practices/blob/db2dfc983ccda5570033a0ac608a1bd9d9a7f658/vite.config.ts#L21-L58
        imports: ['vue', 'vue-router'],
        dts: path.resolve(srcPath, 'auto-imports.d.ts'),
        eslintrc: {
          enabled: true,
          filepath: path.resolve(srcPath, '.eslintrc-auto-import.json'),
          globalsPropValue: true,
        },
        resolvers: [
          ElementPlusResolver(),
          // Auto import icon components
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Components({
        dts: path.resolve(srcPath, 'components.d.ts'),
        resolvers: [
          // Auto register icon components
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          // Auto register Element Plus components
          ElementPlusResolver(),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  })
}
