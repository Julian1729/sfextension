const wpLiveBtn = document.getElementById("wp-live-login-button");
const wpDevBtn = document.getElementById("wp-dev-login-button");
const accountName = document.getElementById("account-name");

let wpDomain,
  wpDevUrl,
  wpUser,
  wpPass = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { code } = request;
  switch (request.code) {
    case "QUERY_SUCCESSFUL":
      // TODO: check if the credentials exist,
      // and in storage not from message
      wpDomain = request.wpDomain;
      wpDevUrl = request.wpDevUrl;
      wpUser = request.wpUser;
      wpPass = request.wpPass;
      if (wpDomain) {
        wpLiveBtn.removeAttribute("disabled");
      }
      if (wpDevUrl) {
        wpDevBtn.removeAttribute("disabled");
      }
      break;
    default:
      console.error(`${code} not matched`);
  }
});

// WP Live Login Button Click
wpLiveBtn.addEventListener("click", function() {
  chrome.runtime.sendMessage({
    code: "WP_LOGIN_LIVE",
    wpDomain,
    wpUser,
    wpPass
  });
});

// WP Dev Login Button Click
wpDevBtn.addEventListener("click", function() {
  chrome.runtime.sendMessage({
    code: "WP_LOGIN_DEV",
    wpDevUrl,
    wpUser,
    wpPass
  });
});
