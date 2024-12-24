document.addEventListener("DOMContentLoaded", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    //let products = JSON.parse(localStorage.getItem("products")) || [];
    let books = JSON.parse(localStorage.getItem("books")) || [];
    //let cart = [];

    if (!currentUser) {
        Toastify({
            text: "Please login first to access cart",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "#dc3545" },
        }).showToast();

        setTimeout(() => {
            window.location.href = "../sign-in.html";
        }, 3000);
        return;
    }

    function loadCartFromStorage() {
        const user = users.find((user) => user.email === currentUser.email);
        if (user && user.cart) {
            cart = [...user.cart];
            currentUser = { ...user };
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            cart = [];
        }
    }

    function updateCartCount() {
        const cartCountElement = document.querySelector("#cart-count");
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        if (currentUser) {
            const filteredUser = users.find((user) => user.email === currentUser.email);
            if (filteredUser) {
                filteredUser.cart = [...cart];
                currentUser.cart = [...cart];

                const updatedUsers = users.map((user) =>
                    user.email === currentUser.email ? filteredUser : user
                );

                localStorage.setItem("users", JSON.stringify(updatedUsers));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
        }
    }

    function updateCartTable() {
        const cartTable = document.querySelector("#cart-table");
        cartTable.innerHTML = "";

        cart.forEach((item) => {
            const row = document.createElement("tr");
            row.dataset.id = item.id;
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px; margin-right: 10px;">
                    ${item.title}
                </td>
                <td>$${item.price}</td>
                <td>
                    <div style="display: flex;">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            cartTable.appendChild(row);
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        const shippingCost = 5.0;
        const totalBill = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        const totalAmount = (parseFloat(totalBill) + shippingCost).toFixed(2);

        document.querySelector(".cart-total-bill").textContent = `$${totalBill}`;
        document.querySelector(".cart-shipping").textContent = `$${shippingCost.toFixed(2)}`;
        document.querySelector(".cart-total-amount").textContent = `$${totalAmount}`;
    }

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (target.classList.contains("increase-quantity")) {
            const cartItem = target.closest("tr");
            const id = parseInt(cartItem.dataset.id);
            const item = cart.find((item) => item.id === id);

            if (item) {
                const matchingBook = books.find(
                    (book) => book.title === item.title && book.author === item.author
                );

                if (matchingBook) {
                    if (item.quantity < matchingBook.stock) {
                        item.quantity += 1;
                        updateCartTable();
                        updateCartCount();
                    } else {
                        Toastify({
                            text: "Cannot increase quantity beyond available stock!",
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            style: { background: "#dc3545" },
                        }).showToast();
                    }
                }
            }
        }

        if (target.classList.contains("decrease-quantity")) {
            const cartItem = target.closest("tr");
            const id = parseInt(cartItem.dataset.id);
            const item = cart.find((item) => item.id === id);

            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCartTable();
                updateCartCount();
            }
        }

        if (target.classList.contains("remove-item") || target.closest(".remove-item")) {
            const cartItem = target.closest("tr");
            const id = parseInt(cartItem.dataset.id);

            const removedItem = cart.find((item) => item.id === id);

            if (removedItem) {
                cart = cart.filter((item) => item.id !== id);
                currentUser.cart = [...cart];

                users = users.map((user) =>
                    user.email === currentUser.email ? { ...user, cart: [...cart] } : user
                );

                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));

                Toastify({
                    text: "This Book removed from cart!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: { background: "#dc3545" },
                }).showToast();

                updateCartTable();
                updateCartCount();
            } else {
                console.error("Book not found in cart.");
            }
        }
    });

    document.querySelector("#checkout").addEventListener("click", (event) => {
        const totalBill = parseFloat(
            document.querySelector(".cart-total-bill").textContent.replace("$", "")
        );

        if (totalBill === 0) {
            event.preventDefault();
            Toastify({
                text: "Your cart is empty! Add items to proceed to checkout.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "#dc3545" },
            }).showToast();
        }
    });

    loadCartFromStorage();
    updateCartTable();
    updateCartCount();
});
