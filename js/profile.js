// document.querySelector("form").addEventListener("submit", function (event) {
//   event.preventDefault();

//   const currentPassword = document.getElementById("current-password").value;
//   const newPassword = document.getElementById("new-password").value;
  // const confirmPassword = document.getElementById("confirm-password").value;

//   if (!currentPassword || !newPassword || !confirmPassword) {
//     alert("All fields are required!");
//     return;
//   }

//   if (newPassword !== confirmPassword) {
//     alert("New password and confirm password do not match!");
//     return;
//   } 

//   alert("Password changed successfully!");
// });

// Select all sidebar links and sections
const sidebarLinks = document.querySelectorAll(".profile-links a");
const sections = document.querySelectorAll(".main-content .section");





// =====================================================

// Add event listeners to each sidebar link
sidebarLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
   
    sidebarLinks.forEach((link) => link.classList.remove("active"));
    sections.forEach((section) => section.classList.remove("active"));

    link.classList.add("active");
    sections[index].classList.add("active");
  });
});
// =================================================================================================

// fetech the imformation log file and show it
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
const users = JSON.parse(localStorage.getItem("users"));

// عرض الاسم في الحقل #username باستخدام firstName و lastName
if (currentUser.firstName || currentUser.lastName) {
    document.querySelector("#username").innerText = (currentUser.firstName || "") + " " + (currentUser.lastName || "");
} else {
    document.querySelector("#username").innerText = "";
}

// عرض الاسم في الحقول first-name و last-name
document.getElementById("first-name").value = currentUser.firstName || "";
document.getElementById("last-name").value = currentUser.lastName || "";
document.getElementById("email").value = currentUser.email || "";
document.getElementById("password").value = currentUser.password || "";
document.getElementById("phone").value = currentUser.phone || "";
document.getElementById("gender").value = currentUser.gender || "";

