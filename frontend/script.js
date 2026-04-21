const API = "https://billing-app-pos.onrender.com";
let selectedProduct = null;
let products = [];
let cart = [];

// Load products
async function loadProducts() {
  const res = await fetch(`${API}/api/products`);
  products = await res.json();

  console.log("Updated products:", products);

  const dropdown = document.getElementById('productList');
  dropdown.innerHTML = ""; // 🔥 VERY IMPORTANT

  products.forEach(p => {
    let option = document.createElement('option');
    option.value = p._id;
    option.text = `${p.name} (₹${p.price})`;
    dropdown.appendChild(option);
  });
}

window.onload = () => {
  loadProducts();
};

setInterval(() => {
  loadProducts();
}, 5000); // refresh every 5 seconds


function searchProduct() {
  const query = document.getElementById('search').value.toLowerCase();
  const results = document.getElementById('searchResults');

  results.innerHTML = "";

  let filtered = products;

  if (query) {
    filtered = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );
  }

  filtered.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('search-item');

    div.innerText = `${p.name} (₹${p.price})`;

    div.onclick = () => {
      selectedProduct = p;
      document.getElementById('search').value = p.name;
      results.innerHTML = "";
    };

    results.appendChild(div);
  });
}



function addItem() {
  const quantity = Number(document.getElementById('quantity').value);

  if (!selectedProduct) {
    alert("Select a product");
    return;
  }

  const existing = cart.find(item => item.productId === selectedProduct._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity
    });
  }

  selectedProduct = null;
  document.getElementById('search').value = "";
  document.getElementById('quantity').value = "";

  renderBill();
}


function printInvoice() {
  if (cart.length === 0) {
    alert("No items in bill");
    return;
  }

  let invoiceHTML = `
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial;
          padding: 20px;
        }
        h2 {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border-bottom: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }
        .total {
          margin-top: 20px;
          text-align: right;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>

      <h2>Invoice</h2>

      <table>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
  `;

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    invoiceHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>₹${itemTotal}</td>
      </tr>
    `;
  });

  invoiceHTML += `
      </table>

      <div class="total">
        Total: ₹${total}
      </div>

    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.print();
}

function renderBill() {
  const container = document.getElementById('billItems');
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('bill-item');

    div.innerHTML = `
      <span>${item.name}</span>

      <div class="controls">
        <button onclick="decreaseQty(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQty(${index})">+</button>
      </div>

      <span>₹${itemTotal}</span>

      <button class="remove-btn" onclick="removeItem(${index})">x</button>
    `;

    container.appendChild(div);
  });

  document.getElementById('total').innerText = total;
}

function showAllProducts() {
  const results = document.getElementById('searchResults');
  results.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('search-item');

    div.innerText = `${p.name} (₹${p.price})`;

    div.onclick = () => {
      selectedProduct = p;
      document.getElementById('search').value = p.name;
      results.innerHTML = "";
    };

    results.appendChild(div);
  });
}


function increaseQty(index) {
  cart[index].quantity += 1;
  renderBill();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeItem(index);
  }
  renderBill();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderBill();
}

async function saveBill() {
  const items = cart.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  await fetch('https://billing-app-pos.onrender.com/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });

  alert("Bill saved");

  cart = [];
  renderBill();
}

loadProducts();