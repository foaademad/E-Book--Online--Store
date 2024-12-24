// Function to load book details
function loadBookDetails() {
    try {
        console.log('Loading book details...'); // Debug log
        // Get the selected book from localStorage
        const bookData = localStorage.getItem('selectedBook');
        console.log('Book data from localStorage:', bookData); // Debug log

        if (!bookData) {
            console.log('No book data found, redirecting...'); // Debug log
            window.location.href = 'categiores.html'; // Redirect if no book selected
            return;
        }

        const book = JSON.parse(bookData);
        console.log('Parsed book data:', book); // Debug log

        // Update main image and thumbnails
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = book.image;
            mainImage.alt = book.title;
        } else {
            console.error('mainImage element not found'); // Debug log
        }

        // Update thumbnails with front and back cover images
        const thumbnails = document.querySelectorAll('.thumbnails img');
        if (thumbnails.length >= 2) {
            // First thumbnail - front cover
            thumbnails[0].src = book.image;
            thumbnails[0].alt = book.title + " (Front Cover)";
            
            // Second thumbnail - back cover
            thumbnails[1].src = book.image2;
            thumbnails[1].alt = book.title + " (Back Cover)";
        } else {
            console.error('thumbnails element not found or less than 2 thumbnails'); // Debug log
        }

        // Update book details
        const elements = {
            'bookTitle': book.title,
            'bookPrice': `$${book.price}`,
            'bookDescription': book.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar, tortor quis varius pretium, est felis scelerisque nulla, vitae placerat justo nunc a massa. Aenean nec montes vestibulum urna vel imperdiet ipsum. Orci varius natoque penatibus et magnis dis ridicul parturient montes.'
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.error(`Element with id '${id}' not found`); // Debug log
            }
        }

        // Update additional information
        const additionalInfo = document.getElementById('bookAdditionalInfo');
        if (additionalInfo) {
            additionalInfo.innerHTML = `
                <div class="row">
                    <div class="col-4">
                        <p><strong>SKU:</strong> ${book.id}</p>
                        <p><strong>Category:</strong> ${book.category}</p>
                        <p><strong>Format:</strong> Hardcover</p>
                    </div>
                    <div class="col-4">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Status:</strong> ${book.status}</p>
                        <p><strong>Language:</strong> English</p>
                    </div>
                    <div class="col-4">
                        <p><strong>Price:</strong> $${book.price}</p>
                        <p><strong>Pages:</strong> ${book.pages}</p>
                    </div>
                </div>
            `;
        } else {
            console.error('bookAdditionalInfo element not found'); // Debug log
        }

        // Update description tab
        const description = document.getElementById('description');
        if (description) {
            description.innerHTML = `
                <p>${book.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident adipisci accusamus autem ad exercitationem ex nostrum fugit possimus in et, vitae quis perferendis reprehenderit nulla, architecto, eius delectus suscipit sunt error! Sint voluptatum velit accusantium quod optio fugit non maxime vel tempora aliquid hic nesciunt tempore sequi deleniti a, rem quas aspernatur odio dolore saepe eveniet impedit? Laborum corporis animi ex laudantium provident ad eaque quisquam repellat consequuntur vel, error eligendi repudiandae vitae ipsum nesciunt, quidem deleniti doloremque in illo adipisci rerum facere. Soluta iure earum necessitatibus voluptas blanditiis quis corporis exercitationem provident molestiae? Sit quasi sequi numquam. Maiores, voluptas?'}</p>
            `;
        } else {
            console.error('description element not found'); // Debug log
        }

        // Handle Add to Cart button visibility
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            if (book.status !== 'In Stock') {
                addToCartBtn.style.display = 'none';
            } else {
                addToCartBtn.style.display = 'block';
                addToCartBtn.onclick = () => addToCart(book);
            }
        } else {
            console.error('addToCartBtn element not found'); // Debug log
        }
    } catch (error) {
        console.error('Error in loadBookDetails:', error); // Debug log
    }
}

// Function to add book to cart
function addToCart(book) {
    // جلب المستخدم الحالي من localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    // التحقق من وجود خاصية cart في المستخدم الحالي
    if (!Array.isArray(currentUser.cart)) {
        currentUser.cart = []; // تهيئة السلة إذا لم تكن موجودة
    }

    // التحقق مما إذا كان الكتاب موجودًا بالفعل في السلة
    const existingBook = currentUser.cart.find((item) => item.id === book.id);
    if (existingBook) {
        alert("This book is already in your cart!");
        return;
    }

    // إضافة الكتاب مع الكمية الافتراضية
    const bookWithQuantity = { ...book, quantity: 1 }; // نسخ الكائن مع إضافة خاصية الكمية
    currentUser.cart.push(bookWithQuantity);

    // تحديث بيانات المستخدم في localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // تحديث قائمة المستخدمين أيضًا
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) => (user.email === currentUser.email ? currentUser : user));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // تحديث رقم السلة
    updateCartCount();

    alert("Book added to your cart with quantity 1!");
}

function updateCartCount() {
    // جلب المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    // حساب عدد العناصر في السلة
    const cartCount = Array.isArray(currentUser.cart) ? currentUser.cart.length : 0;

    // تحديث عنصر واجهة المستخدم
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}
// تحديث رقم السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updateCartCount);




// Function to change main image when clicking thumbnails
function changeMainImage(imgSrc) {
    document.getElementById('mainImage').src = imgSrc;
}

// Function to switch tabs
function openTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }

    const tabs = document.getElementsByClassName('tab');
    for (let tab of tabs) {
        tab.classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadBookDetails);
