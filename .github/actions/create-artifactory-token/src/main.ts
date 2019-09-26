import * as core from '@actions/core';
import * as http from 'http';
import * as https from 'https';
import { stringify } from 'querystring';

async function run() {
    const adminUsername = core.getInput('admin-username', { required: true });
    const adminPassword = core.getInput('admin-password', { required: true });
    const tokenUsername = core.getInput('token-username', { required: true });
    const url = core.getInput('url', { required: true });

    const testArgs = core.getInput('test-args');
    core.warning(testArgs);

    let requestor;
    if (url.startsWith('https://')) {
        requestor = https;
    } else if (url.startsWith('http://')) {
        requestor = http;
    } else {
        throw new Error('Invalid url');
    }

    const promise = new Promise((resolve, reject) => {
        const postData = stringify({
            scope: 'member-of-groups:writers',
            username: tokenUsername,
        });
        const options = {
            auth: `${adminUsername}:${adminPassword}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
        };
        const req = requestor.request(`${url}/api/security/token`, options, res => {
            const { statusCode } = res;
            const contentType: any = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                core.error(error.message);
                core.setFailed(error.message);
                // Consume response data to free up memory
                res.resume();
                reject();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    core.setOutput('artifactory-token', parsedData.access_token);
                    resolve();
                } catch (e) {
                    core.error(e.message);
                    reject();
                }
            });
        }).on('error', (e) => {
            core.error(`Got error: ${e.message}`);
            reject();
        });
        req.write(postData);
        req.end();
    });

    await promise;
}

run();
