const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const newer = require("gulp-newer");
const webp = require("imagemin-webp");
const webpcss = require("gulp-webpcss");
const webphtml = require("gulp-webp-html");
const group_media = require("gulp-group-css-media-queries");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const clean_css = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const fileinclude = require("gulp-file-include");
const rename = require("gulp-rename");
const fs = require("fs");
const del = require("del");
const plumber = require("gulp-plumber");
const fonter = require("gulp-fonter");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

// Прописываем пути к папкам
const project_name = require("path").basename(__dirname);
const src_folder = "#src";
const path = {
	src: {
		favicon: `${src_folder}/img/favicon.{jpg,png,svg,gif,ico,webp}`,
		html: [
			`${src_folder}/html/connect/*.{html,php}`,
			`!${src_folder}/html/**/_*.{html,php}`,
		],
		js: `${src_folder}/js/connect/*.js`,
		css: [
			`${src_folder}/scss/connect/*.scss`,
			`!${src_folder}/scss/connect/mixins.scss`,
		],
		images: [
			`${src_folder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
			`!**/favicon.*`,
		],
		php_include: `${src_folder}/html/php/*.php`,
		fonts: `${src_folder}/fonts/*.ttf`,
		fontsDir: `${src_folder}/fonts/`,
		json: `${src_folder}/json/**/*.*`,
		linkCss: `${src_folder}/html/connect/_headLink.html`,
		linkJs: `${src_folder}/html/connect/_js.html`,
		linkFontCss: `${src_folder}/scss/connect/fonts.scss`,
	},
	watch: {
		html: `${src_folder}/html/connect/*.{html,php}`,
		js: `${src_folder}/js/connect/**/*.js`,
		linkJs: `${src_folder}/js/**/*.js`,
		css: `${src_folder}/scss/connect/**/*.scss`,
		linkCss: `${src_folder}/scss/**/*.scss`,
		php_include: `${src_folder}/html/php/*.php`,
		images: `${src_folder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
		json: `${src_folder}/json/**/*.*`,
	},
	dev: {
		html: `${project_name}_dev/`,
		js: `${project_name}_dev/js/`,
		css: `${project_name}_dev/css/`,
		php_include: `${project_name}_dev/php/`,
		images: `${project_name}_dev/img/`,
		fonts: `${project_name}_dev/fonts/`,
		json: `${project_name}_dev/json/`,
	},
	build: {
		html: `${project_name}_It/`,
		js: `${project_name}_It/js/`,
		css: `${project_name}_It/css/`,
		php_include: `${project_name}_It/php/`,
		images: `${project_name}_It/img/`,
		fonts: `${project_name}_It/fonts/`,
		json: `${project_name}_It/json/`,
	},
};

function browsersync() {
	browserSync.init({
		// Инициализация Browsersync
		server: { baseDir: `./${project_name}_dev/` }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
	});
}
function browsersyncBuild() {
	browserSync.init({
		// Инициализация Browsersync
		server: { baseDir: `./${project_name}_It/` }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
	});
}
// HTML сборка====================
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.on("error", function (err) {
			console.error("ErrorSrcHtml!", err.message);
		})
		.pipe(dest(path.dev.html))
		.pipe(browserSync.stream());
}
function htmlBuild() {
	return src(`${path.dev.html}/*.{html,php}`)
		.pipe(plumber())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}
// </HTML> ====================

// PHP работа с php через GULP ===================

function php_include() {
	return src(path.src.php_include).pipe(dest(path.dev.php_include));
}
// </PHP> ====================

// CSS сборка====================
function styleCss() {
	return src(path.src.css)
		.pipe(sass({ outputStyle: "expanded" }).on("ErrorSrcCSS", sass.logError))
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.dev.css))
		.pipe(browserSync.stream());
}
function styleCssBuild() {
	return src(path.src.css)
		.pipe(plumber())
		.pipe(sass({ outputStyle: "expanded" }).on("ErrorSrcCSS", sass.logError))
		.pipe(
			rename({
				extname: ".css",
			})
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 10 versions"],
				cascade: true,
			})
		)
		.pipe(
			webpcss({
				webpClass: "._webp",
				noWebpClass: "._no-webp",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(clean_css())
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
}
function linkCssAddHtml() {
	fs.truncate(path.src.linkCss, err => {
		if (err) {
			console.log("не удалось очистить файл _headLink");
		} else console.log("file _headLink.html очищен ");
	});
	let fileLinkCss = fs.readdirSync(path.dev.css);
	fileLinkCss.forEach(file => {
		fs.appendFile(
			path.src.linkCss,
			`<link rel="stylesheet" href="css/${file}"/>\n\t`,
			function (error) {
				if (error) throw error; // если возникла ошибка
				console.log(`Ссылка ${file} передана.`);
			}
		);
	});

	return src(path.src.html).pipe(browserSync.stream());
}
// </CSS> ====================

// <JS сборка>====================
function js() {
	return src(path.src.js)
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.dev.js))
		.pipe(browserSync.stream());
}
function jsBuild() {
	return src(path.src.js)
		.pipe(plumber())
		.pipe(
			rename({
				extname: ".js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}
function linkJsAddHtml() {
	fs.truncate(path.src.linkJs, err => {
		if (err) {
			console.log("не удалось очистить файл _js.html");
		} else console.log("file _js.html очищен ");
	});
	let fileJsHTML = fs.readdirSync(path.dev.js);
	fileJsHTML.forEach(file => {
		fs.appendFile(
			path.src.linkJs,
			`<script src="js/${file}"></script>\n\t\t`,
			function (error) {
				if (error) throw error; // если возникла ошибка
				console.log(`Ссылка ${file} передана.`);
			}
		);
	});

	return src(path.src.html).pipe(browserSync.stream());
}
// </JS> ====================

// Очистка папки ===========
function clean() {
	return del(`./${project_name}_dev/`);
}
function cleanBuild() {
	return del(`./${project_name}_It/`);
}
// </Очистка папки> ===========

// Font сборка====================
function fonts_otf() {
	return src(`./${src_folder}/fonts/*.otf`)
		.pipe(plumber())
		.pipe(
			fonter({
				formats: ["ttf"],
			})
		)
		.pipe(dest(`./${src_folder}/fonts/`));
}
function fonts() {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.dev.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.dev.fonts))
		.pipe(browserSync.stream());
}
function fontStyle() {
	fs.truncate(path.src.linkFontCss, err => {
		if (err) {
			console.log("не удалось очистить файл fonts.scss");
		} else console.log("fonts.scss очищен ");
	});
	let fileFont = fs.readdirSync(path.src.fontsDir);
	fs.appendFile(
		path.src.linkFontCss,
		`@import "mixins";\r\n`,
		function (error) {
			if (error) throw error; // если возникла ошибка
			console.log(`@import mixins передан`);
		}
	);
	fileFont.forEach(file => {
		let fontName = file.split(".");
		fontName = fontName[0];
		fs.appendFile(
			path.src.linkFontCss,
			`@include font("${fontName}","${fontName}", "400", "normal");\r\n`,
			function (error) {
				if (error) throw error; // если возникла ошибка
				console.log(`Шрифт ${fontName} записан.`);
			}
		);
	});
	return src(path.src.html).pipe(browserSync.stream());
}
// </Font> ====================

// Json сборка====================
function json() {
	return src(path.src.json)
		.pipe(dest(path.dev.json))
		.pipe(browserSync.stream());
}
// </Json> ====================

// Images сборка====================
function images() {
	return src(path.src.images)
		.pipe(newer(path.dev.images))
		.pipe(dest(path.dev.images));
}
function imagesBuild() {
	return src(`${path.dev.images}/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`)
		.pipe(imagemin([webp({ quality: 85 })]))
		.pipe(rename({ extname: ".webp" }))
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3, // 0 to 7
			})
		)
		.pipe(dest(path.build.images));
}
function favicon() {
	return src(path.src.favicon)
		.pipe(plumber())
		.pipe(
			rename({
				extname: ".ico",
			})
		)
		.pipe(dest(path.dev.html));
}
// </Images> ================

function copyFoldersInBuild() {
	return src(
		[
			`${path.dev.html}/**/*.ico`,
			`${path.dev.fonts}/**/*.{woff,woff2}`,
			`${path.dev.php_include}/**/*.php`,
			`${path.dev.json}/**/*.json`,
		],
		{ base: `${project_name}_dev` }
	).pipe(dest(path.build.html));
}

// Наблюдатель =============
function watchFilesHTML() {
	watch([path.watch.html], html);
	watch([path.watch.php_include], php_include);
	watch([path.watch.css], styleCss);
	watch([path.watch.linkCss], linkCssAddHtml);
	watch([path.watch.js], js);
	watch([path.watch.linkJs], linkJsAddHtml);
	watch([path.watch.json], json);
	watch([path.watch.images], images);
}

// </Наблюдатель> =============
// Сценарии ================
exports.build = series(
	cleanBuild,
	parallel(
		copyFoldersInBuild,
		imagesBuild,
		jsBuild,
		styleCssBuild,
		htmlBuild,
		browsersyncBuild
	)
);
exports.default = series(
	clean,
	fonts_otf,
	fonts,
	fontStyle,
	json,
	js,
	linkJsAddHtml,
	styleCss,
	linkCssAddHtml,
	favicon,
	images,
	php_include,
	html,
	parallel(browsersync, watchFilesHTML)
);
// </Сценарии> ================
