
const scanButton = document.getElementById("scanButton");
const copyButton = document.getElementById("copyButton");
const status = document.getElementById("status");
const results = document.getElementById("results");

let latestFields = [];

copyButton.disabled = true;

scanButton.addEventListener("click", async () => {
  status.textContent = "Scanning website...";
  results.replaceChildren();
  latestFields = [];
  copyButton.disabled = true;

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

    latestFields = response.fields;

    status.textContent =
      `Found ${latestFields.length} fields.`;

    latestFields.forEach(field => {
      const card = document.createElement("div");
      card.className = "field";

      const question = document.createElement("h4");
      question.textContent =
        field.question ||
        field.label ||
        `Question ${field.index + 1}`;

      const type = document.createElement("p");
      type.textContent = `Type: ${field.type}`;

      card.append(question, type);

      if (field.options?.length) {
        const list = document.createElement("ul");

        field.options.forEach(option => {
          const item = document.createElement("li");
          item.textContent = option;
          list.appendChild(item);
        });

        card.appendChild(list);
      }

      results.appendChild(card);
    });

    copyButton.disabled = latestFields.length === 0;

    if (latestFields.length === 0) {
      results.textContent = "No form fields found.";
    }

  } catch (error) {
    status.textContent = "Unable to scan this page.";
  }
});

copyButton.addEventListener("click", async () => {
  if (latestFields.length === 0) {
    status.textContent = "Scan a website first.";
    return;
  }

  const text = latestFields.map((field, index) => {
    return [
      `Question ${index + 1}:`,
      field.question || field.label || "Not available",
      `Type: ${field.type}`,
      `Options: ${field.options?.join(", ") || "None"}`
    ].join("\n");
  }).join("\n\n");

  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Questions copied successfully!";
  } catch (error) {
    status.textContent = "Copy failed. Try again.";
  }
});
            