const updateBtn = document.getElementById("update-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

updateBtn.addEventListener("click", function () {
    document.getElementById("first-name").readOnly = false;
    document.getElementById("last-name").readOnly = false;
    document.getElementById("email").readOnly = false;
    document.getElementById("password").readOnly = false;
    document.getElementById("phone").readOnly = false;
    document.getElementById("gender").readOnly = false;

    updateBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
});

saveBtn.addEventListener("click", function () {
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const gender = document.getElementById("gender").value;

    let isValid = true;

    // إزالة رسائل الخطأ السابقة
    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    // التحقق من الاسم الأول والاسم الأخير
    const nameRegex = /^[A-Za-z\s]+$/; // فقط الحروف والمسافات مسموح بها
    if (!nameRegex.test(firstName)) {
        showError("first-name", "First name must contain only letters and spaces.");
        isValid = false;
    }
    if (!nameRegex.test(lastName)) {
        showError("last-name", "Last name must contain only letters and spaces.");
        isValid = false;
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // التأكد من أن البريد ينتهي بـ @gmail.com
    if (!emailRegex.test(email)) {
        showError("email", "Please enter a valid Gmail address.");
        isValid = false;
    }

    // التحقق من كلمة المرور
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; // التأكد من أن كلمة المرور تحتوي على حرف كبير وصغير ورمز خاص
    if (!passwordRegex.test(password)) {
        showError("password", "Password must contain at least one uppercase letter, one lowercase letter, and one special character.");
        isValid = false;
    }

    // التحقق من رقم الهاتف
    const phoneRegex = /^\d{11}$/; // التأكد من أن رقم الهاتف مكون من 11 رقم فقط
    if (!phoneRegex.test(phone)) {
        showError("phone", "Please enter a valid phone number (11 digits).");
        isValid = false;
    }

    // التحقق من تحديد الجنس
    if (!gender) {
        showError("gender", "Please select your gender.");
        isValid = false;
    }

    // إذا كانت جميع البيانات صحيحة، يتم حفظها
    if (isValid) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

        const updatedUser = {
            ...currentUser,
            firstName: firstName || currentUser.firstName,
            lastName: lastName || currentUser.lastName,
            email: email || currentUser.email,
            password: password || currentUser.password,
            phone: phone || currentUser.phone,
            gender: gender || currentUser.gender,
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map((user) => {
            if (user.email === currentUser.email) {
                return {
                    ...user,
                    firstName: firstName || user.firstName,
                    lastName: lastName || user.lastName,
                    email: email || user.email,
                    password: password || user.password,
                    phone: phone || user.phone,
                    gender: gender || user.gender,
                };
            }
            return user;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsers));

        document.getElementById("first-name").readOnly = true;
        document.getElementById("last-name").readOnly = true;
        document.getElementById("email").readOnly = true;
        document.getElementById("password").readOnly = true;
        document.getElementById("phone").readOnly = true;
        document.getElementById("gender").disabled = true;

        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    }
});

cancelBtn.addEventListener("click", function () {
    // استرجاع البيانات القديمة من localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    // إعادة القيم القديمة للحقول
    document.getElementById("first-name").value = currentUser.firstName || "";
    document.getElementById("last-name").value = currentUser.lastName || "";
    document.getElementById("email").value = currentUser.email || "";
    document.getElementById("password").value = currentUser.password || "";
    document.getElementById("phone").value = currentUser.phone || "";
    document.getElementById("gender").value = currentUser.gender || "";

    // إلغاء التعديل على الحقول وجعلها للقراءة فقط
    document.getElementById("first-name").readOnly = true;
    document.getElementById("last-name").readOnly = true;
    document.getElementById("email").readOnly = true;
    document.getElementById("password").readOnly = true;
    document.getElementById("phone").readOnly = true;
    document.getElementById("gender").disabled = true;

    // إخفاء زر "حفظ" و "إلغاء" وعرض زر "تحديث" مرة أخرى
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.createElement("span");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";
    errorMessage.textContent = message;
    field.parentNode.appendChild(errorMessage);
}

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("currentUser"); // Remove user data
    window.location.href = "./home.html"; // Redirect to home page
});





// ====================================

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const sellerDashboard = JSON.parse(localStorage.getItem("sellerDashboard"));

  if (currentUser && currentUser.role === "seller") {
    const profileLinks = document.getElementById("profileLinks");

    if (!document.getElementById("sellerDashboard")) {
      const sellerDashboardLink = document.createElement("li");
      const sellerDashboardAnchor = document.createElement("a");
      sellerDashboardAnchor.href = "#"; // Prevent default navigation
      sellerDashboardAnchor.id = "sellerDashboard";
      sellerDashboardAnchor.textContent = "Seller Dashboard";
      sellerDashboardAnchor.className = "btn-seller";

      sellerDashboardLink.appendChild(sellerDashboardAnchor);
      profileLinks.appendChild(sellerDashboardLink);

      // Add event listener to open modal on click
      sellerDashboardAnchor.addEventListener("click", function () {
        const modal = new bootstrap.Modal(document.getElementById("OpenSellerDash"));
        modal.show();
      });
    }
  }

  // Handle modal form submission
  const addNewRowForm = document.getElementById("addNewRowForm");
  addNewRowForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("SellerEmail").value;
    const dashboardId = document.getElementById("DashboardId").value;
    const password = document.getElementById("DashboardPassword").value;

    const seller = sellerDashboard.find(
      (seller) =>
        seller.email === email &&
        seller.dashboardId === dashboardId &&
        seller.dashboardPassword === password
    );
    
    if (seller) {
      window.location.href = `sellerDashboard.html?dashboardId=${seller.dashboardId}`
    } else {
      alert("Invalid credentials. Please try again.");
    }
  });

  // Populate order history (if available)
  const orderTableBody = document.querySelector("#order-history-table tbody");
  const history = currentUser.history || [];

  orderTableBody.innerHTML = ""; // Clear existing rows

  history.forEach((order) => {
    const row = document.createElement("tr");
    const orderDate = new Date().toLocaleDateString(); // You can add actual date if available

    row.innerHTML = `
            <td>${order.title}</td>
            <td>${order.author}</td>
            <td>$${order.price}</td>
            <td>${order.quantity}</td>
            <td>$${(order.price * order.quantity).toFixed(2)}</td>
            <td>${orderDate}</td>
        `;

    orderTableBody.appendChild(row);
  });
});

// ==================================================================
// show the password 
const togglePassword = document.getElementById("toggle-password");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", function () {
    // التبديل بين نوع الحقل (password و text)
    if (passwordField.type === "password") {
        passwordField.type = "text"; // عرض كلمة المرور
        togglePassword.classList.remove("fa-eye"); // إزالة الأيقونة الحالية
        togglePassword.classList.add("fa-eye-slash"); // إضافة الأيقونة الخاصة بالإخفاء
    } else {
        passwordField.type = "password"; // إخفاء كلمة المرور
        togglePassword.classList.remove("fa-eye-slash"); // إزالة الأيقونة الحالية
        togglePassword.classList.add("fa-eye"); // إضافة الأيقونة الخاصة بالعرض
    }
});
