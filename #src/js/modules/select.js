let select = function () {
	let selectHeader = document.querySelectorAll(".select__header");
	let selectItem = document.querySelectorAll(".select__item");
	window.addEventListener("click", event => {
		if (
			!event.target.classList.contains("select__header") &&
			!event.target.classList.contains("select__item")
		) {
			closeAll();
		}
	});

	selectHeader.forEach(item => {
		item.addEventListener("click", selectToggle);
	});

	selectItem.forEach(item => {
		item.addEventListener("click", selectChoose);
	});
	function closeAll() {
		let select = document.querySelectorAll(".select");
		select.forEach(item => {
			let header = item.querySelector(".select__header"),
				body = item.querySelector(".select__body");
			if (body.classList.contains("_is-active")) {
				body.classList.remove("_is-active");
				header.classList.remove("_rotate");
			}
		});
	}

	function selectToggle() {
		closeAll();
		this.classList.toggle("_rotate");
		this.nextElementSibling.classList.toggle("_is-active");
	}

	function selectChoose() {
		let text = this.innerText,
			select = this.closest(".select"),
			currentText = select.querySelector(".select__header"),
			bodyActive = select.querySelector(".select__body");
		currentText.innerText = text;
		bodyActive.classList.remove("_is-active");
		currentText.classList.remove("_rotate");
	}
};

select();
