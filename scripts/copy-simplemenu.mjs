import fs from 'fs-extra'

// Simplemenu is an optional companion. Tagteam does not need it, but the demo
// shows the two together — Tagteam hides the chapters, Simplemenu draws a
// menubar with only the ones that are left — so the built demo needs its own
// copy of the files. Skipped silently when Simplemenu is not installed.
const src = 'node_modules/reveal.js-simplemenu/plugin/simplemenu'
const dest = 'demo/plugin/simplemenu'

const copySimplemenu = async () => {
  try {
    if (!(await fs.pathExists(src))) {
      console.log('- Simplemenu is not installed, skipping its demo files')
      return
    }

    await fs.copy(src, dest, { overwrite: true })

    console.log('✓ Successfully copied Simplemenu demo files')
  } catch (err) {
    console.error('Error copying Simplemenu files:', err)
    process.exit(1)
  }
}

copySimplemenu()
