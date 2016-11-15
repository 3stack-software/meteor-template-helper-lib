Package.describe({
  name: '3stack:template-helper-lib',
  version: '0.1.5',
  summary: 'A collection of template helpers (Logical, Classes, Dates).',
  git: 'https://github.com/3stack-software/meteor-template-helper-lib',
  documentation: 'README.md'
});

Package.onUse(function(api){
  api.versionsFrom('METEOR@1.2');
  api.export('HelperLib');
  api.use([
    'logging',
    'underscore',
    'blaze',
    'spacebars',
    'templating'
  ]);
  api.use('momentjs:moment@2.16.0', {weak: true});

  api.addFiles('helper-lib.js');
});

