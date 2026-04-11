const http = require('http');

console.log("Starting backend connection test from host...");

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/user-service/auth/login',
    method: 'OPTIONS', // Testing CORS preflight
    headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
    
    if (res.statusCode === 403 || res.headers['access-control-allow-origin'] == null) {
        console.log("❌ CORS FAILURE DETECTED ON PREFLIGHT!");
    } else {
        console.log("✅ CORS PASSED!");
    }

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`❌ NETWORK LAYER ERROR: ${e.message}`);
    console.log("This proves the backend is completely down or Windows is blocking port 8080.");
});

req.end();
