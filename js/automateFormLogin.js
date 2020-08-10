const getCredentials = () =>
  new Promise((resolve, reject) => {
    chrome.storage.local.get(null, data => {
      user = data.wpUser;
      pass = data.wpPass;
      if (user && pass && user !== "" && pass !== "") {
        resolve({ user, pass });
      } else {
        reject("Credentials not found in storage");
      }
      chrome.storage.local.clear();
    });
  });

const submitForm = ({ user, pass }) => {
  const loginForm = document.getElementById("loginform");
  const usernameField = document.getElementById("user_login");
  const passwordField = document.getElementById("user_pass");

  usernameField.value = user;
  passwordField.value = pass;

  document.getElementById("wp-submit").click();

  // loginForm.submit();
};

getCredentials()
  .then(submitForm)
  .catch(e => {
    alert(
      'Sorry, no credentials found, try going back and checking the "Web Development Notes" field in Salesforce for updated credentials.'
    );
  });
