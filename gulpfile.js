const gulp = require('gulp')
const sass = require('gulp-sass')
const inject = require('gulp-inject-string')
const autoprefixer = require('gulp-autoprefixer')
const fs = require('fs')
const server = require('gulp-server-livereload')

gulp.task('sass', function () {
  return gulp.src('src/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
})

// gulp.task('html', function() {
//     return gulp.src('src/*.html')
//         .pipe(gulp.dest('dist'))
// })

gulp.task('resources', function () {
  return gulp.src('src/*.jpg')
        .pipe(gulp.dest('dist/resources'))
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.*', ['build'])
})

gulp.task('html', function () {
  const json = JSON.parse(fs.readFileSync('./src/data/resume.json'))
  let html = []
  const getListItemsForSection = (section) => {
    let html = []
    for (let i = 0; i < section.entries.length; i++) {
      const pre = section.entries[i].year ? `<p><small class="muted">${section.entries[i].year}</small></p>` : ''
      const post = section.entries[i].location ? `<p>${section.entries[i].location}</p>` : ''
      html.push(`<li><div>${pre}<p><em>${section.entries[i].label}</em></p>${post}</div></li>`)
    }
    return html
  }
  for (let i = 0; i < json.length; i++) {
    const section = json[i]
    const type = section.type ? ` class="${section.type}"` : ''
    const sectionHtml = ['<section>', `<h3>${section.section}</h3>`, `<ul${type}>`, ...getListItemsForSection(section), '</ul>', '</section>']
    html = html.concat(sectionHtml)
  }
  gulp.src('src/index.html')
        .pipe(inject.replace('<!-- resume -->', html.join('')))
        .pipe(gulp.dest('dist'))
})

gulp.task('open', function () {
  gulp.src('dist/index.html').pipe(open())
})

gulp.task('webserver', function () {
  gulp.src('dist')
    .pipe(server({
      livereload: true,
      open: true
    }))
})

gulp.task('build', ['sass', 'html', 'resources'])

gulp.task('default', ['build', 'webserver', 'watch'])
