/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 * Override at the last minute with global.filterSystemConfig (as plunkers do)
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app': 'app', // 'dist',
    'rxjs': 'node_modules/rxjs',
    'symbol-observable': 'node_modules/symbol-observable',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    '@angular': 'node_modules/@angular',
    'moment': 'node_modules/moment/moment.js',
    'ng2-idle': 'node_modules/ng2-idle', 
    'ts': 'node_modules/plugin-typescript/plugin.js',
    'typescript': 'node_modules/typescript/lib/typescript.js'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': { main: 'main.js',  defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'moment': { defaultExtension: 'js' },    
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'node_modules/ng2-file-upload': { defaultExtension:'js'},
    'node_modules/ng2-table': { defaultExtension: 'js' },
    'ng2-idle': { defaultExtension: 'js' },  
    'symbol-observable': { main: 'index.js', defaultExtension: 'js' },
  };

  var paths = {
    'ng2-file-upload': 'node_modules/ng2-file-upload/ng2-file-upload',
    'ng2-table': 'node_modules/ng2-table/ng2-table'
  };

  var packageNames = [
       '@angular/common',
       '@angular/compiler',
       '@angular/core',
       '@angular/http',
       '@angular/platform-browser',
       '@angular/platform-browser-dynamic',
       '@angular/router',
       '@angular/router-deprecated',
       '@angular/testing',
       '@angular/upgrade',
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function (pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    transpiler: 'typescript',
    typescriptOptions: { emitDecoratorMetadata: true, tsconfig: true },
    map: map,
    packages: packages,
    paths:paths
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }


  System.config(config);

})(this);
