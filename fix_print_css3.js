const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

const targetStr = `@media print {
    body * {
      visibility: hidden;
    }
    body, html {
      background: #fff;
      margin: 0;
      padding: 0;
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
      padding: 0;
      margin: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }`;

const replacementStr = `@media print {
    @page { margin: 0; }
    body > *:not(.invoice-receipt-container) {
      display: none !important;
    }
    body, html {
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .invoice-receipt-container {
      display: block !important;
      position: relative;
      width: 100%;
      max-width: 100%;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }`;

if (css.includes(targetStr)) {
    css = css.replace(targetStr, replacementStr);
    fs.writeFileSync('src/app/globals.css', css);
    console.log("Success");
} else {
    console.log("Target string not found. Please check whitespace.");
}
