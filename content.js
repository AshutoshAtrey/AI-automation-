
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
    .map((field, index) => ({
      index,
      type: field.type || field.tagName.toLowerCase(),
      name: field.name,
      placeholder: field.placeholder || "",
      label:
        field.labels?.[0]?.innerText ||
        field.getAttribute("aria-label") ||
        "",
      required: field.required
    }));
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
