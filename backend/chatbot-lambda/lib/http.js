/**
 * Tiny HTTPS POST/GET helper — no SDK dependency.
 * Returns { status, headers, body } with body parsed as JSON when possible.
 */
const https = require('https');
const { URL } = require('url');

function request(method, urlStr, opts) {
  opts = opts || {};
  return new Promise(function(resolve, reject) {
    const u = new URL(urlStr);
    const isJson = opts.body && typeof opts.body !== 'string';
    const body = isJson ? JSON.stringify(opts.body) : (opts.body || '');
    const headers = Object.assign({}, opts.headers || {});
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body);
      if (isJson && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }
    const req = https.request({
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: method,
      headers: headers,
      timeout: opts.timeout || 10000
    }, function(res) {
      let chunks = '';
      res.on('data', function(d) { chunks += d.toString(); });
      res.on('end', function() {
        let parsed = chunks;
        try { parsed = JSON.parse(chunks); } catch (e) { /* keep as string */ }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: chunks });
      });
    });
    req.on('error', reject);
    req.on('timeout', function() { req.destroy(new Error('timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

module.exports = {
  post: function(url, opts) { return request('POST', url, opts); },
  get:  function(url, opts) { return request('GET',  url, opts); },
  patch:function(url, opts) { return request('PATCH',url, opts); }
};
