// Проверяет с какого устройства зашли в приложение
let ua = window.navigator.userAgent;
let msie = ua.indexOf("MSIE ");
let isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	},
};
function isIE() {
	ua = navigator.userAgent;
	let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}
if (isIE()) {
	document.querySelector("html").classList.add("ie");
}
if (isMobile.any()) {
	document.querySelector("html").classList.add("_touch");
}
//================================

// Получить цифры из строки
//parseInt(itemContactpagePhone.replace(/[^\d]/g, ''))

// Проверяет может-ли браузер отобразить формат webp - если может  то добавляет в тег body класс ._webp
function testWebP(callback) {
	let webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src =
		"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector("html").classList.add("_webp");
	} else {
		document.querySelector("html").classList.add("_no-webp");
	}
});
//============================
