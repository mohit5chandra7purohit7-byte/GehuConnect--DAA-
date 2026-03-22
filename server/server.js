// ============================================================
//  server.js — Mini Calculator Backend (Node.js)
//
//  CONCEPTS USED HERE:
//    - HTTP Server  : listens for requests from the browser
//    - API          : this whole file IS the API
//    - Endpoint     : a URL the frontend calls  e.g. /calculate
//    - GET request  : browser sends numbers, server reads them
//    - JSON         : format used to send data back to browser
//
//  HOW TO RUN:
//    node server.js
//  Then open http://localhost:3000 in browser
// ============================================================

// Node.js built-in module — no install needed
const http = require('http');
const fs   = require('fs');
const url  = require('url');
const path = require('path');

const PORT = 3000;

// ============================================================
//  CREATE THE SERVER
//  Every time browser makes a request, this function runs
// ============================================================
const server = http.createServer((req, res) => {

    // ---- ENDPOINT 1: Serve the HTML page ----
    // When browser visits http://localhost:3000
    // Send back the index.html file
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        const html     = fs.readFileSync(filePath, 'utf8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    // ---- Serve the CSS file ----
    if (req.url === '/style.css') {
        const filePath = path.join(__dirname, 'style.css');
        const css      = fs.readFileSync(filePath, 'utf8');

        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);
        return;
    }

    // ---- ENDPOINT 2: /calculate  ← THIS IS THE MAIN API ----
    // Browser sends:  /calculate?a=5&b=3&op=add
    // Server reads a, b, op → calculates → sends JSON back
    if (req.url.startsWith('/calculate')) {

        // Parse the URL to extract query parameters
        const parsed = url.parse(req.url, true);   // true = parse query string
        const a      = Number(parsed.query.a);      // first number
        const b      = Number(parsed.query.b);      // second number
        const op     = parsed.query.op;             // operation: add/sub/mul/div

        // ---- Validation ----
        if (isNaN(a) || isNaN(b)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Please enter valid numbers' }));
            return;
        }

        // ---- CALCULATION (this is the "backend logic" part) ----
        let result;
        let symbol;

        if      (op === 'add') { result = a + b; symbol = '+'; }
        else if (op === 'sub') { result = a - b; symbol = '-'; }
        else if (op === 'mul') { result = a * b; symbol = '×'; }
        else if (op === 'div') {
            if (b === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cannot divide by zero!' }));
                return;
            }
            result = a / b;
            symbol = '÷';
        }
        else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unknown operation' }));
            return;
        }

        // ---- Send JSON response back to browser ----
        // This is what fetch() in index.html receives
        const response = {
            a:      a,
            b:      b,
            op:     symbol,
            result: parseFloat(result.toFixed(6))   // round to 6 decimal places
        };

        // Allow CORS (lets the browser fetch from this server)
        res.writeHead(200, {
            'Content-Type':                'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(response));

        // Log to terminal so you can see requests coming in
        console.log(`[REQUEST] ${a} ${symbol} ${b} = ${response.result}`);
        return;
    }

    // ---- 404 — page not found ----
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

// ============================================================
//  START LISTENING
// ============================================================
server.listen(PORT, () => {
    console.log('===========================================');
    console.log(` Server running!`);
    console.log(` Open this in your browser:`);
    console.log(` http://localhost:${PORT}`);
    console.log('===========================================');
    console.log(' Waiting for requests...\n');
});
