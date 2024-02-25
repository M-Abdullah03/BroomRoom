const changer = new MutationObserver(hideClasses);
let hiddenClasses = [];


changer.observe(document, {
  childList: true,
  subtree: true
});

function hideClasses() {
  for (let className of hiddenClasses) {
    //for main page
    let roomList = document.evaluate(`//div[text() = "`+`${className}`+`"]/ancestor::li`, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < roomList.snapshotLength; i++) {
      roomList.snapshotItem(i).style.display = 'none';
    }

    //for sidebar
    roomList = document.evaluate(`//div[text() =  "`+`${className}`+`"]/ancestor::a`, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < roomList.snapshotLength; i++) {
      roomList.snapshotItem(i).style.display = 'none';
    }
  }
}

function getAllClassroomNames() {
  let classroomNames = [];
  let xPathResult = document.evaluate('//li//h2//a//div[1]/text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); console.log(xPathResult.snapshotLength);
  for (let i = 0; i < xPathResult.snapshotLength; i++) {
    //print class name
    let textContent = xPathResult.snapshotItem(i).textContent.trim();
    if (textContent !== '') {
      classroomNames.push(textContent);
    }
  }

  return classroomNames;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getAllClassroomNames") {
    let classroomNames = getAllClassroomNames();
    sendResponse({ classroomNames: classroomNames });
  }
  return true; // keeps the message channel open until sendResponse is called
});


// Get the class list from storage
chrome.storage.sync.get('classes', function (data) {
  hiddenClasses = data.classes || [];
  hideClasses();
});


