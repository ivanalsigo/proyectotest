const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos (HTML, CSS, JS) desde la raíz
app.use(express.static('.'));

// Cualquier ruta que no sea un archivo debe devolver el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor de la encuesta ejecutándose en puerto ${port}`);
});
