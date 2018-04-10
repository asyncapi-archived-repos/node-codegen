const parse = require('./parser');
const generate = require('./generator');
const beautify = require('./beautifier');
const codegen = module.exports = {};

codegen.process = async (filePath, targetDir, customTemplateDir) => {
  const json = await parse(filePath);
  const asyncapi = beautify(json);
  const templatesDir = customTemplateDir ? '../' + customTemplateDir : '../templates';

  await generate.package(asyncapi, targetDir, templatesDir);
  await generate.APIindex(asyncapi, targetDir, templatesDir);
  await generate.adapters(asyncapi, targetDir, templatesDir);
  await generate.topics(asyncapi, targetDir, templatesDir);
  await generate.config(asyncapi, targetDir, templatesDir);
  await generate.readme(asyncapi, targetDir, templatesDir);
  await generate.static(targetDir, templatesDir);

};
