'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


function main() {
    const options = read_options_from_example();
    const values = read_values_from_env(options);

    write_values_to_dotenv(values);
}

function get_example_path() {
    return path.resolve(__dirname, '../.env.example');
}

function get_dotenv_path() {
    return path.resolve(__dirname, '../.env');
}

function read_options_from_example() {
    const cfg = dotenv.config({ path: get_example_path() });

    const ret = [];
    for (let option in cfg.parsed) {
        ret.push(option);
    }

    return ret;
}

function read_values_from_env(options) {
    const ret = {};
    for (let i = 0; i < options.length; ++i) {
        if (process.env[options[i]]) {
            ret[options[i]] = process.env[options[i]];
        }
    }

    return ret;
}

function write_values_to_dotenv(values) {
    const fd = fs.openSync(get_dotenv_path(), 'a');

    for (let option in values) {
        fs.appendFileSync(fd, `${option}=${values[option]}\n`);
    }

    fs.closeSync(fd);
}

main();
