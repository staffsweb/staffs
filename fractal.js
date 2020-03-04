'use strict';

const path = require('path');
const fractal = module.exports = require('@frctl/fractal').create();
const twigAdapter = require('@frctl/twig');
const mandelbrot = require('@frctl/mandelbrot');


// Give it a name
fractal.set('project.title', 'Staffordshire University Components');

// Setup Twig Adapter
fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');

// Set the paths
fractal.components.set('path', __dirname + '/src/components');
fractal.docs.set('path', __dirname + '/src/docs');
fractal.web.set('static.path', __dirname + '/src/assets');
fractal.web.set('builder.dest', __dirname + '/static');

// Set the default status of components to Work In Progress, and add some custom
fractal.components.set('default.status', 'wip');

fractal.components.set('statuses', {
  prototype: {
    label: "Prototype",
    description: "Do not implement.",
    color: "#f33"
  },
  wip: {
    label: "WIP",
    description: "Work in progress. Reference with caution.",
    color: "#ff9233"
  },
  ready: {
    label: "Ready",
    description: "Component ready for use.",
    color: "#29cc29"
  }
});

// Set some placeholder copy
fractal.components.set('default.context', {
  'placeholderHeadline': 'Fighting poverty through volunteering',
  'placeholderHeadline2': 'From anger to action: How to stop 200,000 needless maternal deaths',
  'placeholderHeadline3': 'The deaf volunteer struggling for health equality',
  'placeholderHeadline4': 'Getting positive about HIV: busting myths with music',
  'placeholderPara1': 'At VSO, we believe progress is only possible when we work together. Partnerships lie at the root of all the positive change we create.',
  'placeholderPara2': 'Over the last 60 years VSO has worked in over 90 countries with more than 80,000 volunteers, and supported 50,000,000 people.',
  'placeholderPara3': 'Hundreds of VSO volunteers and supporters contact their representatives about international development issues. For example, in the build-up to Parliamentary debates on the 0.7% foreign aid expenditure target. They also strengthened VSO’s Women in Power campaign, fighting for women\'s empowerment.',
  'lorem': 'Lipsum has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  'loremLong': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  'loremShort': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  'pangram': 'The quick brown fox jumps over the lazy dog',
  main_menu: {
    "items": [
      {
        title: 'Title',
        link: '/'
      },
    ],
  },
});

// Customise the Fractal theme
const myCustomisedTheme = mandelbrot({
  "skin": 'white',
  "nav": ["docs", "components"],
  "panels": ["html", "view", "resources", "info", "notes"]
});
fractal.web.theme(myCustomisedTheme);

// Settings for dev server
fractal.web.set('server.sync', true);
fractal.web.set('server.syncOptions', {
  open: 'local'
});