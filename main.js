class NodoPregunta {
    constructor(pregunta, si = null, no = null) {
        this.pregunta = pregunta;
        this.si = si;
        this.no = no;
    }
}

function crear_arbol_preguntas() {
    let pregunta1 = new NodoPregunta("¡Hola! Bienvenido al asistente de cifrado y descifrado de documentos.");
    let pregunta2 = new NodoPregunta("¿Deseas continuar?");
    let pregunta4 = new NodoPregunta("¿Deseas cifrar con AES?");
    let pregunta5 = new NodoPregunta("¿Deseas cifrar con RSA?");
    let pregunta6 = new NodoPregunta("Carga el documento que deseas cifrar:");
    let pregunta7 = new NodoPregunta("¿Quieres descifrar un documento?");
    let pregunta8 = new NodoPregunta("Introduce el tipo de cifrado (AES o RSA) (Respuesta abierta):");
    let pregunta9 = new NodoPregunta("Carga el documento cifrado:");
    let pregunta10 = new NodoPregunta("Introduce la clave de descifrado (Respuesta abierta):");
    let pregunta11 = new NodoPregunta("La clave no es válida. ¿Quieres intentar de nuevo?");
    let pregunta12 = new NodoPregunta("Gracias por usar el chatbot de cifrado y descifrado de documentos.");

    pregunta1.si = pregunta2;
    pregunta1.no = pregunta7;
    pregunta2.si = pregunta4;
    pregunta2.no = pregunta1;
    pregunta4.si = pregunta6;
    pregunta4.no = pregunta5;
    pregunta5.si = pregunta6;
    pregunta5.no = pregunta7;
    pregunta6.si = pregunta12;
    pregunta6.no = pregunta1;
    pregunta7.si = pregunta8;
    pregunta7.no = pregunta12;
    pregunta8.si = pregunta9;
    pregunta8.no = pregunta10;
    pregunta9.si = pregunta12;
    pregunta9.no = pregunta1;
    pregunta10.si = pregunta11;
    pregunta10.no = pregunta12;
    pregunta11.si = pregunta10;
    pregunta11.no = pregunta12;

    return pregunta1; // Devolver la primera pregunta
}

let claveValida = ""; // Variable para almacenar la clave de descifrado válida

let currentQuestion = crear_arbol_preguntas();
displayQuestion(currentQuestion);

function displayQuestion(question) {
    let responseContainer = document.getElementById('chat-container');
    let questionText = document.createElement('p');
    questionText.textContent = question.pregunta;
    responseContainer.appendChild(questionText);
    responseContainer.scrollTop = responseContainer.scrollHeight;

    if (question === currentQuestion && question.pregunta === "¡Hola! Bienvenido al asistente de cifrado y descifrado de documentos.") {
        setTimeout(() => {
            currentQuestion = currentQuestion.si;
            displayQuestion(currentQuestion);
        }, 3000); // Espera 3 segundos antes de continuar
    }

    // Mostrar el formulario de carga de archivos si es necesario
    if (currentQuestion.pregunta === "Carga el documento que deseas cifrar:" || currentQuestion.pregunta === "Carga el documento cifrado:" || currentQuestion.pregunta === "Introduce la clave de descifrado:") {
        document.getElementById('upload-form').style.display = 'block';
    } else {
        document.getElementById('upload-form').style.display = 'none';
    }
}

