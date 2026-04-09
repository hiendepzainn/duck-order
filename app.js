const scriptURL =
  "https://script.google.com/macros/s/AKfycbxsB__SBt9ULiRRWNTbx1Bo4wb7FcORTOAdRFqG7MEpIk41rDjKmJ44lIuRdDW-nXRQVg/exec"; // DÁN LINK APPS SCRIPT VÀO ĐÂY
const menuData = [
  { name: "Vịt quay cả con", price: 320, unit: "k" },
  { name: "Vịt quay 1/2 con", price: 160, unit: "k" },
  { name: "Vịt quay 1/4 con - đùi", price: 100, unit: "k" },
  { name: "Vịt quay 1/4 con - ức", price: 80, unit: "k" },
  { name: "Bún vịt quay nước", price: 45, unit: "k" },
  { name: "Bún vịt quay trộn", price: 45, unit: "k" },
  { name: "Cơm vịt quay", price: 50, unit: "k" },
];

const menuList = document.getElementById("menu-list");

// Hiển thị thực đơn
menuData.forEach((item, index) => {
  menuList.innerHTML += `
            <div class="card menu-card">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <div class="price">${item.price}${item.unit}</div>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" class="form-control quantity-input" 
                               data-name="${item.name}" value="0" min="0">
                    </div>
                </div>
            </div>
        `;
});

const form = document.getElementById("order-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Tổng hợp đơn hàng
  let summary = "";
  let hasItems = false;
  document.querySelectorAll(".quantity-input").forEach((input) => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      summary += `${input.getAttribute("data-name")}: ${qty}\n`;
      hasItems = true;
    }
  });

  if (!hasItems) {
    Swal.fire("Opps!", "Bạn chưa chọn món nào cả!", "warning");
    return;
  }

  document.getElementById("order-summary").value = summary;
  document.getElementById("submit-btn").disabled = true;

  // Hiệu ứng Loading
  Swal.fire({
    title: "Đang gửi đơn hàng...",
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
  });

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        text: "Cửa hàng đã nhận đơn, vịt sẽ được giao ngay tới bạn!",
        confirmButtonColor: "#d63031",
      });
      form.reset();
      document.getElementById("submit-btn").disabled = false;
    })
    .catch((error) => {
      Swal.fire(
        "Lỗi rồi!",
        "Không gửi được đơn hàng, vui lòng gọi hotline.",
        "error",
      );
      document.getElementById("submit-btn").disabled = false;
    });
});
