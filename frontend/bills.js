async function loadBills() {
  const res = await fetch('http://localhost:3000/api/bills');
  const bills = await res.json();

  const container = document.getElementById('billList');
  container.innerHTML = "";

  bills.forEach((bill, index) => {
    const div = document.createElement('div');
    div.classList.add('bill-card');

    div.innerHTML = `
      <h3>Bill #${index + 1}</h3>
      <p>Date: ${new Date(bill.createdAt).toLocaleString()}</p>
      <p>Total: ₹${bill.totalAmount}</p>
      <button onclick="viewBill(${index})">View</button>
    `;

    container.appendChild(div);
  });

  window.allBills = bills;
}

function viewBill(index) {
  const bill = window.allBills[index];

  let details = "Items:\n";

  bill.items.forEach(item => {
    details += `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });

  details += `\nTotal: ₹${bill.totalAmount}`;

  alert(details);
}

function goBack() {
  window.location.href = "index.html";
}

loadBills();