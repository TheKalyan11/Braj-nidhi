const fs = require('fs');

const cssToAppend = `
/* ==========================================================================
   INVOICE RECEIPT COMPONENT
   ========================================================================== */

.invoice-receipt-container {
  display: none; /* hidden by default, visible only in print or specific mode */
  background: #f8f8f8;
  color: #333;
  font-family: 'Inter', sans-serif;
  padding: 40px;
  position: relative;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

@media print {
  body > *:not(.invoice-receipt-container) {
    display: none !important;
  }
  body {
    background: #fff;
  }
  .invoice-receipt-container {
    display: block !important;
    padding: 0;
    max-width: 100%;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.invoice-receipt-container.preview-mode {
  display: block;
  border: 1px solid #ccc;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-top: 40px;
}

.inv-shape {
  position: absolute;
  z-index: 0;
  opacity: 0.5;
  background: #e6e6e6;
  border-radius: 50%;
}
.inv-shape-top-right {
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  filter: blur(50px);
}
.inv-shape-bottom-left {
  bottom: -100px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: #FFB800;
  border-radius: 50%;
  opacity: 1;
}

.inv-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}
.inv-logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
}
.inv-logo-text h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 1px;
}
.inv-logo-text p {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #666;
}
.inv-title-area {
  text-align: right;
  position: relative;
}
.inv-title-area h1 {
  margin: 0;
  font-size: 46px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #222;
}
.inv-abstract-circles {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.inv-circle-yellow {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FFB800;
}
.inv-circle-outline {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid #333;
}

.inv-details {
  position: relative;
  z-index: 1;
  margin-bottom: 30px;
  font-size: 14px;
}
.inv-details-grid {
  display: grid;
  grid-template-columns: 100px 10px 1fr;
  row-gap: 8px;
}
.inv-label {
  font-weight: 700;
  color: #444;
}
.inv-colon {
  font-weight: 700;
}
.inv-value {
  color: #555;
}

.inv-table-container {
  position: relative;
  z-index: 1;
  margin-bottom: 30px;
}
.inv-table {
  width: 100%;
  border-collapse: collapse;
}
.inv-table th {
  background: #333;
  color: #fff;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
}
.inv-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.inv-bottom-section {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}
.inv-terms {
  width: 45%;
}
.inv-terms h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 700;
}
.inv-terms p {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}
.inv-totals {
  width: 45%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.inv-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 5px 0;
}
.inv-grand-total {
  font-weight: 800;
  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  padding: 10px 0;
}

.inv-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
}
.inv-contacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.inv-contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.inv-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FFB800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.inv-signature {
  text-align: center;
}
.inv-sign-image {
  width: 150px;
  height: 50px;
  margin-bottom: 5px;
}
.inv-sign-name {
  font-family: 'Great Vibes', cursive, serif;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}
.inv-sign-pos {
  font-size: 12px;
  color: #666;
}

.inv-bottom-decor {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  padding-top: 20px;
}
.inv-bottom-decor span {
  font-size: 12px;
  color: #666;
}
.inv-bottom-bar {
  width: 40%;
  height: 20px;
  background: #FFB800;
}
`;

fs.appendFileSync('src/app/globals.css', cssToAppend);
