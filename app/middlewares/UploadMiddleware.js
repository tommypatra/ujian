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
            const target = typeof folder === 'function'
                ? folder(req)
                : folder;

            fs.mkdirSync(target, { recursive: true });
            cb(null, target);
        },

        filename(req, file, cb) {
            const raw =
                formatDateYYMMDDHHmmss() +
                req.user.id +
                crypto.randomBytes(4).toString('hex');

            const name = crypto
                .createHash('sha1')
                .update(raw)
                .digest('hex')
                .slice(0, 32);

            cb(null, name);
        }
    });

    const upload = multer({
        storage,
        limits: { fileSize: maxSize }
    });

    return [

        /* =====================================================
         * 1. Middleware Multer + Error Handler
         * ===================================================== */
        (req, res, next) => {
            upload.single(fieldName)(req, res, function (err) {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(413).json({
                            message: `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)} MB`
                        });
                    }

                    return res.status(400).json({
                        message: err.message || 'Gagal upload file'
                    });
                }

                next();
            });
        },

        /* =====================================================
         * 2. Validasi File Asli (Magic Number)
         * ===================================================== */
        async (req, res, next) => {
            if (!req.file) return next();

            try {
                const tmpPath = req.file.path;
                const buffer = fs.readFileSync(tmpPath);
                const detected = await FileType.fromBuffer(buffer);

                if (!detected) {
                    fs.unlinkSync(tmpPath);
                    return res.status(400).json({
                        message: 'File tidak dikenali'
                    });
                }

                if (!allowed.includes(detected.ext)) {
                    fs.unlinkSync(tmpPath);
                    return res.status(400).json({
                        message: `File ${detected.ext} tidak diizinkan`
                    });
                }

                if (MIME_MAP[detected.ext] !== detected.mime) {
                    fs.unlinkSync(tmpPath);
                    return res.status(400).json({
                        message: 'Tipe file tidak valid'
                    });
                }

                const finalPath = `${tmpPath}.${detected.ext}`;
                fs.renameSync(tmpPath, finalPath);

                if (!fs.existsSync(finalPath)) {
                    return res.status(500).json({
                        message: 'Upload gagal, file tidak tersimpan'
                    });
                }

                if (!req.uploadedFiles) {
                    req.uploadedFiles = {};
                }

                const relativePath = finalPath.replace(/^storage\//, '');

                req.uploadedFiles[fieldName] = {
                    filename: path.basename(finalPath),
                    relative_path: relativePath,
                    ext: detected.ext,
                    mime: detected.mime,
                    size: req.file.size
                };

                next();

            } catch (err) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(500).json({
                    message: 'Gagal memproses upload'
                });
            }
        }
    ];
}

module.exports = UploadMiddleware;
