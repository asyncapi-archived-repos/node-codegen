const parse = require('./parser');
const generate = require('./generator');
const beautify = require('./beautifier');
const codegen = module.exports = {};

codegen.process = async (filePath, targetDir) => {
  const json = await parse(filePath);
  const asyncapi = beautify(json);

  await generate.package(asyncapi, targetDir);
  await generate.APIindex(asyncapi, targetDir);
  await generate.adapters(asyncapi, targetDir);
  await generate.topics(asyncapi, targetDir);
  await generate.config(asyncapi, targetDir);
  await generate.scripts(asyncapi, targetDir);
  await generate.readme(asyncapi, targetDir);
  await generate.static(targetDir);
};
