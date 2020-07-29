'use strict';


/*
*
*
*
*
*
* We now run Fractal via gulp, see gulpfile.babel.js
* This file is pending deletion when we're sure we don't need anything in it any more
*
*
*
*
*
* */








// -------------------------------------






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
fractal.web.set('builder.dest', __dirname + '/design-system');

// Set the default status of components to Work In Progress, and add some custom
fractal.components.set('default.status', 'wip');

fractal.components.set('statuses', {
  ready: {
    label: "Ready",
    description: "Component ready for use.",
    color: "#29cc29"
  },
  wip: {
    label: "WIP",
    description: "Work in progress. Reference with caution.",
    color: "#ff9233"
  },
  caution: {
    label: "Caution",
    description: "Deprecated, or to be deprecated, reference with extreme caution.",
    color: "#D70A26"
  },
  reference: {
    label: "Reference",
    description: "Documentation or reference purposes.",
    color: "#2999cc"
  }
});

// Set some placeholder copy
fractal.components.set('default.context', {
  'placeholderHeadline': 'Graduates give Staffs Uni star role in popular app',
  'placeholderHeadline2': 'Enjoying the View? How computer games can help evaluate landscapes',
  'placeholderHeadline3': '“It\'s Beautiful to be Old” Professor tells Vatican',
  'placeholderHeadline4': 'Research into poverty in Stoke-on-Trent gets new funding boost',
  'placeholderPara1': 'The founders of an immersive storytelling app have returned to their university stomping ground to film their latest episode.',
  'placeholderPara2': 'Staffordshire University is going global with a programme packed full of free events to start the new decade.',
  'placeholderPara3': '2020 marks the International Year of the Nurse and Midwife, and Staffordshire University is joining colleagues across the globe to shine a spotlight on the sector. Celebrations kick off with a talk this week by Visiting Professor Ann-Marie Cannaby, Chief Nurse at the Royal Wolverhampton Hospital, at the University’s Centre of Excellence in Healthcare Education, Stafford.Two hundred years may have passed since the birth of Florence Nightingale, but patient care and safety remain the most important influencing factors within the fields of nursing and midwifery. Professor Cannaby will use her keynote presentation to explore curriculum developments.',
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
  "panels": ["notes", "html", "view", "resources", "info"]
});
fractal.web.theme(myCustomisedTheme);

// Settings for dev server
fractal.web.set('server.sync', true);
fractal.web.set('server.syncOptions', {
  open: 'local'
});
