const wpLiveBtn = document.getElementById("wp-live-login-button");
const wpDevBtn = document.getElementById("wp-dev-login-button");
const ftpLiveBtn = document.getElementById("ftp-live-login-button");
const accountName = document.getElementById("account-name");

let wpDomain,
  wpDevUrl,
  wpUser,
  wpPass,
  ftpIp,
  ftpUser,
  ftpPass = null;

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
      ftpIp = request.ftpIp;
      ftpUser = request.ftpUser;
      ftpPass = request.ftpPass;
      console.log("ftpIp", ftpIp);
      console.log("ftpUser", ftpUser);
      console.log("ftpPass", ftpPass);
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

ftpLiveBtn.addEventListener("click", function() {
  chrome.runtime.sendMessage({
    ftpIp,
    ftpUser,
    ftpPass,
    code: "FTP_LOGIN_LIVE"
  });
});
