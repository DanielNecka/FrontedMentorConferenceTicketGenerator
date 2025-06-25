"use strict";

const sendButton = document.querySelector('.sendBtn');
const avatarInputDiv = document.querySelector('#avatarInput');
const avatarFileInput = document.querySelector('#avatar');

sendButton.addEventListener('click', validateData);

setupDragAndDrop(avatarInputDiv, avatarFileInput);

function setupDragAndDrop(dropArea, fileInput) {
    dropArea.addEventListener('dragover', e => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', e => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            fileInput.files = e.dataTransfer.files;

            const reader = new FileReader();
            reader.onload = ev => {
                dropArea.querySelector('.avatarImg').style.background = `url('${ev.target.result}') no-repeat center / cover`;
            };
            reader.readAsDataURL(file);
        }
    });
}

function validateData() {
    const avatar = avatarFileInput.value;
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const gitHubName = document.querySelector('#gitHubName').value;

    if (!avatar) {
        avatarInputDiv.classList.add('inputError');
    }

    if (!name) {
        document.querySelector('#nameInput').classList.add('inputError');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector('#emailInput').classList.add('inputError');
        document.querySelector('.emailMsg').style.display = 'flex';
    }

    if (!gitHubName) {
        document.querySelector('#gitHubNameInput').classList.add('inputError');
    }
}
