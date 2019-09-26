"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const querystring_1 = require("querystring");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminUsername = core.getInput('admin-username', { required: true });
        const adminPassword = core.getInput('admin-password', { required: true });
        const tokenUsername = core.getInput('token-username', { required: true });
        const url = core.getInput('url', { required: true });
        const testArgs = core.getInput('test-args');
        core.warning(testArgs);
        let requestor;
        if (url.startsWith('https://')) {
            requestor = https;
        }
        else if (url.startsWith('http://')) {
            requestor = http;
        }
        else {
            throw new Error('Invalid url');
        }
        const promise = new Promise((resolve, reject) => {
            const postData = querystring_1.stringify({
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
                const contentType = res.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                }
                else if (!/^application\/json/.test(contentType)) {
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
                    }
                    catch (e) {
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
        yield promise;
    });
}
run();
