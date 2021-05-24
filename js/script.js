const fileSelector = document.querySelector('.upload-file-input');
let jsonTextarea = document.querySelector('.json');
let csvTextarea = document.querySelector('.csv');
const convertBtn = document.querySelector('.convert');
const clearBtn = document.querySelector('.clear');
const form = document.querySelector('form');
const downloadBtn = document.querySelector(".download");
const switchConverterBtn = document.querySelector('#btn-switch');
const switcher = document.querySelector('.switch');

const typeOfConversion = {
    CSVtoJSON: false
}


convertBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    let jsonString = jsonTextarea.value;
    
    if(jsonString === "") {
        alertUser('fail','Input is NOT a valid JSON');
        return;
    }

    let arr;
    if(!isValidJSONString(jsonString)) {
        alertUser('fail','Input is NOT a valid JSON');
        return;
    }  

    alertUser('success','Input is a valid JSON')
    arr = JSON.parse(jsonString);
    let headers = [];
    let data = [];
    let key = Object.keys(arr[0]);
    headers.push(key);
    arr.forEach(obj => {
        let value = Object.values(obj);
        data.push(value)
    })
    console.log(headers,data)
    headers = headers.join("");
    data = data.join("\n");

    csvTextarea.value = headers + "\n" + data;
})

fileSelector.addEventListener('change', (ev) => {
    const reader = new FileReader();
    // returns a FileList Array like Object not array. Numbered properties that point to objects which are files with properties
    reader.onload = () => {
        let JSONFile = reader.result;
        
        if(isValidJSONString(JSONFile)) {
            jsonTextarea.value = JSONFile;
        } else {
            jsonTextarea.value = JSONFile;
            alertUser('fail','Input is NOT a valid JSON');
        }
    }
    
    let file = ev.target.files[0];
    reader.readAsText(file)
    
})

clearBtn.addEventListener('click', () => {
    form.reset();
    
})

downloadBtn.addEventListener('click',(e) => {
    e.preventDefault();
    e.stopPropagation()
    let text = csvTextarea.value;
    let blob = new Blob([text], {type: "text/csv;charset=utf-8"});
    let blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = "csvfile";

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
        })
    );

    // Remove link from body
    document.body.removeChild(link);
})


switchConverterBtn.addEventListener('click', (ev) => {
    switcher.classList.toggle('active');

    if(!typeOfConversion.CSVtoJSON) {
        typeOfConversion.CSVtoJSON = true;
    } else {
        typeOfConversion.CSVtoJSON = false;
    }
    changeUI()
})

function changeUI() {
   if(typeOfConversion.CSVtoJSON) {
       document.querySelector('.main-title').innerHTML = `<span class="accent">CSV</span> to
       <span class="accent"> JSON</span> Converter`
       document.querySelector('.json-label').textContent = "CSV"
       document.querySelector('.csv-label').textContent = "JSON"
       document.querySelector('legend').textContent = "paste CSV here"
       document.querySelector('.json').placeholder= "Paste CSV here or upload file";
       document.querySelector('body').style.backgroundColor = '#456a6e';


   } else {
        document.querySelector('.main-title').innerHTML = `<span class="accent">JSON</span> to
        <span class="accent"> CSV</span> Converter`
        document.querySelector('.json-label').textContent = "JSON"
        document.querySelector('.csv-label').textContent = "CSV"
        document.querySelector('legend').textContent = "paste JSON here"
        document.querySelector('.json').placeholder= "Nested JSON structures are not supported";
        document.querySelector('body').style.backgroundColor = '#bbe4e9';
   }
}

 
function alertUser(className,message) {
    let alert = document.querySelector('.alert');
    if(className === 'fail') {
        alert.classList.add(className);
        alert.textContent = message;
        setTimeout(() =>{
            alert.classList.remove(className);
        },2000)
        
        
    } else {
        alert.classList.add(className);
        alert.textContent = message;
        setTimeout(() =>{
            alert.classList.remove(className);
        },2000)
        
    }
}

function isValidJSONString(str) {
    try {
        JSON.parse(str)
    } catch(err) {
        return false;
    }
    return true;
}