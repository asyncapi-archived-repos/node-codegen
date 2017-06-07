const fs = require('fs');
const path = require('path');
const util = require('util');
const Handlebars = require('handlebars');
const helpers = require('./helpers/handlebars');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const generate = module.exports = {};

generate.package = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/package.json'), 'utf8', (err, data) => {
    if (err) throw err;

    const targetFile = path.resolve(targetDir, 'package.json');
    const template = Handlebars.compile(data.toString());
    const content = template({ asyncapi });

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err;
      });
    });
  });
};

generate.APIindex = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/index.js'), 'utf8', (err, data) => {
    if (err) throw err;

    const targetFile = path.resolve(targetDir, 'src/api/', 'index.js');
    const template = Handlebars.compile(data.toString());
    const content = template({ asyncapi });

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err;
      });
    });
  });
};

generate.adapters = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/adapters/___adapter.js'), 'utf8', (err, data) => {
    if (err) throw err;

    asyncapi.schemes.map(adapter => {
      const targetFile = path.resolve(targetDir, 'src/api/adapters/', `${adapter}.js`);
      const template = Handlebars.compile(data.toString());
      const content = template({ asyncapi, adapter });

      mkdirp(path.dirname(targetFile), err => {
        if (err) return console.error(err);

        fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

generate.topics = async (asyncapi, targetDir) => {
  await generate.routes({asyncapi, targetDir});
  await generate.services({asyncapi, targetDir});
};

generate.routes = async ({asyncapi, targetDir}) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/routes/___route.js'), 'utf8', (err, data) => {
    if (err) throw err;

    asyncapi.__services.map(service => {
      const targetFile = path.resolve(targetDir, 'src/api/routes/', `${service}.js`);
      const template = Handlebars.compile(data.toString());
      const content = template({ asyncapi, service });

      mkdirp(path.dirname(targetFile), err => {
        if (err) return console.error(err);

        fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

generate.services = async ({asyncapi, targetDir}) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/services/___service.js'), 'utf8', (err, data) => {
    if (err) throw err;

    asyncapi.__services.map(service => {
      const targetFile = path.resolve(targetDir, 'src/api/services/', `${service}.js`);
      const template = Handlebars.compile(data.toString());
      const content = template({ asyncapi, service });

      mkdirp(path.dirname(targetFile), err => {
        if (err) return console.error(err);

        fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

generate.config = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/config/common.yml'), 'utf8', (err, data) => {
    if (err) throw err;

    const targetFile = path.resolve(targetDir, 'config/common.yml');
    const template = Handlebars.compile(data.toString());
    const content = template({ asyncapi });

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err;
      });
    });
  });
};

generate.scripts = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/scripts/deploy.sh'), 'utf8', (err, data) => {
    if (err) throw err;

    const targetFile = path.resolve(targetDir, 'scripts/deploy.sh');
    const template = Handlebars.compile(data.toString());
    const content = template({ asyncapi });

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err;
      });
    });
  });
};

generate.readme = async (asyncapi, targetDir) => {
  fs.readFile(path.resolve(__dirname, '../templates/README.md'), 'utf8', (err, data) => {
    if (err) throw err;

    const targetFile = path.resolve(targetDir, 'README.md');
    const template = Handlebars.compile(data.toString());
    const content = template({ asyncapi });

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.writeFile(targetFile, content, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err;
      });
    });
  });
};

generate.static = async (targetDir) => {
  const files = [
    '.editorconfig',
    '.eslintrc',
    '__.gitignore',
    'circle.yml',
    'Dockerfile',
    'src/lib/config.js',
    'src/api/middlewares/json2string.js',
    'src/api/middlewares/logger.js',
    'src/api/middlewares/buffer2string.js'
  ];

  files.map(file => {
    const targetFile = path.resolve(targetDir, file.substr(0, 2) === '__' ? file.substr(2) : file);

    mkdirp(path.dirname(targetFile), err => {
      if (err) return console.error(err);

      fs.createReadStream(path.resolve(__dirname, '../templates/', file))
        .pipe(fs.createWriteStream(targetFile));
    });
  });
};
