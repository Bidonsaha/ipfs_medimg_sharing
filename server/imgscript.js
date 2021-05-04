const dicomParser = require("dicom-parser");
var fs = require("fs");

var savePixels = require("save-pixels");

//Create an image

var filePath = "00000001.dcm";
console.log("File Path = ", filePath);
var dicomFileAsBuffer = fs.readFileSync(filePath);
var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);

// print the patient's name
var patientName = dataSet.string("x00100010");
console.log("Patient Name = " + patientName);

var pixelDataElement = dataSet.elements.x7fe00010;
var pixelArray = new Uint16Array(
  dataSet.byteArray.buffer,
  pixelDataElement.dataOffset,
  pixelDataElement.length / 2
);

console.log("PixelData: ", typeof pixelArray);

//Save to a file
savePixels(pixelArray, "png").pipe(process.stdout);
