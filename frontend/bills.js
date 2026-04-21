const API = "https://billing-app-pos.onrender.com";

async function loadBills() {
  try {
    const res = await fetch(`${API}/api/bills`);
    const bills = await res.json();

    console.log("Bills from API:", bills); // DEBUG

    const container = document.getElementById("billsContainer");

    if (!container) {
      console.error("❌ billsContainer not found");
      return;
    }

    container.innerHTML = "";

    if (bills.length === 0) {
      container.innerHTML = "<p>No bills found</p>";
      return;
    }

    bills.forEach((bill, index) => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.margin = "10px";
      div.style.padding = "10px";

      let itemsHTML = "";

      bill.items.forEach(item => {
        itemsHTML += `
          <li>${item.name} - ₹${item.price} x ${item.quantity}</li>
        `;
      });

      div.innerHTML = `
        <h3>Bill #${index + 1}</h3>
        <ul>${itemsHTML}</ul>
        <strong>Total: ₹${bill.totalAmount}</strong>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading bills:", err);
  }
}

// 🔥 IMPORTANT
window.onload = loadBills;