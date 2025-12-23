import http from 'http';

const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

server.listen(8888, '0.0.0.0', () => {
    console.log('Test server listening on port 8888');
    console.log(`Process ID: ${process.pid}`);
    setInterval(() => console.log('Still running...'), 5000);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});

server.on('clientError', (err) => {
    console.error('Client error:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
