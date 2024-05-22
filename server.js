const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos
app.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

// Redireccionar al abrir el localhost a intro.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'intro.html'));
});

// Ruta para servir index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir AES.html
app.get('/AES.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'AES.html'));
});

// Ruta para servir RSA.html
app.get('/RSA.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'RSA.html'));
});

// Servir archivos estáticos en la carpeta 'public'
app.use(express.static(path.join(__dirname)));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
