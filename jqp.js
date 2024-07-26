import * as https from 'https';
import * as querystring from 'querystring';

export const $ = {};

$.get = function(url, data, dataType) {
    // Handle optional data parameter
    if (typeof data === 'string') {
        dataType = data;
        data = undefined;
    }

    // Append query string if data is provided
    if (data) {
        url += '?' + querystring.stringify(data);
    }

    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                if (dataType === 'json') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        reject(new Error('Failed to parse JSON response'));
                        return;
                    }
                }
                resolve({ data, status: resp.statusCode, statusText: resp.statusMessage, headers: resp.headers });
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

$.post = function(url, data, dataType) {
    // Handle optional data parameter
    if (typeof data === 'string') {
        dataType = data;
        data = undefined;
    }

    const postData = data ? querystring.stringify(data) : '';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                if (dataType === 'json') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        reject(new Error('Failed to parse JSON response'));
                        return;
                    }
                }
                resolve({ data, status: resp.statusCode, statusText: resp.statusMessage, headers: resp.headers });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        // Write data to request body
        req.write(postData);
        req.end();
    });
};
