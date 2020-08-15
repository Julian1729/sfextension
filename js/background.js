const isSFAccountPage = async tabId => {
  return new Promise(resolve => {
    const sfClassicPattern = new RegExp(
      /^https?:\/\/[www]?na62.salesforce.com\/[^home][^_ui]\w+/
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
    chrome.tabs.executeScript(tabId, { file: "./js/queryCredentials.js" });
  }
};

chrome.tabs.onUpdated.addListener(loadQueryScript);

function createTab(url) {
  return new Promise(resolve => {
    chrome.tabs.create({ url }, async tab => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === "complete" && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

/**
 * Event Listeners
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { code } = request;
  switch (code) {
    case "LOGIN":
      const { wpDomain } = request;
      // create new tab
      createTab(`${wpDomain}/wp-admin`)
        .then(tab => {
          // inject form automation script
          chrome.tabs.executeScript(tab.id, {
            file: "./js/automateFormLogin.js"
          });
        })
        .catch(e => console.error(e));
    default:
  }
});
