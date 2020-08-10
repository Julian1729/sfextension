/**
 * Query DOM for domain, user, pass
 * and send to background for new tab
 */
const wpDomain = document
  .querySelector("#acc12_ileinner a")
  .getAttribute("href");
// cannot use querySelector below for id stargin with number and SF using HTML4
const wpUser = document.getElementById("00N50000009rrvc_ilecell")
  .firstElementChild.textContent;
const wpPass = document.getElementById("00N50000009rs1Q_ilecell")
  .firstElementChild.textContent;
if (wpDomain && wpUser && wpPass) {
  // save to storage
  chrome.storage.local.set({ wpDomain, wpPass, wpUser });
  // send credentials
  chrome.runtime.sendMessage({
    code: 1,
    wpDomain,
    wpUser,
    wpPass
  });
} else {
  chrome.runTime.sendMessage({
    code: 2,
    message: "No credentials found."
  });
}
