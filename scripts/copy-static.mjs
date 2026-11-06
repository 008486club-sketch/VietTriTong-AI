// Cross-platform replacement for the old Windows-only `xcopy` step.
// Copies public/ and .next/static/ into the Next.js standalone output.
import { cpSync, existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const standalone = path.join(root, '.next', 'standalone')

if (!existsSync(standalone)) {
  console.error('[copy-static] .next/standalone not found — run `next build` first.')
  process.exit(1)
}

cpSync(path.join(root, 'public'), path.join(standalone, 'public'), { recursive: true })

const staticDir = path.join(root, '.next', 'static')
if (existsSync(staticDir))
  cpSync(staticDir, path.join(standalone, '.next', 'static'), { recursive: true })

console.log('[copy-static] public/ and .next/static/ copied to .next/standalone')
