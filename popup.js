// Cached class list
let classes = [];
let allClasses = [];

// Get the elements
const classesDiv = document.getElementById('classes');
const loadClassesButton = document.getElementById('load-class-button');
// Event listener for the load classes button
loadClassesButton.addEventListener('click', () => {
    getNames().then(allClass => {
        allClasses=allClass;
        classesDiv.innerHTML = ''; // Clear the array div
        populateClasses(allClasses);
    
    }).catch(error => {
        console.error(error);
    });
}
);


// Function to save the class list to storage
function saveClasses() {
    chrome.storage.sync.set({ 'classes': classes }, function () {
        onLoad(); // Refresh the display after saving
    });
}

function populateClasses(array) {

    for (let i = 0; i < array.length; i++) {
        const classDiv = document.createElement('div');
        classDiv.className = 'class';

        // Create an input box for the class name
        const classInput = document.createElement('input');
        classInput.type = 'text';
        classInput.disabled = true;
        classInput.value = array[i];

        // Create an eye icon for the class visibility
        const eyeIcon = document.createElement('img');
        eyeIcon.src = classes.includes(array[i]) ? 'images/eye-closed.png' : 'images/eye-open.png';
        eyeIcon.onclick = function () {
            if (classes.includes(array[i])) {
                // If the class is currently hidden, show it
                classes = classes.filter(className => className !== array[i]);
                eyeIcon.src = 'images/eye-open.png';
            } else {
                // If the class is currently visible, hide it
                classes.push(array[i]);
                eyeIcon.src = 'images/eye-closed.png';
            }
            saveClasses();
        };

        classDiv.appendChild(classInput);
        classDiv.appendChild(eyeIcon);

        classesDiv.appendChild(classDiv);
    }
}

function onLoad() {
    //for hidden classes
    chrome.storage.sync.get('classes', function (data) {
        classes = data.classes || [];
        classesDiv.innerHTML = ''; // Clear the classes div
        populateClasses(allClasses);
        // populateClasses(classes);

    }
    );
}

function getNames() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getAllClassroomNames" }, function (response) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response.classroomNames);
                }
            });
        });
    });
}

// Load the class list when the popup is clicked
onLoad();
