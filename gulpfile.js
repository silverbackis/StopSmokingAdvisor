var gulp = require('gulp'),
    rev = require('gulp-rev'),
    rev_del = require('rev-del'),
    debug = require('gulp-debug');

var manifest_folder = './src/AppBundle/Resources/assets',
manifest_file = 'rev-manifest.json',
manifest_path = manifest_folder + '/' + manifest_file,
watch_files = manifest_folder + '/assetic/**/*.+(js|css|png|jpg|jpeg)',
public_dir = './web/',
rev_dest_prefix = 'static/';

gulp.task('revisions', function(){
  return gulp.src(watch_files, { allowEmpty:true })
    .pipe( debug({title: 'assetic resource'}) )
    .pipe( rev() )
    .pipe( gulp.dest(public_dir + rev_dest_prefix) )
    .pipe( debug({title: 'rev file created'}) )
    .pipe( rev.manifest(manifest_file, {
      transformer: {
        stringify: function(obj) {
          Object.keys(obj).forEach(function(key) {
            //update value
            obj[key] = rev_dest_prefix + obj[key];
          });
          return JSON.stringify(obj, null, '\t');
        }
      }
    }) )
    .pipe( rev_del({ dest: public_dir, oldManifest: manifest_path }) )
    .pipe( gulp.dest(manifest_folder) );
});

gulp.task('watch', function(){
  gulp.watch(watch_files, gulp.series('revisions'));
});

gulp.task('default', gulp.series('revisions'));
