
const scanButton = document.getElementById("scanButton");
const status = document.getElementById("status");
const results = document.getElementById("results");

scanButton.addEventListener("click", async () => {
  status.textContent = "Scanning website...";
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

    status.textContent =
      `Found ${fields.length} form fields.`;

    if (fields.length === 0) {
      results.textContent = "No visible form fields found.";
      return;
    }

    fields.forEach((field) => {
      const item = document.createElement("div");
      item.className = "field";

      const heading = document.createElement("strong");
      heading.textContent = `Field ${field.index + 1}`;

      const details = document.createElement("p");
      details.textContent =
        `Type: ${field.type} | Label: ${field.label || "Not available"} | Placeholder: ${field.placeholder || "None"}`;

      item.append(heading, details);
      results.appendChild(item);
    });

  } catch (error) {
    status.textContent =
      "Unable to scan this page. Try another website.";
  }
});
      
