const _ = require('lodash');
const Handlebars = require('handlebars');

Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper equal needs 2 parameters');
  if (lvalue!==rvalue) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('validOperation', (operation, options) => {
  const authorized_operations = ['PUBLISH', 'SUBSCRIBE'];

  if (arguments.length < 3)
    throw new Error('Handlebars Helper validOperation needs 1 parameter');
  if (!authorized_operations.includes(operation.toUpperCase())) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('match', (lvalue, rvalue, options) => {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper match needs 2 parameters');
  if (!lvalue.match(rvalue)) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('compare', (lvalue, operator, rvalue, options) => {
  if (arguments.length < 4) throw new Error('Handlerbars Helper "compare" needs 3 parameters');

  const operators = {
    '==': (l,r) => { return l == r; },
    '===': (l,r) => { return l === r; },
    '!=': (l,r) => { return l != r; },
    '<': (l,r) => { return l < r; },
    '>': (l,r) => { return l > r; },
    '<=': (l,r) => { return l <= r; },
    '>=': (l,r) => { return l >= r; },
    typeof: (l,r) => { return typeof l === r; }
  };

  if (!operators[operator]) throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
  const result = operators[operator](lvalue,rvalue);

  if (result) return options.fn(this);

  return options.inverse(this);
});

Handlebars.registerHelper('capitalize', (str) => {
  return _.capitalize(str);
});

Handlebars.registerHelper('toMQTT', (str) => {
  return String(str).split('.').join('/');
});

Handlebars.registerHelper('snakecase', (str) => {
  return _.snakeCase(String(str).toLowerCase());
});

Handlebars.registerHelper('kebabcase', (str) => {
  return _.kebabCase(String(str).toLowerCase());
});

Handlebars.registerHelper('queueName', (title, version) => {
  return _.kebabCase(`${title}-${version}`.toLowerCase()).split('-').join('.');
});

Handlebars.registerHelper('shouldSubscribe', (asyncapi) => {
  return asyncapi.__usedOperations.includes('subscribe');
});

Handlebars.registerHelper('docline', (field, fieldName, scopePropName) => {
  const buildLine = (f, fName, pName) => {
    const type = f.type ? _.capitalize(f.type) : 'String';
    const description = f.description ? ` - ${f.description.replace(/\r?\n|\r/g, '')}` : '';
    let def = f.default;

    if (def && type === 'String') def = `'${def}'`;

    let line;
    if (def !== undefined) {
      line = ` * @param {${type}} [${pName ? `${pName}.` : ''}${fName}=${def}]`;
    } else {
      line = ` * @param {${type}} ${pName ? `${pName}.` : ''}${fName}`;
    }

    if (type === 'Object') {
      let lines = `${line}\n`;
      let first = true;
      for (const propName in f.properties) {
        lines = `${lines}${first ? '' : '\n'}${buildLine(f.properties[propName], propName, `${pName ? `${pName}.` : ''}${fName}`)}`;
        first = false;
      }
      return lines;
    }

    return `${line}${description}`;
  };

  return buildLine(field, fieldName, scopePropName);
});

Handlebars.registerHelper('dotsToSlashes', (topicName) => {
  return topicName.replace(/\./g, '/');
});
