'use strict';
var console = require('console');
var ReactDOM = require('react-dom/server');
var test = require('tape');
var createReactClass = require('create-react-class');

var h = require('../');

var Component = createComponent();
var FunctionComponent = createFunctionComponent();

var renderTests = {
  'basic html tag': {
    dom: h('h1'),
    html: '<h1></h1>'
  },
  'tag with an id and classes in selector': {
    dom: h('h1#boom.whatever.foo'),
    html: '<h1 id="boom" class="whatever foo"></h1>'
  },
  'tag with an id and classes in selector and props': {
    dom: h('h1.foo', {className: 'bar'}),
    html: '<h1 class="foo bar"></h1>'
  },
  'tag with other properties': {
    dom: h('a', {href: 'http://www.google.com'}),
    html: '<a href="http://www.google.com"></a>'
  },
  'tag with string as third argument': {
    dom: h('h1', null, 'Hello World!'),
    html: '<h1>Hello World!</h1>'
  },
  'tag with string as second argument': {
    dom: h('h1', 'Hello World!'),
    html: '<h1>Hello World!</h1>'
  },
  'tag with number as second argument': {
    dom: h('h1', 5),
    html: '<h1>5</h1>'
  },
  'tag with number as third argument': {
    dom: h('h1', null, 5),
    html: '<h1>5</h1>'
  },
  'tag with `0` as second argument': {
    dom: h('h1', 0),
    html: '<h1>0</h1>'
  },
  'tag with children array as third argument': {
    dom: h('h1', null, [
      h('span'),
      h('span')
    ]),
    html: '<h1><span></span><span></span></h1>'
  },
  'tag with children array as second argument': {
    dom: h('h1', [
      h('span'),
      h('span')
    ]),
    html: '<h1><span></span><span></span></h1>'
  },
  'basic component': {
    dom: h(Component),
    html: '<div><h1></h1></div>'
  },
  'component with props and children': {
    dom: h(Component, {title: 'Hello World!'}, [
      h('span', 'A child')
    ]),
    html: '<div><h1>Hello World!</h1><span>A child</span></div>'
  },
  'component with children': {
    dom: h(Component, [
      h('span', 'A child')
    ]),
    html: '<div><h1></h1><span>A child</span></div>'
  },
  'component with children in props': {
    dom: h(Component, {children: [h('span', { key: 'any-key' }, 'A child')]}),
    html: '<div><h1></h1><span>A child</span></div>'
  },
  'function component with children': {
    dom: h(FunctionComponent, [h('span', 'A child')]),
    html: '<div class="a-class"><span>A child</span></div>'
  },
  'fragments': {
      dom: h([ h('li', 'first'), h('li', 'second'), h('li', 'third') ]),
      html: '<li>first</li><li>second</li><li>third</li>'
  }
};

test('Tags rendered with different arguments', function t(assert) {
  Object.keys(renderTests).forEach(function runRenderTest(name) {
    var dom;
    var data = renderTests[name];
    var messages = catchWarns(function makeDomString() {
      dom = getDOMString(data.dom);
    });

    assert.deepEqual(messages, [],
      '`' + name + '` does not log warnings');

    assert.equal(dom, data.html,
      '`' + name + '` renders correctly');
  });
  assert.end();
});

function createComponent() {
  return createReactClass({
    render: function render() {
      return (
        h('div', [
          h('h1', this.props.title),
          this.props.children
        ])
      );
    }
  });
}

function createFunctionComponent() {
  return function(props) {
    return (
      h('div.a-class', props)
    );
  }
}

function getDOMString(reactElement) {
  return ReactDOM.renderToStaticMarkup(reactElement);
}

function catchWarns(fn) {
  var messages = [];

  /* eslint-disable no-console */
  var originalWarn = console.warn;
  var originalError = console.error;
  console.warn = warn;
  console.error = warn;
  fn();
  console.warn = originalWarn;
  console.error = originalError;
  /* esline-enable no-console */

  return messages;

  function warn(message) {
    messages.push(message);
  }
}
