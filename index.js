'use strict';
var React = require('react');

var parseTag = require('./parse-tag');

module.exports = h;

function h(componentOrTag, properties, children) {
  // if only one argument which is an array, wrap items with React.Fragment
  if (arguments.length === 1 && Array.isArray(componentOrTag)) {
      return h(React.Fragment, null, componentOrTag);
  } else if (!children && isChildren(properties)) {
    // If a child array or text node are passed as the second argument, shift them
    children = properties;
    properties = {};
  } else if (arguments.length === 2) {
    // If no children were passed, we don't want to pass "undefined"
    // and potentially overwrite the `children` prop
    children = [];
  }

  properties = properties ? Object.assign({}, properties) : {};

  // When a selector, parse the tag name and fill out the properties object
  if (typeof componentOrTag === 'string') {
    componentOrTag = parseTag(componentOrTag, properties);
  }

  // Create the element
  var args = [componentOrTag, properties].concat(children);
  return React.createElement.apply(React, args);
}

function isChildren(x) {
  return typeof x === 'string' || typeof x === 'number' || Array.isArray(x);
}
