// console.log(document.getElementById(identifier).value);
document.getElementById('search-button').addEventListener('onsubmit', function() {
    var uinput = document.getElementById('identifier').value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/identifier");
    xhr.setRequestHeader("Content-Type", "application/json");
    const payload = JSON.stringify({identifier: uinput});
    console.log("Payload" + payload);
    xhr.send(payload);
});
