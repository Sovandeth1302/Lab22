const modal = document.getElementById("modal");
      const modalTitle = document.getElementById("modal-title");
      const modalInputContainer = document.getElementById(
        "modal-input-container"
      );
      const modalInput = document.createElement("input");

      let currentStep = 0;
      const formData = {};

      const steps = [
        { title: "បំពេញឈ្មោះ", key: "username" },
        { title: "បំពេញលេខសម្គាល់", key: "userId" },
        {
          title: "អំណានចាស់់",
          key: "oldValue",
          type: "number",
        },
        {
          title: "អំណានថ្មី",
          key: "newValue",
          type: "number",
        },
        { title: "រួមបញ្ចូលថ្លៃសំរាម? (yes/no:", key: "includeTrash" },
        {
          title: "ជ្រើសរើសតម្លៃ:",
          key: "trashBill",
          condition: () => formData.includeTrash,
          type: "radio",
          options: ["10000", "20000", "30000"],
        },
      ];

      function startForm() {
        currentStep = 0;
        showModal();
      }

      function showModal() {
        const step = steps[currentStep];
        modalTitle.textContent = step.title;

        modalInputContainer.innerHTML = "";

        if (step.type === "radio" && step.options) {
          step.options.forEach((option) => {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "trashBillOptions";
            radio.value = option;
            radio.id = `option-${option}`;

            const label = document.createElement("label");
            label.htmlFor = `option-${option}`;
            label.textContent = option;

            const wrapper = document.createElement("div");
            wrapper.appendChild(radio);
            wrapper.appendChild(label);

            modalInputContainer.appendChild(wrapper);
          });
        } else {
          modalInput.type = step.type || "text";
          modalInput.id = "modal-input";
          modalInput.value = "";
          modalInputContainer.appendChild(modalInput);
        }

        modal.classList.add("active");
      }

      function hideModal() {
        modal.classList.remove("active");
      }

      function submitModal() {
        const step = steps[currentStep];
        let value;

        if (step.type === "radio" && step.options) {
          const selectedOption = document.querySelector(
            'input[name="trashBillOptions"]:checked'
          );
          if (!selectedOption) {
            alert("Please select a trash bill amount.");
            return;
          }
          value = selectedOption.value;
        } else {
          value = modalInput.value.trim();
          if (!value) {
            alert("Input is required.");
            return;
          }
        }

        if (
          step.key === "includeTrash" &&
          !["yes", "no"].includes(value.toLowerCase())
        ) {
          alert('Please enter "yes" or "no".');
          return;
        }

        formData[step.key] =
          step.key === "includeTrash" ? value.toLowerCase() === "yes" : value;

        hideModal();
        currentStep++;

        while (
          currentStep < steps.length &&
          steps[currentStep].condition &&
          !steps[currentStep].condition()
        ) {
          currentStep++;
        }

        if (currentStep < steps.length) {
          showModal();
        } else {
          generateInvoice();
        }
      }

      function cancelModal() {
        hideModal();
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
        const oldValue = parseFloat(formData.oldValue);
        const newValue = parseFloat(formData.newValue);
        const unitsUsed = newValue - oldValue;

        if (unitsUsed < 0) {
          alert(
            "New meter value must be greater than or equal to old meter value."
          );
          return;
        }

        const electricityCharge = calculateElectricityCharge(unitsUsed);
        const trashCharge = formData.includeTrash
          ? parseFloat(formData.trashBill || 0)
          : 0;
        const totalBill = electricityCharge + trashCharge;

        const invoiceHtml = `
          <h2>វិកយ័បត្រ</h2>
          <p><strong>ឈ្មោះ:</strong> ${formData.username}</p>
          <p><strong>ID:</strong> ${formData.userId}</p>
          <p><strong>ថាមពលប្រើប្រាស់:</strong> ${unitsUsed}</p>
          <p><strong>តម្លៃថាមពលសរុប:</strong> ${electricityCharge.toLocaleString()} R</p>
          <p><strong>ថ្លៃសំរាម:</strong> ${trashCharge.toLocaleString()} R</p>
          <p><strong>សរុប:</strong> ${totalBill.toLocaleString()} R</p>
        `;

        document.getElementById("invoice").innerHTML = invoiceHtml;
      }