import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'car-rental-api-plugin',
        configureServer(server) {
          // 0. Static file serving for /frames
          server.middlewares.use('/frames', (req, res, next) => {
            const cleanUrl = (req.url || '').split('?')[0].replace(/^\//, '');
            const filePath = path.resolve(__dirname, 'public/frames', cleanUrl);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeTypes: Record<string, string> = {
                '.svg': 'image/svg+xml',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.avif': 'image/avif',
              };
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              return fs.createReadStream(filePath).pipe(res);
            }
            next();
          });

          // 1. Get frames list
          server.middlewares.use('/api/frames', async (req, res, next) => {
            if (req.method !== 'GET') return next();
            res.setHeader('Content-Type', 'application/json');
            const framesDir = path.resolve(__dirname, 'public/frames');
            const uploadsFramesDir = path.resolve(__dirname, 'uploads/frames');
            let frames: string[] = [];
            if (fs.existsSync(uploadsFramesDir)) {
              const files = fs.readdirSync(uploadsFramesDir).filter((f) => /\.(jpe?g|png|webp|avif|svg)$/i.test(f));
              if (files.length > 0) {
                files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
                frames = files.map((f) => `/uploads/frames/${f}`);
              }
            }
            if (frames.length === 0 && fs.existsSync(framesDir)) {
              const files = fs.readdirSync(framesDir).filter((f) => /\.(jpe?g|png|webp|avif|svg)$/i.test(f));
              files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
              frames = files.map((f) => `/frames/${f}`);
            }
            res.end(JSON.stringify({ success: true, count: frames.length, frames }));
          });

          // 2. Upload and extract ezgif zip archive directly to public/frames
          server.middlewares.use('/api/upload-frames-zip', async (req, res, next) => {
            if (req.method !== 'POST') return next();
            try {
              const chunks: Buffer[] = [];
              req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
              req.on('end', async () => {
                try {
                  const bodyBuffer = Buffer.concat(chunks);
                  const framesDir = path.resolve(__dirname, 'public/frames');
                  if (!fs.existsSync(framesDir)) {
                    fs.mkdirSync(framesDir, { recursive: true });
                  }
                  let zipBuffer = bodyBuffer;
                  const contentType = req.headers['content-type'] || '';
                  if (contentType.includes('application/json')) {
                    try {
                      const json = JSON.parse(bodyBuffer.toString('utf8'));
                      if (json.base64) {
                        const raw = json.base64.replace(/^data:.*?;base64,/, '');
                        zipBuffer = Buffer.from(raw, 'base64');
                      }
                    } catch {}
                  }

                  const JSZip = (await import('jszip')).default;
                  const zip = await JSZip.loadAsync(zipBuffer);
                  const savedFiles: string[] = [];

                  // Clean old frames
                  const oldFiles = fs.readdirSync(framesDir);
                  for (const f of oldFiles) {
                    if (/\.(jpe?g|png|webp|avif|svg)$/i.test(f)) {
                      try { fs.unlinkSync(path.join(framesDir, f)); } catch {}
                    }
                  }

                  const entries: { name: string; file: any }[] = [];
                  zip.forEach((relPath, entry) => {
                    if (!entry.dir && !relPath.includes('__MACOSX') && !entry.name.startsWith('.')) {
                      if (/\.(jpe?g|png|webp|avif|svg)$/i.test(entry.name)) {
                        entries.push({ name: entry.name, file: entry });
                      }
                    }
                  });
                  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

                  for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    const content = await entry.file.async('nodebuffer');
                    const ext = path.extname(entry.name) || '.jpg';
                    const pad = String(i + 1).padStart(3, '0');
                    const fileName = `frame_${pad}${ext}`;
                    fs.writeFileSync(path.join(framesDir, fileName), content);
                    savedFiles.push(`/frames/${fileName}`);
                  }

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    count: savedFiles.length,
                    frames: savedFiles,
                    message: `Successfully extracted ${savedFiles.length} frames from zip.`
                  }));
                } catch (innerErr: any) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: innerErr.message || 'Failed to extract zip' }));
                }
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
            }
          });

          // 3. Simple image upload handler
          server.middlewares.use('/api/upload', async (req, res, next) => {
            if (req.method !== 'POST') return next();
            try {
              const chunks: Buffer[] = [];
              req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
              req.on('end', async () => {
                try {
                  const json = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                  const base64Data = json.data;
                  if (!base64Data) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ success: false, error: 'No data' }));
                  }
                  const uploadsDir = path.resolve(__dirname, 'public/uploads');
                  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                  if (matches && matches.length === 3) {
                    const ext = matches[1].split('/')[1] || 'jpg';
                    const filename = `car_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
                    fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(matches[2], 'base64'));
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ success: true, url: `/uploads/${filename}` }));
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, url: base64Data }));
                } catch (e: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, error: e.message }));
                }
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
