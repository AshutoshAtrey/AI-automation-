
const scanButton = document.getElementById("scanButton");
const copyButton = document.getElementById("copyButton");
const openButton = document.getElementById("openButton");
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

    status.textContent = `Found ${latestFields.length} fields.`;

    latestFields.forEach((field, index) => {
      const card = document.createElement("div");
      card.className = "field";

      const question = document.createElement("h4");
      question.textContent =
        field.question || field.label || `Question ${index + 1}`;

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
  if (!latestFields.length) return;

  const questions = latestFields.map((field, index) => `
Question ${index + 1}: ${field.question || field.label || "Not available"}
Type: ${field.type}
Options: ${field.options?.join(", ") || "None"}
  `).join("\n");

  const prompt = `
You are helping me understand and complete a questionnaire.

Please:
1. Read every question carefully.
2. Suggest accurate answers based on information I provide.
3. Do not invent personal information or guess unknown facts.
4. Ask me when an answer requires information I have not provided.
5. Explain multiple-choice suggestions briefly.

Return answers in numbered order.

QUESTIONNAIRE:
${questions}
`;

  try {
    await navigator.clipboard.writeText(prompt);
    status.textContent = "AI prompt copied! Open ChatGPT.";
  } catch (error) {
    status.textContent = "Copy failed. Try again.";
  }
});

openButton.addEventListener("click", async () => {
  await chrome.tabs.create({
    url: "https://chatgpt.com/"
  });
});
    
