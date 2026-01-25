// app/middlewares/UploadMiddleware.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FileType = require('file-type');
const { formatDateYYMMDDHHmmss } = require('../helpers/webHelper');

const MIME_MAP = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function UploadMiddleware({
  folder,
  maxSize = 5 * 1024 * 1024,
  allowed = [],
  fieldName = 'file'
}) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      try {
        const target = typeof folder === 'function' ? folder(req) : folder;

        if (!target) {
          return cb(new Error('Folder upload tidak valid'));
        }

        fs.mkdirSync(target, { recursive: true });
        cb(null, target);
      } catch (err) {
        cb(err);
      }
    },

    filename(req, file, cb) {
      const raw =
        formatDateYYMMDDHHmmss() +
        (req.user?.id || 'guest') +
        crypto.randomBytes(4).toString('hex');

      const name = crypto
        .createHash('sha1')
        .update(raw)
        .digest('hex')
        .slice(0, 32);

      cb(null, name); // tanpa ext dulu (akan ditambah setelah validasi magic number)
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxSize }
  });

  return [
    /* =====================================================
     * 1) Multer upload + error handler
     * ===================================================== */
    (req, res, next) => {
      upload.single(fieldName)(req, res, function (err) {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
              message: `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)} MB`,
              data: null
            });
          }

          return res.status(400).json({
            message: err.message || 'Gagal upload file',
            data: null
          });
        }

        next();
      });
    },

    /* =====================================================
     * 2) Validasi magic number + rename ext + set req.uploadedFiles
     * ===================================================== */
    async (req, res, next) => {
      if (!req.file) return next();

      const tmpPath = req.file.path;
      let finalPath = null;

      try {
        // baca file kecil (aman karena ada maxSize)
        const buffer = fs.readFileSync(tmpPath);
        const detected = await FileType.fromBuffer(buffer);

        if (!detected) {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
          return res.status(400).json({
            message: 'File tidak dikenali',
            data: null
          });
        }

        // validasi ext
        if (allowed.length > 0 && !allowed.includes(detected.ext)) {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
          return res.status(400).json({
            message: `File ${detected.ext} tidak diizinkan`,
            data: null
          });
        }

        // validasi mime (extra safety)
        if (MIME_MAP[detected.ext] && MIME_MAP[detected.ext] !== detected.mime) {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
          return res.status(400).json({
            message: 'Tipe file tidak valid',
            data: null
          });
        }

        // rename -> tambah ext
        finalPath = `${tmpPath}.${detected.ext}`;
        fs.renameSync(tmpPath, finalPath);

        if (!fs.existsSync(finalPath)) {
          return res.status(500).json({
            message: 'Upload gagal, file tidak tersimpan',
            data: null
          });
        }

        // pastikan container
        if (!req.uploadedFiles) req.uploadedFiles = {};

        // simpan relative path (tanpa "storage/")
        // const relativePath = finalPath.replace(/^storage[\\/]/, '');

        // simpan relative path lengkap termasuk "storage/"
        const relativePath = finalPath.replace(/\\/g, '/');

        req.uploadedFiles[fieldName] = {
          filename: path.basename(finalPath),
          relative_path: relativePath,
          ext: detected.ext,
          mime: detected.mime,
          size: req.file.size
        };

        next();
      } catch (err) {
        // cleanup aman
        if (finalPath && fs.existsSync(finalPath)) {
          fs.unlinkSync(finalPath);
        } else if (tmpPath && fs.existsSync(tmpPath)) {
          fs.unlinkSync(tmpPath);
        }

        return res.status(500).json({
          message: 'Gagal memproses upload',
          data: null
        });
      }
    }
  ];
}

module.exports = UploadMiddleware;