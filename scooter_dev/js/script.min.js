// Бургер
const burger = function () {
	const icon = document.querySelector(".menu-header__burger");

	function active() {
		this.classList.toggle("_is-active");
		document.querySelector("#menu-header").classList.toggle("_is-active");
	}
	icon.addEventListener("click", active);
};
burger();

//Перемещение тега
const media = function () {
	const telTag = document.querySelector("#tel").cloneNode(true),
		menuTel = document.querySelector(".phone-header"),
		menuHeader = document.querySelector("#menu-header");

	function handleTabletChange(addElement, removeElement) {
		if (!addElement.querySelector("#tel")) addElement.append(telTag);
		if (removeElement.querySelector("#tel"))
			removeElement.querySelector("#tel").remove();
	}

	window.addEventListener("resize", () => {
		if (window.innerWidth < 991.98) handleTabletChange(menuHeader, menuTel);
		if (window.innerWidth > 991.98) handleTabletChange(menuTel, menuHeader);
	});
	function controlWidth() {
		if (window.innerWidth < 991.98) handleTabletChange(menuHeader, menuTel);
	}
	controlWidth();
};
media();
// блок формы
const form = function () {
	const zakazBtn = document.querySelector(".zakaz__btn"),
		goodsBtn = document.querySelector(".goods-center__btn"),
		form = document.querySelector(".form-center"),
		cross = form.querySelector(".form__cross");

	zakazBtn.addEventListener("click", open);
	goodsBtn.addEventListener("click", open);
	cross.addEventListener("click", open);
	function open() {
		form.classList.toggle("_active");
		form.scrollIntoView({ behavior: "smooth" });
	}
};
form();
