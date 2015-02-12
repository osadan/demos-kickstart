var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('connect',function(){
	connect.server({
		root : 'public/',
		livereload : true,
	});
});

gulp.task('reload',function(){
	gulp.src(['public/**/*','public/*'])
    	.pipe(connect.reload());
});

gulp.task('watch',function(){
	gulp.watch(['public/**/*','public/*'],['reload']);
});



gulp.task('default',['connect','watch']);	