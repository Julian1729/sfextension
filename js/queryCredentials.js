/**
 * Query DOM for domain, user, pass
 * and send to background for new tab
 */

const noCredentials = msg => alert(msg || "No credentials found");

let wpDomain,
  wpDevUrl,
  wpUser,
  wpPass = null;

// search for live url
const wpLiveUrlEl = document.querySelector("#acc12_ileinner a");
if (wpLiveUrlEl) {
  wpDomain = wpLiveUrlEl.getAttribute("href");
} else {
  noCredentials();
}

const wpDevUrlEl = document
  .getElementById("00N50000007cXvS_ileinner")
  .querySelector("a");
if (wpDevUrlEl) {
  wpDevUrl = wpDevUrlEl.getAttribute("href");
}

// cannot use querySelector below for id stargin with number and SF using HTML4
const wpUserEl = document.getElementById("00N50000009rrvc_ilecell")
  .firstElementChild;
if (wpUserEl) {
  wpUser = wpUserEl.textContent;
}
const wpPassEl = document.getElementById("00N50000009rs1Q_ilecell")
  .firstElementChild;
if (wpPassEl) {
  wpPass = wpPassEl.textContent;
}

// check that all required credentials have a value
if (wpDomain && wpUser && wpPass) {
  // save to storage
  chrome.storage.local.set({ wpDomain, wpDevUrl, wpPass, wpUser });
  // send credentials
  chrome.runtime.sendMessage({
    code: "QUERY_SUCCESSFUL",
    wpDomain,
    wpDevUrl,
    wpUser,
    wpPass
  });
} else {
  alert("No credentials found.");
}
