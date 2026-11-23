
const scanButton = document.getElementById("scanButton");
const status = document.getElementById("status");
const results = document.getElementById("results");

scanButton.addEventListener("click", async () => {
  status.textContent = "Reading questions...";
  results.replaceChildren();

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const response = await chrome.tabs.sendMessage(
      tab.id,
      { action: "SCAN_FORMS" }
    );

    if (!response || !response.success) {
      throw new Error("Scan failed");
    }

    const fields = response.fields;

    status.textContent = `Found ${fields.length} fields.`;

    fields.forEach((field) => {
      const card = document.createElement("div");
      card.className = "field";

      const question = document.createElement("h4");
      question.textContent =
        field.question || field.label || `Question ${field.index + 1}`;

      const type = document.createElement("p");
      type.textContent = `Type: ${field.type}`;

      card.append(question, type);

      if (field.options && field.options.length) {
        const optionList = document.createElement("ul");

        field.options.forEach(option => {
          const li = document.createElement("li");
          li.textContent = option;
          optionList.appendChild(li);
        });

        card.appendChild(optionList);
      }

      results.appendChild(card);
    });

    if (fields.length === 0) {
      results.textContent = "No form fields found.";
    }

  } catch (error) {
    status.textContent = "Unable to scan this page.";
  }
});
    
