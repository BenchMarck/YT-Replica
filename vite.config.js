// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
//       cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-cert.pem')),
//     },
//     host: true,
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
