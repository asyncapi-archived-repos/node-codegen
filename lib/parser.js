const fs = require('fs');
const path = require('path');
const ZSchema = require('z-schema');
const loadJsonFile = require('load-json-file');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

const validator = new ZSchema();
const asyncAPIschema = path.resolve(__dirname, './schema/asyncapi.json');

async function getFileContent (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });
}

function parseContent (content) {
  content = content.toString('utf8');
  try {
    return JSON.parse(content);
  } catch (e) {
    return YAML.safeLoad(content);
  }
}

async function dereference (json) {
  return RefParser.dereference(json, {
    dereference: {
      circular: 'ignore'
    }
  });
}

async function validate (json, schema) {
  return new Promise((resolve, reject) => {
    validator.validate(json, schema, (err, valid) => {
      if (err) return reject(err);
      return resolve(json);
    });
  });
}

async function parse (filePath) {
  let schema, content, parsedContent, dereferencedJSON, parsed;

  try {
    schema = await loadJsonFile(asyncAPIschema);
  } catch (e) {
    console.error('Can not load the Async API schema file');
    console.error(e);
    return;
  }

  try {
    content = await getFileContent(filePath);
  } catch (e) {
    console.error('Can not load the content of the AsyncAPI specification file');
    console.error(e);
    return;
  }

  try {
    parsedContent = parseContent(content);
  } catch (e) {
    console.error('Can not parse the content of the AsyncAPI specification file');
    console.error(e);
    return;
  }

  try {
    dereferencedJSON = await dereference(parsedContent);
  } catch (e) {
    console.error('Can not dereference the JSON obtained from the content of the AsyncAPI specification file');
    console.error(e);
    return;
  }

  try {
    parsed = await validate(dereferencedJSON, schema);
  } catch (e) {
    console.error('Invalid JSON obtained from the content of the AsyncAPI specification file');
    console.error(e);
    return;
  }

  return parsed;
};

module.exports = parse;
