const isSFAccountPage = async tabId => {
  return new Promise(resolve => {
    const sfClassicPattern = new RegExp(
      /^https?:\/\/[www]?na62.salesforce.com\/\w+/
    );

    chrome.tabs.get(tabId, ({ url }) => {
      if (sfClassicPattern.test(url)) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

const loadQueryScript = async (tabId, changeInfo, tab) => {
  // may be tab object or tab id
  const isPage = await isSFAccountPage(tabId);
  if (!isPage) return;
  if (changeInfo.status === "complete") {
    // inject script
    chrome.tabs.executeScript(tabId, { file: "./js/foreground.js" });
  }
};

chrome.tabs.onUpdated.addListener(loadQueryScript);
// chrome.tabs.onActivated.addListener(loadQueryScript);
