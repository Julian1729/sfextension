const isSFAccountPage = async tabId => {
  return new Promise(resolve => {
    // regex only for classic, not lightning
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
    case "WP_LOGIN_LIVE":
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
      break;
    case "WP_LOGIN_DEV":
      const { wpDevUrl } = request;
      // OPTIMIZE: remove trailing slash if it exists
      // create new tab and append "/wp-admin" to url
      createTab(`${wpDevUrl}/wp-admin`)
        .then(tab => {
          // inject form automation script
          chrome.tabs.executeScript(tab.id, {
            file: "./js/automateFormLogin.js"
          });
        })
        .catch(e => console.error(e));
      break;
    case "FTP_LOGIN_LIVE":
      // TODO: get default ftp client
      const configFile = chrome.runtime.getURL(
        "ftp-config-files/cyberduck.duck"
      );
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          let xmlDoc = xhttp.responseXML; //important to use responseXML here
          // convert to string
          let serialize = new XMLSerializer();
          let xmlText = serialize.serializeToString(xmlDoc.getRootNode());
          xmlText = xmlText.replace("{{hostname}}", request.ftpIp);
          xmlText = xmlText.replace("{{username}}", request.ftpUser);
          xmlText = xmlText.replace("{{password}}", request.ftpPass);
          // convert back to xml
          xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
          const blob = new Blob([xmlDoc], { type: "text/xml" });
          const url = URL.createObjectURL(blob);
          chrome.downloads.download({
            url: url,
            saveAs: false
          });
        }
      };
      xhttp.open("GET", configFile, true);
      xhttp.send();
      break;
    default:
  }
});

// chrome.downloads.onDeterminingFilename.addListener(
//   ({ filename, conflictAction }) => {
//     filename = ;
//   }
// );

chrome.downloads.onDeterminingFilename.addListener(({ filename }) => {
  filename = filename;
});

chrome.downloads.onChanged.addListener(downloadDelta => {
  if (downloadDelta.state && downloadDelta.state.current === "complete") {
    console.log("opening file");
    chrome.downloads.open(downloadDelta.id);
    // FIXME: remove file after opened
    // chrome.downloads.removeFile(downloadDelta.id, () => {
    //   // erase file
    //   chrome.downloads.erase({ id: downloadDelta.id });
    // });
  }
});
