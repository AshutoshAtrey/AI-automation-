
function detectFormFields() {
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

  return Array.from(fields)
    .filter(field => {
      const type = (field.type || "").toLowerCase();

      return (
        field.getClientRects().length > 0 &&
        !["hidden", "password", "file"].includes(type)
      );
    })
    .map((field, index) => {
      const parent = field.closest(
        "label, fieldset, .form-group, .question"
      ) || field.parentElement;

      return {
        index,
        type: field.type || field.tagName.toLowerCase(),
        name: field.name,
        label:
          field.labels?.[0]?.innerText ||
          field.getAttribute("aria-label") ||
          "",
        question: parent?.innerText?.trim().slice(0, 500) || "",
        placeholder: field.placeholder || "",
        required: field.required,
        options: field.tagName === "SELECT"
          ? Array.from(field.options).map(option => option.text)
          : []
      };
    });
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "SCAN_FORMS") {
      sendResponse({
        success: true,
        fields: detectFormFields()
      });
    }
  }
);

console.log("Universal AI Form Assistant ready!");
