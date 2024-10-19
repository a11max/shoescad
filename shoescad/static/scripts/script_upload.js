document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('uploadButton').addEventListener('click', submitForm);
});

function submitForm(event) {
    event.preventDefault();

    let form = document.getElementById('uploadForm');
    let formData = new FormData(form);

    let additionalFileInput = document.getElementById('fileInput');
    if (additionalFileInput.files.length > 0) {
        formData.append('fileInput', additionalFileInput.files[0]);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text();
        }
    }).then(data => {
        if (data) {
            alert(data);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}
