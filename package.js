Package.describe({
  name: '3stack:template-helper-lib',
  version: '0.0.1',
  summary: 'A collection of template helpers (Logical, Classes, Dates).',
  git: 'https://github.com/3stack-software/meteor-template-helper-lib',
  documentation: 'README.md'
});

/**
 * Created by nathan.muir on 9/2/14.
 */
Package.onUse(function(api){
  api.versionsFrom('METEOR@0.9.2');
  api.export('HelperLib');
  api.use([
    'underscore',
    'blaze',
    'spacebars',
    'templating'
  ]);
  api.use('momentjs:moment@2.9.0', {weak: true});

  api.addFiles('helper-lib.js');
});

