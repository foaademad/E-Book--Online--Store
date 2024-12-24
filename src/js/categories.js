// Categories and Books Data
let categories = {};

// Utility Functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Function to fetch books from LocalStorage
async function fetchBooks() {
    try {
        const books = getFromLocalStorage("books");
        categories = books.reduce((acc, book) => {
            if (!acc[book.category]) acc[book.category] = [];
            acc[book.category].push(book);
            return acc;
        }, {});
        return categories;
    } catch (error) {
        console.error("Error fetching books:", error);
        return {};
    }
}

// Function to get all books
function getAllBooks() {
    return Object.values(categories).flat();
}

// Function to get books by category
function getBooksByCategory(categoryName) {
    return categories[categoryName] || [];
}

// Global variables for pagination
const BOOKS_PER_PAGE = 12;
let currentPage = 1;

// Function to search books
function searchBooks() {
    const searchTerm = document.getElementById("book-search").value.toLowerCase();
    const books = getAllBooks();
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm));
    displayBooks(filteredBooks);
}

// Function to display books
function displayBooks(books) {
    const resultsContent = document.getElementById("results-content");
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, books.length);
    const booksToShow = books.slice(startIndex, endIndex);

    resultsContent.innerHTML = "";
    const bookgrid = document.createElement("div");
    bookgrid.className = "bookgrid";

    booksToShow.forEach((book) => {
        const bookCard = `
            <div class="book">
                <img src="${book.image}" alt="${book.title}" style="width:100px">
                <h3>${book.title}</h3>
                <p class="price">$${book.price}</p>
                <p class="status">$${book.stock > 0 ? "In Stock" : "Out Of Stock"}</p>
                <div class="icons">
                    ${book.stock > 0 ? `<a href="#" class="cart-icon" onclick="event.preventDefault(); addToCart(${book.id})"><i class="fas fa-shopping-cart"></i></a>` : ""}
                    <a href="#" class="cart-icon" onclick="event.preventDefault(); goToBookDetails(${JSON.stringify(book).replace(/"/g, "&quot;")})"><i class="fas fa-eye"></i></a>
                </div>
                ${book.stock > 0 ? `<button class="add-to-cart" onclick="addToCart(${book.id})"><i class="fas fa-shopping-cart"></i>Add to Cart</button>` : ""}
             </div>
            `;
        bookgrid.innerHTML += bookCard;
    });

    resultsContent.appendChild(bookgrid);
    updatePagination(books.length);
}

// Function to update the cart count
function updateCartCount() {
    const currentUser = getFromLocalStorage("currentUser");
    const cartCount = currentUser?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    document.getElementById("cart-count").textContent = cartCount;
}

// Function to add a book to the cart
window.addToCart = function (bookId) {
    const books = getAllBooks();
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        alert("Book not found!");
        return;
    }

    const users = getFromLocalStorage("users");
    const currentUser = getFromLocalStorage("currentUser");

    if (!currentUser) {
        alert("Please log in to add items to your cart!");
        return;
    }

    if (!currentUser.cart) {
        currentUser.cart = [];
    }

    const isBookInCart = currentUser.cart.some((item) => item.id === book.id);
    if (isBookInCart) {
        alert("This book is already in your cart.");
    } else {
        currentUser.cart.push({ ...book, quantity: 1 });
        saveToLocalStorage("currentUser", currentUser);
        const userIndex = users.findIndex((user) => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveToLocalStorage("users", users);
        }
        updateCartCount();
    }
};

// Function to navigate to book details
function goToBookDetails(book) {
    try {
        localStorage.setItem("selectedBook", JSON.stringify(book));
        window.location.href = "eachcategory.html";
    } catch (error) {
        console.error("Error navigating to book details:", error);
    }
}

// Function to update pagination
function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
    const pagination = document.querySelector(".pagination");

    if (pagination) {
        pagination.innerHTML = `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
            ${generatePageNumbers(totalPages)}
            <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>`;
    }
}

// Function to generate page numbers
function generatePageNumbers(totalPages) {
    let pages = "";
    for (let i = 1; i <= totalPages; i++) {
        pages += `
            <li class="page-item ${currentPage === i ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>`;
    }
    return pages;
}

// Function to change page
function changePage(newPage) {
    const books = getAllBooks();
    const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayBooks(books);
    }
}

// Function to filter by price
function updatePriceDisplay() {
    const minPrice = document.getElementById("price-min").value;
    const maxPrice = document.getElementById("price-max").value;
    document.getElementById("price-min-display").textContent = minPrice;
    document.getElementById("price-max-display").textContent = maxPrice;
}

function filterByPrice() {
    const minPrice = parseFloat(document.getElementById("price-min").value);
    const maxPrice = parseFloat(document.getElementById("price-max").value);
    const books = getAllBooks();
    const filteredBooks = books.filter((book) => book.price >= minPrice && book.price <= maxPrice);
    displayBooks(filteredBooks);
}

// Function to filter by product status
function filterProductStatus() {
    const status = document.getElementById("status").value;
    const books = getAllBooks();
    const filteredBooks = status === "all"
        ? books
        : books.filter((book) => (status === "in" ? book.stock > 0 : book.stock === 0));
    displayBooks(filteredBooks);
}

// Function to bind category click handlers
function bindCategoryClickHandlers() {
    const categoryLinks = document.querySelectorAll(".categories a");
    categoryLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            categoryLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
            const categoryName = link.textContent.trim().toLowerCase();
            const filteredBooks = categoryName === "all books" ? getAllBooks() : getBooksByCategory(categoryName);
            displayBooks(filteredBooks);
            updatePagination(filteredBooks.length);
        });
    });
}

// Function to sort books
function sortResults(sortType) {
    const books = getAllBooks();
    switch (sortType) {
        case "name-asc":
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "name-desc":
            books.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "price-asc":
            books.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            books.sort((a, b) => b.price - a.price);
            break;
        default:
            books.sort((a, b) => a.id - b.id);
    }
    displayBooks(books);
}

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooks();
    const allBooks = getAllBooks();
    displayBooks(allBooks);
    updatePagination(allBooks.length);
    updateCartCount();

    document.getElementById("filter-button").addEventListener("click", filterByPrice);
    document.getElementById("status").addEventListener("change", filterProductStatus);
    document.getElementById("price-min").addEventListener("input", updatePriceDisplay);
    document.getElementById("price-max").addEventListener("input", updatePriceDisplay);
    document.getElementById("sort-select").addEventListener("change", (e) => sortResults(e.target.value));
    bindCategoryClickHandlers();
});
