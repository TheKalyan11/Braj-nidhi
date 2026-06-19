const fs = require('fs');
const filePath = 'a:\\bn\\src\\app\\booking\\page.tsx';
let src = fs.readFileSync(filePath, 'utf8');

const yourInfoIndex = src.lastIndexOf('<span>Your Information</span>');
if (yourInfoIndex === -1) { console.log("Not found your info"); process.exit(1); }

const startIndex = src.lastIndexOf('<div className="conf-accordion">', yourInfoIndex);

const paymentIndex = src.lastIndexOf('<span>Payment Details</span>');
const endIndex = src.lastIndexOf('<div className="conf-accordion">', paymentIndex);

if (startIndex === -1 || endIndex === -1) {
  console.log("Not found bounds");
  process.exit(1);
}

let blockToMove = src.substring(startIndex, endIndex);

// Add the style to the conf-guest-cards
blockToMove = blockToMove.replace('className="conf-guest-cards"', 'className="conf-guest-cards" style={{ gridTemplateColumns: \'1fr\' }}');

src = src.substring(0, startIndex) + src.substring(endIndex);

const leftCardEndTag = '</div>\r\n              </div>\r\n\r\n              {/* RIGHT DETAILS */}';
let insertIndex = src.indexOf(leftCardEndTag);
if (insertIndex === -1) {
    const leftCardEndTagFallback = '</div>\n              </div>\n\n              {/* RIGHT DETAILS */}';
    insertIndex = src.indexOf(leftCardEndTagFallback);
    if (insertIndex === -1) {
        console.log("Not found insert location");
        process.exit(1);
    }
}

const leftCardStart = src.lastIndexOf('<div className="conf-left-card">', insertIndex);

const leftCardBlock = src.substring(leftCardStart, insertIndex + '</div>\n              </div>'.length);

const combinedBlock = `
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                ${leftCardBlock.trim()}

                ${blockToMove.trim()}
              </div>
`;

src = src.substring(0, leftCardStart) + combinedBlock + '\n\n              {/* RIGHT DETAILS */}\n' + src.substring(insertIndex + 64);

fs.writeFileSync(filePath, src);
console.log("Done");
