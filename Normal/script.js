function toggleTrashOptions() {
    const trashOptions = document.querySelectorAll(
      'input[name="trash-bill"]'
    );
    const includeTrash = document.getElementById("include-trash").checked;

    trashOptions.forEach((option) => {
      option.disabled = !includeTrash;
    });

    if (!includeTrash) {
      trashOptions.forEach((option) => (option.checked = false));
    }
  }

  function calculateElectricityCharge(units) {
    let charge = 0;
    if (units <= 50) {
      charge = units * 500;
    } else if (units <= 100) {
      charge = 50 * 500 + (units - 50) * 1000;
    } else if (units <= 150) {
      charge = 50 * 500 + 50 * 1000 + (units - 100) * 1500;
    } else if (units <= 200) {
      charge = 50 * 500 + 50 * 1000 + 50 * 1500 + (units - 150) * 2000;
    } else {
      charge =
        50 * 500 +
        50 * 1000 +
        50 * 1500 +
        50 * 2000 +
        (units - 200) * 25000;
    }
    return charge;
  }

  function generateInvoice() {
    const username = document.getElementById("username").value;
    const userId = document.getElementById("user-id").value;
    const oldValue = parseFloat(document.getElementById("old-value").value);
    const newValue = parseFloat(document.getElementById("new-value").value);
    const includeTrash = document.getElementById("include-trash").checked;
    const trashBill = document.querySelector(
      'input[name="trash-bill"]:checked'
    );

    if (isNaN(oldValue) || isNaN(newValue)) {
      alert("Please enter valid numeric values for meter readings.");
      return;
    }

    const unitsUsed = newValue - oldValue;
    if (unitsUsed < 0) {
      alert(
        "New meter value must be greater than or equal to old meter value."
      );
      return;
    }

    const electricityCharge = calculateElectricityCharge(unitsUsed);
    const trashCharge =
      includeTrash && trashBill ? parseFloat(trashBill.value) : 0;
    const totalBill = electricityCharge + trashCharge;
    const invoiceHtml = `
    <h2>វិកាយ័បត្រ</h2>
    <p><strong>ឈ្មោះ:</strong> ${username}</p>
    <p><strong>ID:</strong> ${userId}</p>
    <p><strong>ថាមពលប្រើប្រាស់:</strong> ${unitsUsed}</p>
    <p><strong>តម្លៃថាមពលសរុប:</strong> ${electricityCharge.toLocaleString()} R</p>
    <p><strong>ថ្លៃសំរាម:</strong> ${trashCharge.toLocaleString()} R</p>
    <p><strong>សរុប:</strong> ${totalBill.toLocaleString()} R</p>
`;

    document.getElementById("invoice").innerHTML = invoiceHtml;
  }