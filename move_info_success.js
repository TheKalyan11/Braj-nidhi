const fs = require('fs');
const filePath = 'a:\\bn\\src\\app\\booking\\page.tsx';
let src = fs.readFileSync(filePath, 'utf8');

// The block to extract
const startTag = '<div className="conf-accordion">\n                  <div className="conf-accordion-header"><span>Your Information</span></div>';
const startIndex = src.indexOf(startTag);
if (startIndex === -1) {
  console.log("Not found start");
  process.exit(1);
}

// Find the end of this accordion. It ends before <div className="conf-accordion">\n                  <div className="conf-accordion-header"><span>Payment Details</span></div>
const nextTag = '<div className="conf-accordion">\n                  <div className="conf-accordion-header"><span>Payment Details</span></div>';
const endIndex = src.indexOf(nextTag, startIndex);
if (endIndex === -1) {
  console.log("Not found end");
  process.exit(1);
}

let blockToMove = src.substring(startIndex, endIndex);

// Change grid-template-columns inline for this block
blockToMove = blockToMove.replace('className="conf-guest-cards"', 'className="conf-guest-cards" style={{ gridTemplateColumns: \'1fr\' }}');

// Remove the block from its current location
src = src.substring(0, startIndex) + src.substring(endIndex);

// Find where to insert it: After `</div>\n              </div>\n\n              {/* RIGHT DETAILS */}`
const leftCardEndTag = '</div>\n              </div>\n\n              {/* RIGHT DETAILS */}';
const insertIndex = src.indexOf(leftCardEndTag);
if (insertIndex === -1) {
  console.log("Not found insert location");
  process.exit(1);
}

const leftCardStart = src.lastIndexOf('<div className="conf-left-card">', insertIndex);
if (leftCardStart === -1) {
    console.log("Not found left card start");
    process.exit(1);
}

// Extract the left card block
const leftCardBlock = src.substring(leftCardStart, insertIndex + '</div>\n              </div>'.length);

const combinedBlock = `
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                ${leftCardBlock.trim()}

                ${blockToMove.trim()}
              </div>
`;

// Replace the original left card with the combined block
src = src.substring(0, leftCardStart) + combinedBlock + '\n\n              {/* RIGHT DETAILS */}\n' + src.substring(insertIndex + leftCardEndTag.length);

fs.writeFileSync(filePath, src);
console.log("Done");
