"use strict";
dragAndDropInput();
validateData();

function dragAndDropInput() {
    const dropZone = document.getElementById("dragDrop");
    const avatar = document.querySelector('#avatar');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        dropZone.addEventListener(event, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        avatar.files = files;
        changeImg(files[0]);
    });

    avatar.addEventListener('change', () => {
        const file = avatar.files[0];
            
        changeImg(file);
    });

    function changeImg(file) {
        if (file) {
            const preview = document.querySelector('.avatarImg');
            const imageUrl = URL.createObjectURL(file);
            preview.style.backgroundImage = `url(${imageUrl})`;
            preview.style.backgroundRepeat = 'no-repeat';
            preview.style.backgroundPosition = 'center';
            preview.style.backgroundSize = '60px 60px';

            const text = document.querySelector('.avatarText');
            text.innerHTML = 'Avatar uploaded successfully';
        };
    }
}

function validateData() {
    const avatar = document.querySelector('#avatar');
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const gitHubName = document.querySelector('#gitHubName');

    const sendButton = document.querySelector('.sendBtn');

    let isNameValid = false;
    let isEmailValid = false;
    let isGitHubValid = false;
    let isAvatarValid = false;

    function checkAllValid() {
        return isNameValid && isEmailValid && isGitHubValid && isAvatarValid;
    }

    name.addEventListener('focusout', () => {
        const namePattern = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+ [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/;

        if (!namePattern.test(name.value.trim())) {
            document.querySelector('#nameInput').classList.add('inputError');
            isNameValid = false;
        } else {
            document.querySelector('#nameInput').classList.remove('inputError');
            isNameValid = true;
        }
    });

    email.addEventListener('focusout', () => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email.value.trim())) {
            document.querySelector('#emailInput').classList.add('inputError');
            document.querySelector('.emailMsg').style.display = 'flex';
            isEmailValid = false;
        } else {
            document.querySelector('#emailInput').classList.remove('inputError');
            document.querySelector('.emailMsg').style.display = 'none';
            isEmailValid = true;
        }
    });

    gitHubName.addEventListener('focusout', () => {
        const githubPattern = /^@[\w.-]+$/;

        if (!githubPattern.test(gitHubName.value.trim())) {
            document.querySelector('#gitHubNameInput').classList.add('inputError');
            isGitHubValid = false;
        } else {
            document.querySelector('#gitHubNameInput').classList.remove('inputError');
            isGitHubValid = true;
        }
    });

    avatar.addEventListener('change', () => {
        if (avatar.files.length > 0) {
            document.querySelector('.avatarInput').classList.remove('avatarInputError');
            document.querySelector('.avatarMsg').classList.remove('textErrorMsg');
            document.querySelector('.msgImg').classList.remove('redIcon');

            isAvatarValid = true;
        } else {
            document.querySelector('.avatarInput').classList.add('avatarInputError');
            document.querySelector('.avatarMsg').classList.add('textErrorMsg');
            document.querySelector('.msgImg').classList.add('redIcon');

            isAvatarValid = false;
        }
    });

    sendButton.addEventListener('click', () => {
        name.dispatchEvent(new Event('focusout'));
        email.dispatchEvent(new Event('focusout'));
        gitHubName.dispatchEvent(new Event('focusout'));
        avatar.dispatchEvent(new Event('change'));

        if (checkAllValid()) {
            const ticketNumber = generateTicketNumber();

            changeViev(name.value, email.value, avatar.files[0], gitHubName.value, ticketNumber);
        } 
    });
}

function generateTicketNumber() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

function changeViev(name, email, avatar, gitHubName, ticketNumber) {
    document.querySelector('.content').remove();
    document.querySelector('.result').style.display = 'flex';

    document.querySelector('.userName').innerText = name;
    document.querySelector('.userEmail').innerText = email;
    
    document.querySelector('.userAvatar').style.backgroundImage = `url(${URL.createObjectURL(avatar)})`;
    document.querySelector('.userAvatar').style.backgroundSize = 'cover';
    document.querySelector('.userAvatar').style.backgroundPosition = 'center';
    document.querySelector('.userAvatar').style.backgroundRepeat = 'no-repeat';

    document.querySelector('#ticketName').innerText = name;
    document.querySelector('#gitHubNameTicket').innerText = gitHubName;
    document.querySelector('.number').innerText = "#" + ticketNumber;

    downloadTicket(email);
}

async function downloadTicket(email) {
    const ticket = document.querySelector('.ticket');
    const canvas = await html2canvas(ticket, {  
        scale: 10,
        useCORS: true,
        logging: true,
        backgroundColor: '#120235'
    });

    const imageData = canvas.toDataURL('image/png');
    sendData(email, imageData);
}

function sendData(email, imageData) {
    fetch('https://serverforfrontedmentorconferenceticketge.onrender.com/sendTicket', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            email: email,
            image: imageData.split(',')[1] 
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Email sent:', data);
    })
    .catch(err => {
        console.error('Error sending email:', err);
    });
}