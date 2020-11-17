module.exports = function () {
	$.gulp.task('watch', function () {
		$.gulp.watch('src/**/*.html', $.gulp.series('html'));
		$.gulp.watch('src/scss/**/*.scss', $.gulp.series('sass'));
		$.gulp.watch('src/fonts/*.*', $.gulp.series('fonts'));
		$.gulp.watch('src/img/*.*', $.gulp.series('img'));
		$.gulp.watch('src/js/main.js', $.gulp.series('scripts'));
	});
}