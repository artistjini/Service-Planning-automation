const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  sourcemap: true,
  minify: false,
  logLevel: 'info',
};

// styles.css와 webview/sidebar 정적 자산을 out/ 으로 복사
function copyWebviewAssets() {
  const assets = [
    { src: 'src/webview/styles.css', dst: 'out/webview/styles.css' },
    { src: 'src/sidebar/sidebar-styles.css', dst: 'out/sidebar/sidebar-styles.css' },
    // Pretendard 폰트 번들 — 오프라인에서도 SF Pro급 한글. 사이드바·webview 공유 (out/fonts).
    { src: 'src/fonts/PretendardVariable.woff2', dst: 'out/fonts/PretendardVariable.woff2' },
  ];
  for (const { src, dst } of assets) {
    const srcAbs = path.join(__dirname, src);
    const dstAbs = path.join(__dirname, dst);
    const dstDir = path.dirname(dstAbs);
    if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
    if (fs.existsSync(srcAbs)) {
      fs.copyFileSync(srcAbs, dstAbs);
      console.log(`  copied ${src} → ${dst}`);
    }
  }
}

if (watch) {
  esbuild.context(config).then(ctx => {
    ctx.watch();
    copyWebviewAssets();
    console.log('watching...');
  });
} else {
  esbuild.build(config).then(() => {
    copyWebviewAssets();
    console.log('build complete');
  }).catch(() => process.exit(1));
}
