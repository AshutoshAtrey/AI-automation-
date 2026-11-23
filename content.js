
function detectFormFields() {
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

  const results = [];

  fields.forEach((field, index) => {
    if (!field.getClientRects().length) return;

    results.push({
      index: index,
      type: field.type || field.tagName.toLowerCase(),
      name: field.name,
      placeholder: field.placeholder,
      label: field.labels?.[0]?.innerText || "",
      required: field.required
    });
  });

  console.log("Detected form fields:", results);

  return results;
}

console.log("Universal AI Form Assistant loaded");
                 
