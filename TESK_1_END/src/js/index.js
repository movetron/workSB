import {encoded, translations} from './data.js'

console.log("Let's rock")

function IndexId(encodedObj, translations) {
    const excField = ["groupId", "service", "formatSize", "ca"];
    const decObject = encodedObj.map(object => {
      const decodedObj = {};
      for (const elem in object) {
        if (excField.includes(elem)) {
          decodedObj[elem] = object[elem];
        } else if (object[elem] !== null && object[elem] !== "0") {
          const decValue = translations[object[elem]] || object[elem];
          decodedObj[elem.replace(/Id$/, "")] = decValue; 
        }
      }
      return decodedObj;
    });
    const uniqID = new Set();
    encodedObj.forEach(object => {
      for (const elem in object) {
        if (elem.endsWith("Id") && object[elem] !== null ) {
          uniqID.add(object[elem]);
        }
      }
    });
  
    return { decObject, uniqID: [...uniqID] }; 
}
const { decObject, uniqID } = IndexId(encoded, translations);

console.log("Расшифрованные поля:", decObject);
console.log("Список уникальных ID:", uniqID);


