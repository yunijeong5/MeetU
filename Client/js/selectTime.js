function populateFields() {
    let sentData = JSON.parse(localStorage.getItem("serializedRes"));
    console.log(sentData);
}

populateFields();