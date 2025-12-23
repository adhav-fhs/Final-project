const menuItems = document.querySelectorAll(".menu-item");
const cartCountEl = document.querySelector(".cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Keeps track of the time and item for scheduling alerts
let alertTimeout = null;
let activeItemName = null;

// Updates the cart count display in the navbar
function updateCartCount() {
	cartCountEl.textContent = Object.keys(cart).length;
}

// Cancels the alert if quantity is zero
function showItemAlert(name, price, quantity) {
	if (quantity === 0) return;

	const total = (price * quantity).toFixed(2);

  // Show the alert with item details
	alert(
		`You selected:\n\n` +
		`• Item: ${name}\n` +
		`• Price (single): $${price.toFixed(2)}\n` +
		`• Quantity: ${quantity}\n` +
		`• Total: $${total}`
	);
}

// Schedules an alert to show after 3 seconds of inactivity
function scheduleAlert(name, price, quantity) {
	if (alertTimeout) clearTimeout(alertTimeout);

  // If the user clicks again within 3 seconds, reset the timer
	alertTimeout = setTimeout(() => {
		showItemAlert(name, price, quantity);
		alertTimeout = null;
		activeItemName = null;
	}, 3000); // 3 seconds (ms)
}

// Initial cart count update for each new item (not quantity changes)
menuItems.forEach(item => {
	const name = item.dataset.name;
	const price = parseFloat(item.dataset.price);

  // Button activities directly from the HTML structure
	const minusBtn = item.querySelector(".minus-btn");
	const plusBtn = item.querySelector(".plus-btn");
	const delBtn = item.querySelector(".del-btn");
	const display = item.querySelector(".qnty-display");

  // Sets the init quantity from cart (renders it from the cart, but with a refresh not auto) or 0
	let quantity = cart[name]?.quantity || 0;
	display.textContent = quantity;

  // If the user clicks a different item, show alert for the previous one
	function handleInteraction() {
		if (activeItemName && activeItemName !== name) {
			const prev = cart[activeItemName];
			if (prev) {
				showItemAlert(prev.name, prev.price, prev.quantity);
			}
			if (alertTimeout) clearTimeout(alertTimeout); // Clears the 3 sec timer when the user interacts
		}

		activeItemName = name;
		scheduleAlert(name, price, quantity);
	}

	plusBtn.addEventListener("click", () => {
		quantity++;
		display.textContent = quantity;
    // increases the quantity on the display

		if (!cart[name]) {
			cart[name] = { name, price, quantity };
			updateCartCount(); // If a new item is added, updated the cart count or just update the quantity
		} else {
			cart[name].quantity = quantity;
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		handleInteraction();
	});

	minusBtn.addEventListener("click", () => {
		if (quantity === 0) return;
		// decreases the quantity on the display
		quantity--;
		display.textContent = quantity;

		if (quantity === 0) {
			delete cart[name];
			updateCartCount(); // Remove item from cart count if quantity is zero or update quantity
		} else {
			cart[name].quantity = quantity;
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		handleInteraction();
	});

	delBtn.addEventListener("click", () => {
		if (quantity === 0) return;
// Does nothing if its zero
		quantity = 0;
		display.textContent = 0;

		delete cart[name];
		updateCartCount();
// Removes item from cart and updates count
		if (activeItemName === name) {
			if (alertTimeout) clearTimeout(alertTimeout);
			activeItemName = null;
		}// Also cancels alert if the deleted item had an active timer

		localStorage.setItem("cart", JSON.stringify(cart));
	});
});

updateCartCount();
//Initial cart count and the number count (updates on refresh if something was changed in the cart)

//Everything I explained above is everything I wrote with slight help from my friend, all the localstorage parts were the help of AI as I couldn't figure it out on my own. (It kinda is Database so I hope it's allowed)
