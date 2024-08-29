chrome.runtime.onMessage.addListener((msg, sender, sendReponse) => {
  console.log(msg);
  console.log(sender);
  sendReponse("From the background script!");
});
