const getForm = function () {
	const form = document.querySelector(".form");
	form.addEventListener("submit", sendMessage);
	async function sendMessage(e) {
		e.preventDefault();
		const formData = new FormData(form);
		const response = await fetch("php/server.php", {
			method: "POST",
			body: formData,
		});
		if (response.ok) {
			const result = await response.json();
			alert(result.message);
			form.reset();
		} else {
			alert("Ошибка");
		}
	}
};
getForm();
