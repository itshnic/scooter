// Функция ловит клик в окне и добавляет класс _hover (нужно для touchscreen)
window.onload = function () {
	document.addEventListener("click", e => {
		const targetElement = e.target;
		if (window.innerWidth < 768 && isMobile.any()) {
			if (targetElement.classList.contains("menu__arrow")) {
				targetElement.closest(".menu__item").classList.toggle("_hover");
			}
			// проверка неходит все классы _hover и убирает их.
			if (
				!targetElement.closest(".menu__item") &&
				document.querySelectorAll(".menu__item._hover").length > 0
			) {
				_removeClasses(
					document.querySelectorAll(".menu__item._hover"),
					"_hover"
				);
			}
		}
		if (targetElement.classList.contains("search-form__icon")) {
			document.querySelector(".search-form").classList.toggle("_active");
		} else if (
			!targetElement.closest(".search-form") &&
			document.querySelectorAll(".search-form._hover")
		) {
			document.querySelector(".search-form").classList.remove("_active");
		}
		// Делаем эффект летящей карточки в корзину
		if (targetElement.classList.contains("actions-product__button")) {
			const productId = targetElement.closest(".item-product").dataset.pid; // Если есть клик по кнопке товара то найдем родителя (блок карточки товара) и возвращаем его id closest(selector) возвращает ближайшего предка, соответствующего селектору
			addToCart(targetElement, productId); //Функция для создания эффекта
			e.preventDefault(); //Остановим открытие ссылки по тегу <a>
		}
		// Проверяем если при клике на иконку или спан у них есть или родителя есть этот класс то накидываем класс active
		// if (
		// 	targetElement.classList.contains("cart-header__icon") ||
		// 	targetElement.closest(".cart-header__icon")
		// ) {
		// 	if (document.querySelector(".cart-list").children.length > 0) {
		// 		document.querySelector(".cart-header").classList.toggle("_active");
		// 	}
		// 	e.preventDefault();
		//Если сделан клик в любом месте сайта кроме кнопки добавить товар - закрываем окно корзины
		// } else if (!targetElement.closest(".cart-header") &&!targetElement.classList.contains("actions-product__button")
		// ) {
		// 	document.querySelector(".cart-header").classList.remove("_active");
		// }
		// если есть клик по кнопке delete то возвращаем его pId
		// if (targetElement.classList.contains("cart-list__delete")) {
		// 	const productId =
		// 		targetElement.closest(".cart-list__item").dataset.cartPid;
		// 	updateCart(targetElement, productId, false); // вызываем ф-ю со знач. false для удаления товара
		// 	e.preventDefault();
		// }
	});
};
function addToCart(targetElement, productId) {
	if (!targetElement.classList.contains("_hold")) {
		targetElement.classList.add("_hold"); // если нет то добавим класс hold и fly
		targetElement.classList.add("_fly");

		const cart = document.querySelector(".cart-header__icon"); // находим объект  корзины с картинкой
		const product = document.querySelector(`[data-pid="${productId}"]`); //Найдем блок карточки товара
		const productImage = product.querySelector(".item-product__image"); //Найдем картинку из карточки товаров

		const productImageFly = productImage.cloneNode(true); // Клонируем картинку

		const productImageFlyWidth = productImage.offsetWidth; //Вернем размеры и место нахождения оригинальной картинки
		const productImageFlyHeight = productImage.offsetHeight; //
		const productImageFlyTop = productImage.getBoundingClientRect().top;
		const productImageFlyLeft = productImage.getBoundingClientRect().left;

		// Работаем с клоном
		productImageFly.setAttribute("class", "_flyImage _ibg"); // Меняем классы у клона
		productImageFly.style.cssText = `
		left: ${productImageFlyLeft}px;
		top: ${productImageFlyTop}px;
		width: ${productImageFlyWidth}px;
		height: ${productImageFlyHeight}px;
		`; // Присваиваем клону размеры и место-положения

		document.body.append(productImageFly); // Выводим клон в конец тега body

		const cartFlyLeft = cart.getBoundingClientRect().left;
		const cartFlyTop = cart.getBoundingClientRect().top;

		productImageFly.style.cssText = `
		left: ${cartFlyLeft}px;
		top: ${cartFlyTop}px;
		width: 0px;
		height: 0px;
		opacity: 0;
		`; // Присваиваем клону размеры и место-положения

		productImageFly.addEventListener("transitionend", () => {
			if (targetElement.classList.contains("_fly")) {
				productImageFly.remove();
				// updateCart(targetElement, productId, true);
				targetElement.classList.remove("_fly");
			}
			targetElement.classList.remove("_hold"); // удаляем класс для обработки через php
		}); // При событии транзиш. если у кнопки есть класс Fly - удаляем клон картинки и удаляем класс fly contains("_fly") - проверка на вложенность boolean
	}
}
function updateCart(targetElement, productId, productAdd) {
	const cart = document.querySelector(".cart-header"); //Находим блок корзины
	const cartIcon = cart.querySelector(".cart-header__icon"); // Ищем  в ней ссылку с иконкой в нее нужно добавить спан
	const cartQuantity = cartIcon.querySelector("span"); //В шаблоне HTML будет добавлен span в котором работает счетчик
	const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`); //Нужен для поиска товаров
	const cartList = document.querySelector(".cart-list"); // В него будут добавляться товары
	if (productAdd) {
		if (cartQuantity) {
			++cartQuantity.innerHTML;
		} else {
			cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
		}
		if (!cartProduct) {
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const cartProductImage =
				product.querySelector(`.item-product__image`).innerHTML;
			const cartProductTitle =
				product.querySelector(`.item-product__title`).innerHTML;
			const cartProductContent = `
									<a href='' class='cart-list__image _ibg'>${cartProductImage}</a>
		              <div class="cart-list__body">
		                <a href='' class='cart-list__title _ibg'>${cartProductTitle}</a>
		                <div class="cart-list__quantity"><span>1</span></div>
		                  <a href='' class='cart-list__delete _ibg'>Delete</a>
		              </div>
			`;
			cartList.insertAdjacentHTML(
				"beforeend",
				`<li data-cart-pid='${productId}' class="cart-list__item">${cartProductContent}</li>`
			);
		} else {
			const cartProductQuantity = cartProduct.querySelector(
				".cart-list__quantity span"
			);
			++cartProductQuantity.innerHTML;
		}
		targetElement.classList.remove("_hold");
	}
	// Уменьшаем количество товара в карточке и счетчике по достижению 0 удаляем товар и счетик
	else {
		const cartProductQuantity = cartProduct.querySelector(
			".cart-list__quantity span"
		);
		--cartProductQuantity.innerHTML;
		if (!parseInt(cartProductQuantity.innerHTML)) {
			cartProduct.remove();
		}
		const cartQuantityValue = --cartQuantity.innerHTML;
		if (cartQuantityValue) {
			cartQuantity.innerHTML = cartQuantityValue;
		} else {
			cartQuantity.remove();
			cart.classList.remove("_active");
		}
	}
}
// Header Наблюдатель за скролом при прокрутке меняем шапку сайта
const headerElement = document.querySelector(".header");

const callback = function (entries, observer) {
	if (entries[0].isIntersecting) {
		headerElement.classList.remove("_scroll");
	} else {
		headerElement.classList.add("_scroll");
	}
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerElement);
