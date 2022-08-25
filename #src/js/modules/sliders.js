//Слайдер 1===================================================================================================================================

if (document.querySelector(".searchEstate__swiper")) {
	new Swiper(".searchEstate__swiper", {
		effect: "coverflow",
		centeredSlides: true,
		slidesPerView: "auto",
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 230,
			modifier: 1.1,
			slideShadows: true,
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		grabCursor: true,
		watchOverflow: true,
		speed: 2000,
		loop: true,
		loopAdditionalSliders: true,
		preloadImages: false,
		parallax: true,
		slideToClickedSlide: true,

		navigation: {
			nextEl: ".searchEstate__prev",
			prevEl: ".searchEstate__next",
		},
	});
}
//Слайдер 2===================================================================================================================================
if (document.querySelector(".slider-rooms__body")) {
	new Swiper(".slider-rooms__body", {
		slidesPerView: "auto",
		slideClass: "slider-rooms__image",
		wrapperClass: "slider-rooms__slide",
		spaceBetween: 24,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSliders: true,
		preloadImages: false,
		parallax: true,
		// Dotts точки
		pagination: {
			el: ".slider-rooms__dotts",
			clickable: true,
		},
		// Arrows стрелки
		navigation: {
			prevEl: ".slider-rooms .slider-arrow_prev",
			nextEl: ".slider-rooms .slider-arrow_next",
		},
	});
}
//Слайдер 3===================================================================================================================================
if (document.querySelector(".slider-tips__body")) {
	new Swiper(".slider-tips__body", {
		slidesPerView: "auto",
		slideClass: "slider-tips__slide",
		wrapperClass: "slider-tips__wrap",
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSliders: true,
		slidesPerView: 3,
		preloadImages: false,
		// parallax: true,
		// Dotts точки
		pagination: {
			el: ".slider-tips__dotts",
			clickable: true,
		},
		// Arrows стрелки
		navigation: {
			prevEl: ".slider-tips .slider-arrow_prev",
			nextEl: ".slider-tips .slider-arrow_next",
		},
		breakpoints: {
			320: {
				slidesPerView: 1.1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 32,
			},
		},
	});
}