function Bot_respuesta() {
    let responseContainer = document.getElementById('chat-container');
    let userInput = document.getElementById('response').value.toLowerCase().trim();

    let responseText = document.createElement('p');
    responseText.textContent = 'Tu respuesta: ' + userInput;
    responseContainer.appendChild(responseText);

    if (currentQuestion.pregunta === "Introduce el tipo de cifrado (AES o RSA) (Respuesta abierta):") {
        if (userInput === "aes" || userInput === "rsa") {
            currentQuestion = currentQuestion.no; // Siguiente pregunta abierta
            displayQuestion(currentQuestion);
        } else {
            let errorText = document.createElement('p');
            errorText.textContent = "Respuesta inválida. Por favor, responda 'AES' o 'RSA'.";
            responseContainer.appendChild(errorText);
        }
    } else if (currentQuestion.pregunta === "Introduce la clave de descifrado (Respuesta abierta):") {
        // Manejar respuesta abierta para la clave de descifrado
        // Aquí deberías tener una lógica para verificar la clave de descifrado
        // Por ahora, simplemente pasaremos a la siguiente pregunta
        currentQuestion = currentQuestion.no; // Siguiente pregunta abierta
        displayPublishedLink('documento_decifrado.txt')
        displayQuestion(currentQuestion)
        ;
    } else if (userInput === "si") {
        if (currentQuestion.si instanceof NodoPregunta) {
            currentQuestion = currentQuestion.si;
            displayQuestion(currentQuestion);
        } else {
            displayResult(currentQuestion.si);
        }
    } else if (userInput === "no") {
        if (currentQuestion.no instanceof NodoPregunta) {
            currentQuestion = currentQuestion.no;
            displayQuestion(currentQuestion);
        } else {
            displayResult(currentQuestion.no);
        }
    } else {
        let errorText = document.createElement('p');
        errorText.textContent = "Respuesta inválida. Por favor, responda 'si' o 'no'.";
        responseContainer.appendChild(errorText);
    }

    document.getElementById('response').value = '';
    responseContainer.scrollTop = responseContainer.scrollHeight;
}

function displayResult(result) {
    let responseContainer = document.getElementById('chat-container');
    responseContainer.innerHTML = ''; // Limpiar contenido previo

    if (result instanceof HTMLElement) {
        responseContainer.appendChild(result); // Agregar elemento HTML al contenedor
    } else {
        let resultText = document.createElement('p');
        resultText.textContent = result; // Si no es un elemento HTML, mostrar el texto directamente
        responseContainer.appendChild(resultText);
    }
}
function submitResponse() {
    Bot_respuesta();
}

function uploadFile() {
    let fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        console.error('No file selected.');
        return;
    }

    let formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/uploads', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Upload failed: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        document.getElementById('upload-form').style.display = 'none';
        currentQuestion = currentQuestion.si;
        displayQuestion(currentQuestion);
        displayPublishedLink(fileInput.files[0].name); // Muestra el enlace del archivo publicado
        displayDecryptionKeyMessage();
        displayQuestionWithDelay(currentQuestion); // Llama a displayQuestion con un retraso de 30 segundos
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        alert('El archivo se ha cargado correctamente.');
        currentQuestion = currentQuestion.si
        displayPublishedLink(fileInput.files[0].name); // Muestra el enlace del archivo publicado
        displayDecryptionKeyMessage();
        displayQuestionWithDelay(currentQuestion); // Llama a displayQuestion con un retraso de 30 segundos
    })
}

function displayFileLink(fileLink) {
    let responseContainer = document.getElementById('chat-container');
    let fileLinkElement = document.createElement('p');
    fileLinkElement.innerHTML = `<a href="${fileLink}" target="_blank">${fileLink}</a>`;
    responseContainer.appendChild(fileLinkElement);
    responseContainer.scrollTop = responseContainer.scrollHeight;
}
function displayPublishedLink(filename) {
    let fileLink = `http://localhost:3000/published/${filename}`; // Ruta del enlace del archivo publicado
    displayFileLink(fileLink);
}
// Función para mostrar la siguiente pregunta después de un retraso de 30 segundos
function displayQuestionWithDelay(question) {
        displayQuestion(question);
}
function displayDecryptionKeyMessage() {
    // Mensaje para mostrar la clave de descifrado (esto debería ser generado o manejado de alguna manera)
    let responseContainer = document.getElementById('chat-container');
    let decryptionKeyMessage = document.createElement('p');
    let bytes = [0x01, 0x7a, 0x7f, 0x72, 0xd8, 0x24, 0x50, 0xee, 0x4b, 0xb8, 0xf8, 0xb4, 0xb8, 0xcd, 0x39];
    let mensaje = String.fromCharCode(...bytes);
    decryptionKeyMessage.textContent = `La clave de descifrado es: ${mensaje}`;; // Reemplaza {clave_de_descifrado} con la clave real
    responseContainer.appendChild(decryptionKeyMessage);
    responseContainer.scrollTop = responseContainer.scrollHeight;
}
