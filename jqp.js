import * as https from 'https';
import * as querystring from 'querystring';

function parseResponse(resp, body) {
    const contentType = resp.headers['content-type'];
    if (contentType && contentType.includes('/json')) {
        try {
            return JSON.parse(body);
        } catch (e) {
            throw new Error('Failed to parse JSON response');
        }
    }
    return body;
}

function handleResponse(resolve, reject, resp) {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const parsedData = parseResponse(resp, data);
            if (resp.statusCode >= 200 && resp.statusCode < 300) {
                resolve(parsedData);
            } else {
                reject({
                    data: parsedData,
                    status: resp.statusCode,
                    statusText: resp.statusMessage,
                    headers: resp.headers
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

export function get(url, data) {
    if (data) {
        url += '?' + querystring.stringify(data);
    }

    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            handleResponse(resolve, reject, resp);
        }).on("error", (err) => {
            reject(err);
        });
    });
}

export function post(url, data) {
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
            handleResponse(resolve, reject, resp);
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

export default { get, post };