import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Get network IP - use Wi-Fi adapter IP (192.168.254.x range)
function getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.254')) {
                return iface.address;
            }
        }
    }
    // Fallback: try any non-local IPv4
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254')) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0'; // Last resort - bind to all interfaces
}

const HOST = '0.0.0.0'; // Bind to all interfaces (localhost + network)

// Middleware to proxy API calls to backend
app.use('/api', (req, res) => {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.pipe(proxyReq);

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(502).json({ error: 'Bad Gateway' });
    });
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
    console.log(`✓ Frontend server listening on ${HOST}:${PORT}`);
    console.log(`  Local:   http://localhost:${PORT}/`);
    console.log(`  API:     http://localhost:5000/api`);
    console.log(`  PID: ${process.pid}`);
});

server.on('listening', () => {
    console.log('Server is actively listening on port', PORT);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
        const altServer = app.listen(PORT + 1, HOST, () => {
            console.log(`✓ Server listening on ${HOST}:${PORT + 1}`);
        });
    } else {
        console.error('Server error:', err);
        console.error('Stack trace:', err.stack);
        process.exit(1);
    }
});


