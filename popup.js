
const scanButton = document.getElementById("scanButton");
const status = document.getElementById("status");

scanButton.addEventListener("click", async () => {
  status.textContent = "Scanning website...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const response = await chrome.tabs.sendMessage(
      tab.id,
      { action: "SCAN_FORMS" }
    );

    if (response && response.success) {
      status.textContent =
        "Found " + response.fields.length + " form fields.";

      console.log(response.fields);
    }
  } catch (error) {
    status.textContent =
      "Unable to scan this page. Try another website.";
  }
});
