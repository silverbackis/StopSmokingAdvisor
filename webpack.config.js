var Encore = require('@symfony/webpack-encore');

Encore
// directory where compiled assets will be stored
  .setOutputPath('web/build/')
  // public path used by the web server to access the output path
  .setPublicPath('/build')
  // only needed for CDN's or sub-directory deploy
  //.setManifestKeyPrefix('build/')

  // uncomment if you're having problems with a jQuery plugin
  .autoProvidejQuery()

  /*
   * ENTRY CONFIG
   *
   * Add 1 entry for each "page" of your app
   * (including one that's included on every page - e.g. "app")
   *
   * Each entry will result in one JavaScript file (e.g. app.js)
   * and one CSS file (e.g. app.css) if you JavaScript imports CSS.
   */
  // .addEntry('app', ['babel-polyfill', './src/AppBundle/Resources/assets/global/index.js'])
  .addEntry('app', './src/AppBundle/Resources/assets/global/index.js')
  .addEntry('home', './src/AppBundle/Resources/assets/local/js/home/index.js')
  .addEntry('terms', './src/AppBundle/Resources/assets/local/js/terms.js')
  .addEntry('admin', './src/AppBundle/Resources/assets/local/js/admin.js')
  .addEntry('dashboard', './src/AppBundle/Resources/assets/local/js/dashboard.js')
  .addEntry('settings', './src/AppBundle/Resources/assets/local/js/settings.js')
  .addEntry('session', './src/AppBundle/Resources/assets/local/js/session.js')

  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(Encore.isProduction())

  // uncomment if you use Sass/SCSS files
  .enableSassLoader()
;

module.exports = Encore.getWebpackConfig();
