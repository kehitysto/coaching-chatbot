'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


function main() {
    const options = readOptionsFromExample();
    const values = readValuesFromEnv(options);

    writeValuesToDotenv(values);
}

function getExamplePath() {
    return path.resolve(__dirname, '../.env.example');
}

function getDotenvPath() {
    return path.resolve(__dirname, '../.env');
}

function readOptionsFromExample() {
    const cfg = dotenv.config({ path: getExamplePath() });

    const ret = [];
    for (let option in cfg.parsed) {
        ret.push(option);
    }

    return ret;
}

function readValuesFromEnv(options) {
    const ret = {};
    for (let i = 0; i < options.length; ++i) {
        if (process.env[options[i]]) {
            ret[options[i]] = process.env[options[i]];
        }
    }

    return ret;
}

function writeValuesToDotenv(values) {
    const fpath = getDotenvPath();

    for (let option in values) {
        fs.appendFileSync(fpath, `${option}=${values[option]}\n`);
    }
}

main();
