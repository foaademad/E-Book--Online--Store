document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const dashboardId = params.get("dashboardId");

    if (!dashboardId) {
        document.body.innerHTML = `<h1>Access Denied</h1><p>No valid dashboard ID found.</p>`;
        return;
    }

    // Fetch JSON data and initialize the books array
   

    // Fetch books from localStorage
    const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];

    // Save books to localStorage
    const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));
    const fetchJsonData = async () => {
        try {
            const response = await fetch('src/js/books.json'); // Replace with actual JSON file path
            if (!response.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            const data = await response.json();
            // Combine all categories into one array
            const books = Object.values(data).flat();
            
            // Save the books array in local storage
            localStorage.setItem('books', JSON.stringify(books));
            
            return books;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
            return [];
        }
    };

    // Initialize books array
    let books = getBooks();
    if (!books.length) {
        const jsonBooks = await fetchJsonData();
        books = jsonBooks;
        saveBooks(books);
    }

    // Filter books for the specific seller
    const getSellerBooks = () => books.filter((book) => String(book.sellerId) === String(dashboardId));

    // Display seller's books in the table
    const displayProducts = () => {
        const sellerBooks = getSellerBooks();
        const productTable = document.querySelector("#products tbody");

        if (sellerBooks.length === 0) {
            productTable.innerHTML = `<tr><td colspan="9" class="text-center">No products found.</td></tr>`;
            return;
        }

        productTable.innerHTML = sellerBooks
            .map(
                (book, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.price}</td>
                <td>${book.category}</td>
                <td>${book.pages}</td>
                <td>
                    <img src="${book.image || 'src/images/default-image.png'}" alt="Product Image" style="width: 50px; height: 50px;">
                    <img src="${book.image2 || 'src/images/default-image.png'}" alt="Product Back Image" style="width: 50px; height: 50px;">
                </td>
                <td>${book.description}</td>
                <td>${book.stock}</td>
                <td>
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${book.id}" alt="Edit">
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${book.id}" alt="Delete">
                </td>
            </tr>`
            )
            .join("");
    };

    // Handle Add/Edit/Delete functionality for books
    document.querySelector("#products").addEventListener("click", (event) => {
        // Delete Book
        if (event.target.classList.contains("buttonDelete")) {
            const productId = Number(event.target.getAttribute("data-id"));
            books = books.filter((book) => book.id !== productId);
            saveBooks(books);
            displayProducts();
        }

        // Edit Book
        if (event.target.classList.contains("buttonEdit")) {
            const productId = Number(event.target.getAttribute("data-id"));
            const book = books.find((book) => book.id === productId);

            if (book) {
                document.getElementById("productName").value = book.title || "";
                document.getElementById("Author").value = book.author || "";
                document.getElementById("productPrice").value = book.price || "";
                document.getElementById("productCategory").value = book.category || "";
                document.getElementById("productPages").value = book.pages || "";
                document.getElementById("productImage").value = book.image || "src/images/default-image.png";
                document.getElementById("productImage2").value = book.image2 || "src/images/default-image.png";
                document.getElementById("productDescription").value = book.description || "";
                document.getElementById("productStock").value = book.stock || "";
                document.getElementById("editProductId").value = productId || "";

                const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
                addProductModal.show();
            }
        }
    });

    
    document.getElementById("addProductForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const productId = document.getElementById("editProductId").value;
        const productName = document.getElementById("productName").value.trim();
        const productAuthor = document.getElementById("Author").value.trim();
        const productPrice = document.getElementById("productPrice").value.trim();
        const productCategory = document.getElementById("productCategory").value.trim();
        const productPages = document.getElementById("productPages").value.trim();
        const productImage = document.getElementById("productImage").value || "src/images/default-image.png";
        const productImage2 = document.getElementById("productImage2").value || "src/images/default-image.png";
        const productDescription = document.getElementById("productDescription").value.trim();
        const productStock = document.getElementById("productStock").value.trim();

        if (!productName || !productAuthor || !productPrice || !productCategory || !productPages || !productDescription || !productStock) {
            alert("All fields are required!");
            return;
        }

        if (isNaN(productPrice) || isNaN(productPages) || isNaN(productStock)) {
            alert("Price, Pages, and Stock must be numeric values!");
            return;
        }

        if (productId) {
            // Edit existing product
            const book = books.find((book) => book.id === Number(productId));
            if (book) {
                book.title = productName;
                book.author = productAuthor;
                book.price = parseFloat(productPrice);
                book.category = productCategory;
                book.pages = parseInt(productPages, 10);
                book.image = productImage;
                book.image2 = productImage2;
                book.description = productDescription;
                book.stock = parseInt(productStock, 10);
            }
        } else {
            // Add new product
            books.push({
                id: Date.now(),
                title: productName,
                author: productAuthor,
                price: parseFloat(productPrice),
                category: productCategory,
                pages: parseInt(productPages, 10),
                image: productImage,
                image2: productImage2,
                description: productDescription,
                stock: productStock,
                sellerId: dashboardId, // Assign the seller's dashboardId
            });
        }
        

        saveBooks(books);
        displayProducts();
        alert(productId ? "Product updated successfully!" : "Product added successfully!");

        const addProductModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        addProductModal.hide();
        document.getElementById("addProductForm").reset();
        
    });
 
    // Initialize Page
    displayProducts();
});

//-----------------------------------------------------------------

window.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sellerDashboard = JSON.parse(localStorage.getItem("sellerDashboard"));
    const users = JSON.parse(localStorage.getItem("users")); // Fetch users array from localStorage
    const ordersTableBody = document.querySelector("#orders tbody");

    console.log("currentUser:", currentUser);
    console.log("sellerDashboard:", sellerDashboard);
    console.log("users:", users);

    if (currentUser && currentUser.role === "seller" && users && users.length > 0) {
        // Find the current seller
        const currentSeller = sellerDashboard.find(
            (seller) => seller.email === currentUser.email
        );

        if (currentSeller) {
            const sellerDashboardId = currentSeller.dashboardId; // Ensure this is defined

            // Aggregated data: Map to hold customer data by email
            const aggregatedData = {};

            users.forEach((user) => {
                // Check books in the cart (Pending)
                if (user.cart && user.cart.length > 0) {
                    console.log(`Checking cart for user: ${user.email}`);
                    user.cart.forEach((book) => {
                        if (String(book.sellerId) === String(sellerDashboardId)) {
                            if (!aggregatedData[user.email]) {
                                aggregatedData[user.email] = {
                                    name: user.firstName,
                                    bookCount: 0,
                                    totalPrice: 0,
                                };
                            }
                            aggregatedData[user.email].bookCount += book.quantity || 1;
                            aggregatedData[user.email].totalPrice +=
                                book.price * (book.quantity || 1);
                        }
                    });
                }

                // Check books in the history (Done)
                if (user.history && user.history.length > 0) {
                    console.log(`Checking history for user: ${user.email}`);
                    user.history.forEach((book) => {
                        if (String(book.sellerId) === String(sellerDashboardId)) {
                            if (!aggregatedData[user.email]) {
                                aggregatedData[user.email] = {
                                    name: user.firstName,
                                    bookCount: 0,
                                    totalPrice: 0,
                                };
                            }
                            aggregatedData[user.email].bookCount += book.quantity || 1;
                            aggregatedData[user.email].totalPrice +=
                                book.price * (book.quantity || 1);
                        }
                    });
                }
            });

            // Populate the table with aggregated data
            Object.keys(aggregatedData).forEach((email, index) => {
                const customer = aggregatedData[email];
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${customer.name}</td>
                <td>${customer.bookCount}</td>
                <td>$${customer.totalPrice.toFixed(2)}</td>
                `;
                ordersTableBody.appendChild(row);
            });
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="5" class="text-center">No seller account found for this user</td>`;
            ordersTableBody.appendChild(row);
        }
    } else {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="5" class="text-center">No customers or invalid user role</td>`;
        ordersTableBody.appendChild(row);
    }
});
  
  //------------------------------------------------------------------------------------------------------

  window.addEventListener("DOMContentLoaded", function () {
        const ordersTable = document.querySelector("#orders");
        const ordersTableBody = ordersTable.querySelector("tbody");
        const headers = Array.from(ordersTable.querySelectorAll("thead th"));
        const sortOrders = Array(headers.length).fill(true); // Track sort orders for all columns
      
        // Add click event listener to each header
        headers.forEach((header, columnIndex) => {
          header.addEventListener("click", function () {
            // Get all rows from the table body
            const rows = Array.from(ordersTableBody.querySelectorAll("tr"));
      
            // Sort rows based on the clicked column
            rows.sort((a, b) => {
              const cellA = a.cells[columnIndex].textContent.trim();
              const cellB = b.cells[columnIndex].textContent.trim();
      
              // Determine sort order (ascending or descending)
              if (!isNaN(cellA) && !isNaN(cellB)) {
                // Numerical sort
                return sortOrders[columnIndex]
                  ? Number(cellA) - Number(cellB)
                  : Number(cellB) - Number(cellA);
              } else {
                // String sort
                return sortOrders[columnIndex]
                  ? cellA.localeCompare(cellB)
                  : cellB.localeCompare(cellA);
              }
            });
      
            // Toggle the sort order for this column
            sortOrders[columnIndex] = !sortOrders[columnIndex];
      
            // Remove all rows and reinsert them in the sorted order
            ordersTableBody.innerHTML = "";
            rows.forEach((row) => ordersTableBody.appendChild(row));
          });
        });
      });