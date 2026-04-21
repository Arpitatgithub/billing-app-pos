const API = "https://billing-app-pos.onrender.com";

// Add Product
async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Please enter all fields");
    return;
  }

  await fetch(`${API}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, price })
  });

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";

  loadProducts();
}

// Load Products
async function loadProducts() {
  const res = await fetch(`${API}/api/products`);
  const data = await res.json();

  const list = document.getElementById("productList");
  list.innerHTML = "";

  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - ₹${p.price}`;
    list.appendChild(li);
  });
}

// Initial load
loadProducts();