const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

const replacementStr = `@media print {
  @page { margin: 0; }
  body {
    margin: 0;
    background: #fff;
  }
  body * {
    visibility: hidden;
  }
  .invoice-receipt-container, .invoice-receipt-container * {
    visibility: visible;
  }
  .invoice-receipt-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: block !important;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}`;

// I'll replace the existing @media print block
const startIdx = css.indexOf('@media print {');
if (startIdx !== -1) {
  // Find matching closing brace for @media print
  let braceCount = 0;
  let endIdx = -1;
  for (let i = startIdx + 13; i < css.length; i++) {
    if (css[i] === '{') braceCount++;
    if (css[i] === '}') {
      if (braceCount === 0) {
        endIdx = i;
        break;
      }
      braceCount--;
    }
  }
  if (endIdx !== -1) {
    css = css.substring(0, startIdx) + replacementStr + css.substring(endIdx + 1);
    fs.writeFileSync('src/app/globals.css', css);
    console.log("Success");
  } else {
    console.log("Could not find end of @media print");
  }
} else {
  console.log("Could not find @media print");
}
