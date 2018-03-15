'use strict';

module.exports = function* home() {
  const data = {
    name: 'framework-example_123456',
  };
  this.body = data.name;
};
