const cartItemsEl = document.getElementById("cart-items");
const grandTotalEl = document.getElementById("grand-total");

let cart = JSON.parse(localStorage.getItem("cart")) || {};

function renderCart() {
	cartItemsEl.innerHTML = "";
	let grandTotal = 0;
// Resets cart display and grand total calculation

//Runs through each item in the cart
	Object.values(cart).forEach(item => {
		const itemTotal = item.price * item.quantity;
		grandTotal += itemTotal;
    // Calculates grand total

		const div = document.createElement("div");
		div.className = "cart-item";
    // Creates the cart item display structure

    // Creates the DOM structure for each cart item and injects it into the HTML itself so it can be grabbed by CSS to change.
		div.innerHTML = `
			<div class="item-info">
				<div class="item-name">${item.name}</div>
				<div class="item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
			</div>

			<div class="item-right">
				<div class="cart-controls">
					<button class="ctrl-btn minus">−</button>
					<button class="ctrl-btn delete">🗑️</button>
					<button class="ctrl-btn plus">+</button>
				</div>
				<div class="item-total">$${itemTotal.toFixed(2)}</div>
			</div>
		`;

    // + button functionality
		div.querySelector(".plus").onclick = () => {
			item.quantity++;
			saveAndRender();
		};
// - button functionality
		div.querySelector(".minus").onclick = () => {
			item.quantity--;
			if (item.quantity <= 0) delete cart[item.name];
			saveAndRender();
		};
// del button functionality
		div.querySelector(".delete").onclick = () => {
			delete cart[item.name];
			saveAndRender();
		};
// Appends the created DOM structure to the cart
		cartItemsEl.appendChild(div);
	});
// Updates the grand total display
	grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
}
// Saves the cart to localStorage(AI Help) and re-renders the cart display
function saveAndRender() {
	localStorage.setItem("cart", JSON.stringify(cart));
	renderCart();
}
// Display for the cart items and the load(works only on refresh)
renderCart();


//Everything I explained above is everything I wrote with slight help from my friend, all the localstorage parts were the help of AI as I couldn't figure it out on my own. (It kinda is Database so I hope it's allowed)
