module.exports = function () {
	$.gulp.task('sass', function () {
		return $.gulp.src('src/scss/main.scss')
				.pipe($.gp.sourcemaps.init())
				.pipe($.gp.sassGlob())
				.pipe($.gp.sass())
				.pipe($.gp.autoprefixer({
					browsers: ['last 10 versions']
				}))
				.on('error', $.gp.notify.onError({
					title: 'Error !'
				}))
				.pipe($.gp.csso())
				.pipe($.gp.sourcemaps.write())
				.pipe($.gulp.dest('build/css'))
				.pipe($.bs.reload({
					stream: true
				}));
	});
}