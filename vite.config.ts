import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import presets from './presets/presets';
import { svgBuilder } from './src/utils/svgBuilder';

const proxyDomain = "http://192.168.3.241:9999";

// https://vitejs.dev/config/
export default defineConfig((env) => {
    // env 环境变量
    const viteEnv = loadEnv(env.mode, `.env.${env.mode}`);

    return {
        base: viteEnv.VITE_BASE,
        // 插件
        plugins: [svgBuilder('./src/assets/svg/'), presets(env)],
        // 别名设置
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'), // 把 @ 指向到 src 目录去
            },
        },
        // 服务设置
        server: {
            host: true, // host设置为true才可以使用network的形式，以ip访问项目
            port: 8080, // 端口号
            open: true, // 自动打开浏览器
            cors: true, // 跨域设置允许
            strictPort: false, // 如果端口已占用直接退出
            // 接口代理
            proxy: {
                // '/api': {
                //     target: proxyDomain,
                //     changeOrigin: true, // 允许跨域
                //     rewrite: (path) => path.replace('/api/', '/'),
                // },
                "/auth/": {
                    target: proxyDomain,
                    changeOrigin: true,
                    pathRewrite: {
                        "^/auth/": "/auth/"
                    }
                },
                "/paima/": {
                    target: proxyDomain,
                    changeOrigin: true,
                    pathRewrite: {
                        "^/paima/": "/paima/"
                    }
                },
                '/telbot/': {
                    target: proxyDomain,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/telbot/': '/telbot/'
                    }
                },
                '/wechat/': {
                    target: proxyDomain,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/wechat/': '/wechat/'
                    }
                },
                '/admin/': {
                    target: proxyDomain,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/admin/': '/admin/'
                    }
                }
            },
        },
        build: {
            brotliSize: false,
            // 消除打包大小超过500kb警告
            chunkSizeWarningLimit: 2000,
            productionSourceMap: false,
            // 在生产环境移除console.log
            // terserOptions: {
            //     compress: {
            //         drop_console: true,
            //         drop_debugger: true,
            //     },
            // },
            assetsDir: 'static/assets',
            // 静态资源打包到dist下的不同目录
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
            },
        },
        css: {
            preprocessorOptions: {
                // 全局引入了 scss 的文件
                scss: {
                    additionalData: `
          @import "@/assets/styles/variables.scss";
        `,
                    javascriptEnabled: true,
                },
            },
        },
    };
});
