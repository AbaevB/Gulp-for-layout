const {src, dest, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const image = require('gulp-image');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));

const paths = {
  styles: {
    src: './src/css/**/*.scss',
    dest: './dev/css'
  },
  html: {
    src: './src/**/*.html',
    dest: './dev'
  },
  svg: {
    src: './src/img/svg/**/*.svg',
    dest: './dev/img'
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dev/img'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dev/js'
  },
  resources: {
    src: './src/resources/**/*',
    dest: './dev'
  },
  // build
  stylesBuild:{
    src: './src/css/**/*.scss',
    dest: './build/css'
  },

  htmlBuild: {
    src: './src/**/*.html',
    dest: './build'
  },

  scriptsBuild: {
    src: 'src/js/**/*.js',
    dest: 'build/js'
  },

  svgBuild: {
    src: './src/img/svg/**/*.svg',
    dest: './dev/img'
  },

  resourcesBuild: {
    src: './src/resources/**/*',
    dest: './build'
  },
  imagesBuild: {
    src: 'src/img/**/*',
    dest: 'build/img'
  }

};

//dev

const clean = () => {
	return del(['dev'])
};

const resources = () => {
  return src(paths.resources.src)
    .pipe(dest(paths.resources.dest))
    .pipe(browserSync.stream());
};

const styles = () => {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
};

const html = () => {
	return src(paths.html.src)
		.pipe(dest(paths.html.dest))
		.pipe(browserSync.stream());
};

const scripts = () => {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
};

const svg = () => {
  return src(paths.svg.src)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(dest(paths.svg.dest))
    .pipe(browserSync.stream());
};

const images = () => {
  return src(paths.images.src)
    .pipe(dest(paths.images.dest))
    .pipe(browserSync.stream());
};

const watching = () => {
  browserSync.init({
    server: {
      baseDir: "./dev"
    },
  });

  watch(paths.styles.src, styles);
	watch(paths.html.src, html);
  watch(paths.scripts.src, scripts);
  watch(paths.resources.src, resources);
  watch(paths.images.src, images);
  watch(paths.svg.src, svg);
};


//build

const cleanBuild = () => {
	return del(['build'])
};

const resourcesBuild = () => {
  return src(paths.resourcesBuild.src)
    .pipe(dest(paths.resourcesBuild.dest))
    .pipe(browserSync.stream());
};

const stylesBuild = () => {
  return src(paths.stylesBuild.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest(paths.stylesBuild.dest))
    .pipe(browserSync.stream());
};

const htmlBuild = () => {
	return src(paths.htmlBuild.src)
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(paths.htmlBuild.dest))
		.pipe(browserSync.stream());
};

const scriptsBuild = () => {
  return src(paths.scriptsBuild.src)
		.pipe(babel({
			presets: ['@babel/env']
		}))
    .pipe(concat('main.js'))
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest(paths.scriptsBuild.dest))
    .pipe(browserSync.stream());
};

const svgBuild = () => {
  return src(paths.svgBuild.src)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(dest(paths.svgBuild.dest))
    .pipe(browserSync.stream());
};

const imagesBuild = () => {
  return src(paths.imagesBuild.src)
    .pipe(image())
    .pipe(dest(paths.imagesBuild.dest))
    .pipe(browserSync.stream());
};

const watchingBuild = () => {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
  });

  watch(paths.stylesBuild.src, stylesBuild);
	watch(paths.htmlBuild.src, htmlBuild);
  watch(paths.scriptsBuild.src, scriptsBuild);
  watch(paths.resourcesBuild.src, resourcesBuild);
  watch(paths.imagesBuild.src, imagesBuild);
  watch(paths.svgBuild.src, svgBuild);
};


//dev

exports.clean = clean;
exports.resources = resources;
exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.svg = svg;
exports.images = images;
exports.watching = watching;


//build

exports.cleanBuild = cleanBuild;
exports.resourcesBuild = resourcesBuild;
exports.stylesBuild = stylesBuild;
exports.htmlBuild = htmlBuild;
exports.scriptsBuild = scriptsBuild;
exports.svgBuild = svgBuild;
exports.imagesBuild = imagesBuild;
exports.watchingBuild = watchingBuild;

exports.dev = series(clean, resources, styles, html, scripts, svg, images, watching);
exports.build = series(cleanBuild, resourcesBuild, stylesBuild, htmlBuild, scriptsBuild, svgBuild, imagesBuild, watchingBuild);

