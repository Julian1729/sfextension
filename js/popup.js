const primaryLoginBtn = document.getElementById("primary-login-button");
const devLoginBtn = document.getElementById("primary-login-button");
const accountName = document.getElementById("account-name");

let wpDomain,
  wpUser,
  wpPass = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { code } = request;
  switch (request.code) {
    case "QUERY_SUCCESSFUL":
      console.log("popup got credentials found");
      wpDomain = request.wpDomain;
      wpUser = request.wpUser;
      wpPass = request.wpPass;
      primaryLoginBtn.removeAttribute("disabled");
      break;
    default:
      console.error(`${code} not matched`);
  }
});

// Primary Login Button Click
primaryLoginBtn.addEventListener("click", function() {
  chrome.runtime.sendMessage({ code: "LOGIN", wpDomain, wpUser, wpPass });
});

// Secondary Login Button Click
