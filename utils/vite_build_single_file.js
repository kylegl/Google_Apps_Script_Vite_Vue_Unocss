// This file tells vite config that we don't want code splitting
const defaultConfig = {
  useRecommendedBuildConfig: true,
  removeViteModuleLoader: false,
}
export function viteSingleFile({
  useRecommendedBuildConfig = true,
  removeViteModuleLoader = false,
} = defaultConfig) {
  return {
    name: 'vite:singlefile',
    config: useRecommendedBuildConfig ? _useRecommendedBuildConfig : undefined,
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        // Only use this plugin during build
        if (!ctx || !ctx.bundle)
          return html
        // Get the bundle
        for (const [, value] of Object.entries(ctx.bundle)) {
          const o = value
          const a = value
          if (o.code) {
            const reScript = new RegExp(
              `<script type="module"[^>]*?src="[\./]*${o.fileName}"[^>]*?></script>`,
            )
            const code = '<script type="module">\nINSERT_JS\n</script>'
            const inlined = html.replace(reScript, _ => code)
            html = removeViteModuleLoader
              ? _removeViteModuleLoader(inlined)
              : inlined
          }
          else if (a.fileName.endsWith('.css')) {
            const reCSS = new RegExp(
              `<link rel="stylesheet"[^>]*?href="[\./]*${a.fileName}"[^>]*?>`,
            )
            const code = '<style type="text/css">\n INSERT_CSS \n</style>'
            html = html.replace(reCSS, _ => code)
          }
          else {
            // console.warn(`${chalk.yellow("WARN")} asset not inlined: ${chalk.green(a.fileName)}`);
          }
        }
        return html
      },
    },
  }
}
// Optionally remove the Vite module loader since it's no longer needed because this plugin has inlined all code.
const _removeViteModuleLoader = (html) => {
  const match = html.match(
    /(<script type="module">[\s\S]*)(const (\S)=function\(\)\{[\s\S]*\};\3\(\);)/,
  )
  // Graceful fallback if Vite updates the format of their module loader in the future.
  if (!match || match.length < 3)
    return html
  return html
    .replace(match[1], '  <script type="module">')
    .replace(match[2], '')
}
// Modifies the Vite build config to make this plugin work well.
const _useRecommendedBuildConfig = (config) => {
  if (!config.build)
    config.build = {}
  // Ensures that even very large assets are inlined in your JavaScript.
  config.build.assetsInlineLimit = 100000000
  // Avoid warnings about large chunks.
  config.build.chunkSizeWarningLimit = 100000000
  // Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
  config.build.cssCodeSplit = false
  // Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
  config.build.reportCompressedSize = false
  if (!config.build.rollupOptions)
    config.build.rollupOptions = {}
  if (!config.build.rollupOptions.output)
    config.build.rollupOptions.output = {}
  const updateOutputOptions = (out) => {
    // Ensure that as many resources as possible are inlined.
    out.inlineDynamicImports = true
  }
  if (!Array.isArray(config.build.rollupOptions.output))
    updateOutputOptions(config.build.rollupOptions.output)

  else
    config.build.rollupOptions.output.forEach(updateOutputOptions)
}
