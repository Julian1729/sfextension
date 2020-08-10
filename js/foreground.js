(() => {
  // "Website Management" section data fields
  // const dataTable = document.querySelector('#head_01B5000000AJpB7_ep .pbSubsection table.detailList');
  // const dataFields = dataTable.querySelectorAll('td.dataCol');
  // const dataFieldMap = (fields => {
  //   let map = {};
  //   for (var i = 0; i < fields.length; i++) {
  //     const id =  fields[i].getAttribute('id');
  //     const value = fields[i].textContent
  //   }
  //
  // })(dataFields);

  const wpDomain = document
    .querySelector("#acc12_ileinner a")
    .getAttribute("href");
  // cannot use querySelector below for id stargin with number and SF using HTML4
  const wpUser = document.getElementById("00N50000009rrvc_ilecell")
    .firstElementChild.textContent;
  const wpPass = document.getElementById("00N50000009rs1Q_ilecell")
    .firstElementChild.textContent;

  console.log("domain", wpDomain);
  console.log("wpUser", wpUser);
  console.log("wpPass", wpPass);
  console.log("d");
})();
