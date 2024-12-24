
document.addEventListener("DOMContentLoaded", function () {
    const shippingCost = 5.0; // قيمة الشحن الثابتة
    const orderSummaryTable = document.getElementById("order-summary-table");
    const subtotalElement = document.querySelector(".subtotal");
    const shippingElement = document.querySelector(".shipping");
    const totalElement = document.querySelector(".total");

    // جلب بيانات المستخدم الحالي من localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const cartOfBuying = currentUser.cart || []; // جلب السلة الخاصة بالمستخدم

    // دالة لتحديث الجدول والقيم المالية
    function updateOrderSummary() {
        let subtotal = 0;

        // تفريغ الجدول قبل إعادة ملئه
        orderSummaryTable.innerHTML = "";

        // إنشاء الصفوف للمنتجات
        cartOfBuying.forEach((item) => {
            const row = document.createElement("tr");

            // اسم المنتج مع الكمية
            const productCell = document.createElement("td");
            productCell.textContent = `${item.title} (${item.quantity}x)`;
            row.appendChild(productCell);

            // السعر الإجمالي لكل منتج
            const priceCell = document.createElement("td");
            const itemTotal = item.price * item.quantity;
            priceCell.textContent = `$${itemTotal.toFixed(2)}`;
            row.appendChild(priceCell);

            // إضافة الصف إلى الجدول
            orderSummaryTable.appendChild(row);

            // إضافة سعر المنتج للإجمالي الجزئي
            subtotal += itemTotal;
        });

        // تحديث القيم المالية
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
    }

    // استدعاء الدالة عند تحميل الصفحة
    updateOrderSummary();
});
// =======================================================================

document.addEventListener("DOMContentLoaded", function () {
    // جلب بيانات المستخدم من localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // تعيين القيم في الحقول
        document.getElementById("firstName").value = currentUser.firstName || "";
        document.getElementById("lastName").value = currentUser.lastName || "";
        document.getElementById("Country").value = currentUser.country || "";
        document.getElementById("Town").value = currentUser.city || "";
        document.getElementById("Phone").value = currentUser.phone || "";
        document.getElementById("email").value = currentUser.email || "";
        document.getElementById("notes").value = currentUser.notes || "";
    }
});
// ================================================================================
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#save-checkout").addEventListener("click", function (event) {
        event.preventDefault();

        // جلب بيانات المستخدم الحالية من localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const books = JSON.parse(localStorage.getItem("books")) || []; // جلب بيانات الكتب
        const cart = currentUser.cart || []; // جلب سلة المشتريات الخاصة بالمستخدم

        // التحقق من صحة البيانات المدخلة
        let formIsValid = true;

        // التحقق من الحقول
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("Phone").value.trim();
        const country = document.getElementById("Country").value.trim();
        const city = document.getElementById("Town").value.trim();

        // التحقق من الحقول و عرض رسائل الأخطاء
        const firstNameError = document.getElementById("first-name-error");
        const lastNameError = document.getElementById("last-name-error");
        const emailError = document.getElementById("email-error");
        const phoneError = document.getElementById("phone-error");
        const countryError = document.getElementById("country-error");
        const cityError = document.getElementById("city-error");

        if (!firstName || /\s/.test(firstName) || /[^a-zA-Z\s]/.test(firstName)) {
            firstNameError.textContent = "Please enter a valid first name (no spaces or special characters).";
            formIsValid = false;
        } else {
            firstNameError.textContent = "";
        }

        if (!lastName || /\s/.test(lastName) || /[^a-zA-Z\s]/.test(lastName)) {
            lastNameError.textContent = "Please enter a valid last name (no spaces or special characters).";
            formIsValid = false;
        } else {
            lastNameError.textContent = "";
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid Gmail address.";
            formIsValid = false;
        } else {
            emailError.textContent = "";
        }

        const phonePattern = /^[0-9]{11}$/;
        if (!phonePattern.test(phone)) {
            phoneError.textContent = "Please enter a valid phone number (11 digits, no spaces).";
            formIsValid = false;
        } else {
            phoneError.textContent = "";
        }

          if (!country || /\s/.test(country)) {
              countryError.textContent = "Please enter a valid country name and no spaces.";
              formIsValid = false;
          } else {
              countryError.textContent = "";
          }

          if (!city || /\s/.test(city)) {
              cityError.textContent = "Please enter a valid city name and no spaces.";
              formIsValid = false;
          } else {
              cityError.textContent = "";
          }
        // إذا كانت البيانات غير صحيحة أو مفقودة، منع الحفظ
        if (!formIsValid) {
            return;
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            Toastify({
                text: "You did not add any product",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#dc3545",
                stopOnFocus: true,
            }).showToast();
            return;
        }

        // التأكد من وجود خاصيتي history و bill للمستخدم
        if (!Array.isArray(currentUser.history)) {
            currentUser.history = [];
        }
        if (!Array.isArray(currentUser.bill)) {
            currentUser.bill = [];
        }

        // إنشاء فاتورة جديدة
        const newBill = {
            email: currentUser.email || "",
            name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`,
            phone: currentUser.phone || "",
            purchasedBooks: cart.map((item) => ({
                title: item.title,
                author: item.author,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        // إضافة الفاتورة الجديدة إلى bill
        currentUser.bill.push(newBill);

        // دمج عناصر السلة مع history
        currentUser.history = currentUser.history.concat(cart);

        // تقليل المخزون من الكتب
        cart.forEach((cartItem) => {
            const matchingBook = books.find((book) => book.title === cartItem.title && book.author === cartItem.author);
            if (matchingBook) {
                matchingBook.stock -= cartItem.quantity || 1;
                if (matchingBook.stock < 0) {
                    matchingBook.stock = 0; // التأكد من أن المخزون لا يصبح سالبًا
                }
            }
        });

        // تفريغ السلة
        currentUser.cart = [];

        // تحديث بيانات المستخدمين في localStorage
        const updatedUsers = users.map((user) => (user.email === currentUser.email ? currentUser : user));

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem("books", JSON.stringify(books)); // حفظ التحديثات على المخزون

        Toastify({
            text: "The order has been saved successfully",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "green",
            stopOnFocus: true,
        }).showToast();

        // إعادة التوجيه إلى صفحة المستخدم
        window.location.href = "../userprofile.html"; // تأكد من أن الرابط صحيح
    });
});





