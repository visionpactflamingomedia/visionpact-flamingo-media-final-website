/**
 * Visionpact Flamingo Media: business workbook and website connector.
 *
 * What this script does
 *  - setup() builds every tab of this spreadsheet: Dashboard, Service Requests,
 *    Feedback, Clients, Client Types, Services & Pricing, Website, How to use
 *    and Lists. Running it again rebuilds the layout and keeps every row.
 *  - doPost() receives the website's service-request and feedback forms, adds
 *    each submission as a new row and emails it to the studio inbox (the
 *    NOTIFY_EMAIL script property, or the website's contact email).
 *  - onEdit() copies a request to Clients when its Status is set to Confirmed,
 *    and gives new client rows an ID.
 *
 * Setup, once
 *  1. In this spreadsheet open Extensions > Apps Script. Replace everything in
 *     Code.gs with this file and press Save.
 *  2. Project Settings (gear icon) > Script properties > Add script property.
 *     Property: SHEETS_WEBHOOK_SECRET. Value: a long private code (30+ letters
 *     and numbers). Press Save script properties.
 *  3. Choose "setup" in the function list at the top and press Run. Allow
 *     access when Google asks (Advanced > Go to project, if it warns). Then
 *     run "testEmail" once: it allows the script to send email and sends a
 *     test message to the studio inbox.
 *  4. Deploy > New deployment > Select type: Web app.
 *     Execute as: Me. Who has access: Anyone. Press Deploy, then copy the
 *     Web app URL.
 *  5. Give the website two settings: SHEETS_WEBHOOK_URL (that URL) and
 *     SHEETS_WEBHOOK_SECRET (the same code as the script property).
 *
 * Keep the tab names and the column order of Service Requests and Feedback.
 */

// Must match SHEETS_WEBHOOK_SECRET on the website. Anyone who knows this value
// can add rows, so keep it private. The script property SHEETS_WEBHOOK_SECRET
// is used when set; otherwise this value, unless it is still a placeholder.
const SHARED_SECRET = '__SHARED_SECRET__';
const SECRET_PROPERTY = 'SHEETS_WEBHOOK_SECRET';
// Optional script property: where new requests and feedback are emailed.
const NOTIFY_PROPERTY = 'NOTIFY_EMAIL';

const TIME_ZONE = 'Asia/Kolkata';
const TAB = {
  dashboard: 'Dashboard',
  requests: 'Service Requests',
  feedback: 'Feedback',
  clients: 'Clients',
  clientTypes: 'Client Types',
  pricing: 'Services & Pricing',
  website: 'Website',
  guide: 'How to use',
  lists: 'Lists',
};
const COLOR = {
  ink: '#1b1715',
  accent: '#ffa45f',
  accentDark: '#a44a0b',
  paper: '#fff8ef',
  soft: '#fdebd9',
  muted: '#5f5954',
  input: '#fff4c2',
  white: '#ffffff',
};
const LOG_ROWS = 2000;
const CLIENT_ROWS = 500;
const DATETIME = 'dd mmm yyyy, hh:mm';
const DATE = 'dd mmm yyyy';
const INR = '"₹"#,##0';
const TEXT = '@';

/*__DATA__*/

// Columns: header, width in pixels, and options. team: filled in by the studio
// (darker orange header). wrap: long text. fmt: number format.
const REQUEST_COLUMNS = [
  { h: 'Received at', w: 140, fmt: DATETIME },
  { h: 'Reference', w: 90, note: 'The reference the visitor saw after sending the form, and in the email.' },
  { h: 'Name', w: 160 },
  { h: 'Email', w: 210 },
  { h: 'Phone', w: 130 },
  { h: 'Company / brand', w: 160 },
  { h: 'Inquiry type', w: 130 },
  { h: 'Service', w: 220 },
  { h: 'Selected package', w: 260, wrap: true, note: 'Filled when the visitor pressed a button on the Pricing page. This is the package or service they want to buy.' },
  { h: 'Package price (₹)', w: 115, fmt: INR, note: 'Starting price of the selected package, from the website price list. Empty for a custom quote.' },
  { h: 'Message', w: 360, wrap: true },
  { h: 'Page', w: 100, note: 'The website page the form was sent from.' },
  { h: 'Status', w: 110, team: true, note: 'New, Contacted, Quote sent, Confirmed or Lost. Confirmed adds the request to Clients.' },
  { h: 'Follow-up date', w: 115, team: true, fmt: DATE },
  { h: 'Handled by', w: 120, team: true },
  { h: 'Notes', w: 240, team: true, wrap: true },
];
const FEEDBACK_COLUMNS = [
  { h: 'Received at', w: 140, fmt: DATETIME },
  { h: 'Reference', w: 90 },
  { h: 'Name', w: 160 },
  { h: 'Email', w: 210 },
  { h: 'Service used', w: 220 },
  { h: 'Rating (1-5)', w: 95, fmt: '0', center: true },
  { h: 'Stars', w: 95 },
  { h: 'Feedback', w: 380, wrap: true },
  { h: 'May we quote this?', w: 120, note: 'Yes only when the client ticked the box. Quote feedback publicly only when this is Yes, using the first name.' },
  { h: 'Page', w: 100 },
  { h: 'Reviewed', w: 95, team: true },
  { h: 'Shared as testimonial', w: 130, team: true },
  { h: 'Notes', w: 240, team: true, wrap: true },
];
const CLIENT_COLUMNS = [
  { h: 'Client ID', w: 85, note: 'Filled automatically when you type a client name in column B.' },
  { h: 'Client / company', w: 200 },
  { h: 'Contact person', w: 150 },
  { h: 'Email', w: 210 },
  { h: 'Phone', w: 130 },
  { h: 'City', w: 110 },
  { h: 'Client type', w: 190 },
  { h: 'Service category', w: 220 },
  { h: 'Services / package', w: 240, wrap: true },
  { h: 'Project', w: 240, wrap: true },
  { h: 'Start date', w: 105, fmt: DATE },
  { h: 'Due date', w: 105, fmt: DATE },
  { h: 'Project status', w: 120 },
  { h: 'Quoted (₹)', w: 105, fmt: INR },
  { h: 'Received (₹)', w: 105, fmt: INR },
  { h: 'Balance (₹)', w: 105, fmt: INR, calc: true, note: 'Calculated: Quoted minus Received. Do not type in this column.' },
  { h: 'Payment', w: 140 },
  { h: 'Source', w: 110 },
  { h: 'Request reference', w: 120, note: 'Reference from Service Requests, when the client came from the website.' },
  { h: 'Notes', w: 240, wrap: true },
];
const LISTS = [
  ['Request status', ['New', 'Contacted', 'Quote sent', 'Confirmed', 'Lost']],
  ['Yes / No', ['Yes', 'No']],
  ['Service category', DATA.services.map((s) => s.name).concat(['Something else / not sure yet'])],
  ['Inquiry type', ['Project inquiry', 'Partnership inquiry', 'Career inquiry', 'General inquiry']],
  ['Client type', DATA.clientTypes.map((t) => t[0]).concat(['Other'])],
  ['Project status', ['Lead', 'Proposal sent', 'In progress', 'In review', 'Delivered', 'On hold', 'Cancelled']],
  ['Payment', ['Not paid', 'Advance received', 'Paid in full']],
  ['Source', ['Website', 'Referral', 'Instagram', 'LinkedIn', 'Google', 'WhatsApp', 'Walk-in', 'Other']],
];
const NOT_EXAMPLE = '"<>Example*"';

// ---- Website connector -----------------------------------------------------

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents || e.postData.contents.length > 30000)
    return json_({ ok: false, error: 'Invalid request' });
  const secret = sharedSecret_();
  if (!secret) return json_({ ok: false, error: 'Connector not configured' });
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Invalid JSON' });
  }
  if (!body || body.secret !== secret) return json_({ ok: false, error: 'Unauthorized' });
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json_({ ok: false, error: 'Busy, please retry' });
  try {
    const data = body.data || {};
    let result;
    if (body.type === 'inquiry') result = addRequest_(data, body.receivedAt);
    else if (body.type === 'feedback') result = addFeedback_(data, body.receivedAt);
    else return json_({ ok: false, error: 'Unknown type' });
    return json_({ ok: true, result: result });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

// Script property first, then the constant above. Placeholders count as unset.
function sharedSecret_() {
  const fromProperty = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  const value = String(fromProperty || SHARED_SECRET || '').trim();
  return value && value.indexOf('PASTE_') !== 0 && value.indexOf('__') !== 0 ? value : '';
}

// Lets you open the web app URL in a browser to check the deployment.
function doGet() {
  return json_({
    ok: true,
    connector: 'Visionpact Flamingo Media sheet',
    secretConfigured: Boolean(sharedSecret_()),
  });
}

function addRequest_(d, receivedAt) {
  const sheet = logSheet_(TAB.requests);
  const reference = text_(d.reference, 20);
  if (!reference) throw new Error('Missing reference');
  if (hasValue_(sheet, 2, reference)) return 'duplicate';
  const price = number_(d.packagePrice);
  appendRow_(sheet, [
    date_(receivedAt),
    reference,
    text_(d.name, 100),
    text_(d.email, 254),
    text_(d.phone, 20),
    text_(d.company, 160),
    text_(d.type, 40),
    text_(d.service, 160),
    text_(d.selectedPackage, 300),
    price,
    text_(d.message, 4000),
    text_(d.page, 200),
    'New',
    '',
    '',
    '',
  ]);
  notify_('New website inquiry: ' + plain_(d.service, 80) + ' | ' + plain_(d.name, 100), plain_(d.email, 254), [
    ['Reference', reference],
    ['Name', plain_(d.name, 100)],
    ['Email', plain_(d.email, 254)],
    ['Phone', plain_(d.phone, 20) || 'Not given'],
    ['Company / brand', plain_(d.company, 160) || 'Not given'],
    ['Inquiry type', plain_(d.type, 40)],
    ['Service', plain_(d.service, 160)],
    ['Selected package', plain_(d.selectedPackage, 300) || 'None'],
    ['Package price', price === '' ? 'None' : '₹' + Number(price).toLocaleString('en-IN')],
    ['Message', plain_(d.message, 4000)],
    ['Page', plain_(d.page, 200)],
  ]);
  return 'added';
}

function addFeedback_(d, receivedAt) {
  const sheet = logSheet_(TAB.feedback);
  const reference = text_(d.reference, 20);
  if (!reference) throw new Error('Missing reference');
  if (hasValue_(sheet, 2, reference)) return 'duplicate';
  const rating = Math.min(5, Math.max(1, Math.round(Number(d.rating) || 0)));
  appendRow_(sheet, [
    date_(receivedAt),
    reference,
    text_(d.name, 100),
    text_(d.email, 254),
    text_(d.service, 160),
    rating,
    '★'.repeat(rating) + '☆'.repeat(5 - rating),
    text_(d.message, 2000),
    d.allowQuote === true ? 'Yes' : 'No',
    text_(d.page, 200),
    'No',
    'No',
    '',
  ]);
  notify_('New client feedback: ' + rating + '/5 | ' + plain_(d.name, 100), plain_(d.email, 254), [
    ['Reference', reference],
    ['Name', plain_(d.name, 100)],
    ['Email', plain_(d.email, 254) || 'Not given'],
    ['Service used', plain_(d.service, 160) || 'Not specified'],
    ['Rating', '★'.repeat(rating) + '☆'.repeat(5 - rating) + ' (' + rating + '/5)'],
    ['Feedback', plain_(d.message, 2000)],
    ['May we quote this?', d.allowQuote === true ? 'Yes, first name only' : 'No'],
    ['Page', plain_(d.page, 200)],
  ]);
  return 'added';
}

// ---- Email notifications ---------------------------------------------------

function notifyAddress_() {
  const fromProperty = PropertiesService.getScriptProperties().getProperty(NOTIFY_PROPERTY);
  return String(fromProperty || DATA.contact.email || '').trim();
}

// Emails one submission as a two-column table. A failed email is logged and
// never stops the row from being saved.
function notify_(subject, replyTo, rows) {
  const to = notifyAddress_();
  if (!to) return;
  try {
    const html =
      '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
      rows.map((r) =>
        '<tr><td style="border:1px solid #e3d9cf;background:#fff8ef;font-weight:bold;vertical-align:top">' + html_(r[0]) +
        '</td><td style="border:1px solid #e3d9cf;white-space:pre-wrap">' + html_(r[1]) + '</td></tr>',
      ).join('') +
      '</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#5f5954">Also added to ' +
      html_(SpreadsheetApp.getActive().getName()) + '. Reply to this email to answer the sender.</p>';
    const options = {
      to: to,
      subject: subject.slice(0, 200),
      htmlBody: html,
      body: rows.map((r) => r[0] + ': ' + r[1]).join('\n'),
      name: 'Visionpact website',
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) options.replyTo = replyTo;
    MailApp.sendEmail(options);
  } catch (err) {
    console.error('Notification email failed: ' + ((err && err.message) || err));
  }
}

// Run once from the editor: grants the email permission and sends a test.
function testEmail() {
  const to = notifyAddress_();
  if (!to) throw new Error('Set the NOTIFY_EMAIL script property first.');
  MailApp.sendEmail(to, 'Visionpact website: test email', 'Emails from the website forms will arrive at this address.');
  return 'Test email sent to ' + to + '. Daily emails left: ' + MailApp.getRemainingDailyQuota();
}

// Text for emails: control characters removed and length capped.
function plain_(value, max) {
  const s = value === null || value === undefined ? '' : String(value);
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

function html_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// The log tabs are created on first use if setup() has not been run.
function logSheet_(name) {
  const ss = SpreadsheetApp.getActive();
  if (!ss.getSheetByName(TAB.lists)) buildLists_(ss);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === TAB.requests) buildRequests_(ss);
    else buildFeedback_(ss);
  }
  return sheet;
}

// Visitor text: control characters removed and length capped. writeRow_()
// stores it as literal text, so it never runs as a formula in the sheet; this
// visible apostrophe also keeps formula-like text inert if a tab is exported
// to CSV.
function text_(value, max) {
  let s = value === null || value === undefined ? '' : String(value);
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
  return /^=/.test(s) || (/^[+\-@]/.test(s) && /[(!|]/.test(s)) ? "'" + s : s;
}

function number_(value) {
  const n = Number(value);
  return value === null || value === undefined || value === '' || !isFinite(n) ? '' : n;
}

function date_(iso) {
  const d = iso ? new Date(iso) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Last row with a value in one column (formats and dropdowns don't count).
function lastRowIn_(sheet, col) {
  const last = sheet.getLastRow();
  if (last < 2) return 1;
  const values = sheet.getRange(2, col, last - 1, 1).getValues();
  for (let i = values.length - 1; i >= 0; i--) if (values[i][0] !== '') return i + 2;
  return 1;
}

function hasValue_(sheet, col, value) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  return Boolean(
    sheet.getRange(2, col, last - 1, 1).createTextFinder(String(value)).matchEntireCell(true).findNext(),
  );
}

function ensureRows_(sheet, rows) {
  const max = sheet.getMaxRows();
  if (max < rows) sheet.insertRowsAfter(max, rows - max + 200);
}

function ensureColumns_(sheet, cols) {
  const max = sheet.getMaxColumns();
  if (max < cols) sheet.insertColumnsAfter(max, cols - max);
}

function appendRow_(sheet, values) {
  const row = lastRowIn_(sheet, 2) + 1;
  ensureRows_(sheet, row);
  writeRow_(sheet, row, 1, values);
}

// Writes one row from startCol. Every string gets a leading apostrophe, which
// Sheets hides and which stores the text exactly as given: "+91 98765 43210"
// would otherwise become a formula (#ERROR!, even in plain-text cells), and
// "01234567" a number. Dates and numbers go in as values.
function writeRow_(sheet, row, startCol, values) {
  const cells = values.map((v) => (typeof v === 'string' && v !== '' ? "'" + v : v));
  sheet.getRange(row, startCol, 1, cells.length).setValues([cells]);
}

// ---- Studio edits ----------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Visionpact')
    .addItem('Rebuild layout (keeps all rows)', 'setup')
    .addToUi();
}

function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const name = sheet.getName();
  const first = Math.max(2, e.range.getRow());
  const last = Math.min(e.range.getLastRow(), first + 200);
  if (last < first) return;
  if (name === TAB.requests) {
    // Status is column M (13).
    if (e.range.getColumn() > 13 || e.range.getLastColumn() < 13) return;
    const rows = sheet.getRange(first, 1, last - first + 1, REQUEST_COLUMNS.length).getValues();
    rows.forEach((row) => {
      if (row[12] === 'Confirmed' && row[1]) addClientFromRequest_(row);
    });
  } else if (name === TAB.clients) {
    if (e.range.getColumn() > 2) return;
    const values = sheet.getRange(first, 1, last - first + 1, 2).getValues();
    values.forEach((row, i) => {
      if (row[0] === '' && row[1] !== '' && !/^Example/.test(row[1]))
        sheet.getRange(first + i, 1).setValue(nextClientId_(sheet));
    });
  }
}

function addClientFromRequest_(req) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(TAB.clients);
  if (!sheet || hasValue_(sheet, 19, req[1])) return;
  const row = Math.max(lastRowIn_(sheet, 1), lastRowIn_(sheet, 2)) + 1;
  ensureRows_(sheet, row);
  const name = text_(req[2], 100);
  const company = text_(req[5], 160);
  // Columns A to O, then Q to T: Balance (P) is a formula for the whole column.
  writeRow_(sheet, row, 1, [
    nextClientId_(sheet),
    company || name,
    name,
    text_(req[3], 254),
    text_(req[4], 20),
    '',
    '',
    text_(req[7], 160),
    text_(req[8], 300) || text_(req[7], 160),
    '',
    new Date(),
    '',
    'In progress',
    number_(req[9]),
    '',
  ]);
  writeRow_(sheet, row, 17, [
    'Not paid',
    'Website',
    text_(req[1], 20),
    'Added automatically when the request was marked Confirmed.',
  ]);
  ss.toast((company || name) + ' was added to Clients.', 'Visionpact', 6);
}

function nextClientId_(sheet) {
  const last = sheet.getLastRow();
  let max = 0;
  if (last >= 2)
    sheet.getRange(2, 1, last - 1, 1).getValues().forEach((r) => {
      const m = /^CL-(\d+)$/.exec(String(r[0]));
      if (m) max = Math.max(max, Number(m[1]));
    });
  return 'CL-' + String(max + 1).padStart(3, '0');
}

// ---- Workbook layout -------------------------------------------------------

function setup() {
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  ss.setSpreadsheetLocale('en_IN');
  buildLists_(ss);
  buildRequests_(ss);
  buildFeedback_(ss);
  buildClients_(ss);
  buildClientTypes_(ss);
  buildPricing_(ss);
  buildWebsite_(ss);
  buildGuide_(ss);
  buildDashboard_(ss);
  const order = [TAB.dashboard, TAB.requests, TAB.feedback, TAB.clients, TAB.clientTypes, TAB.pricing, TAB.website, TAB.guide, TAB.lists];
  order.forEach((name, i) => {
    ss.setActiveSheet(ss.getSheetByName(name));
    ss.moveActiveSheet(i + 1);
  });
  // Remove the empty starter tab of a new spreadsheet.
  ss.getSheets().forEach((s) => {
    if (order.indexOf(s.getName()) < 0 && s.getLastRow() === 0 && /^(Sheet|Tab)\s?1$/.test(s.getName())) ss.deleteSheet(s);
  });
  ss.setActiveSheet(ss.getSheetByName(TAB.dashboard));
  SpreadsheetApp.flush();
  ss.toast('Workbook ready.', 'Visionpact', 5);
}

function sheet_(ss, name, tabColor) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.setTabColor(tabColor);
  return sheet;
}

// A tab with fixed content: cleared and written again on every setup().
function freshSheet_(ss, name, tabColor) {
  const sheet = sheet_(ss, name, tabColor);
  sheet.getCharts().forEach((c) => sheet.removeChart(c));
  sheet.getBandings().forEach((b) => b.remove());
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.clearConditionalFormatRules();
  const all = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  all.breakApart();
  all.clearDataValidations();
  sheet.clear();
  all.setFontFamily('Arial').setFontSize(10).setFontColor(COLOR.ink).setVerticalAlignment('top');
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
  return sheet;
}

function header_(range, color) {
  range
    .setBackground(color || COLOR.ink)
    .setFontColor(COLOR.white)
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
}

function title_(sheet, cell, text, subtitle) {
  sheet.getRange(cell).setValue(text).setFontSize(18).setFontWeight('bold').setVerticalAlignment('middle');
  sheet.setRowHeight(sheet.getRange(cell).getRow(), 36);
  if (subtitle)
    sheet.getRange(cell).offset(1, 0).setValue(subtitle).setFontColor(COLOR.muted).setVerticalAlignment('middle');
}

function section_(sheet, row, col, text) {
  sheet.getRange(row, col).setValue(text).setFontSize(11).setFontWeight('bold').setFontColor(COLOR.accentDark);
}

function listRange_(ss, name) {
  const col = LISTS.findIndex((l) => l[0] === name) + 1;
  return ss.getSheetByName(TAB.lists).getRange(2, col, 49, 1);
}

function dropdown_(ss, range, listName, allowInvalid) {
  range.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(listRange_(ss, listName), true)
      .setAllowInvalid(Boolean(allowInvalid))
      .setHelpText('Choose a value from the list. Add values on the Lists tab.')
      .build(),
  );
}

function colorRule_(range, column, value, fill) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$' + column + '2="' + value + '"')
    .setBackground(fill)
    .setRanges([range])
    .build();
}

// Shared layout for the three data tabs. Data rows are never cleared.
function prepareDataTab_(ss, sheet, columns, rows, frozenColumns) {
  ensureRows_(sheet, rows + 1);
  ensureColumns_(sheet, columns.length);
  const width = columns.length;
  sheet.getRange(1, 1, sheet.getMaxRows(), width)
    .setFontFamily('Arial').setFontSize(10).setFontColor(COLOR.ink).setVerticalAlignment('top');
  const header = sheet.getRange(1, 1, 1, width);
  header.setValues([columns.map((c) => c.h)]);
  sheet.getBandings().forEach((b) => b.remove());
  sheet
    .getRange(1, 1, rows + 1, width)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor(COLOR.ink)
    .setFirstRowColor(COLOR.white)
    .setSecondRowColor(COLOR.paper);
  header_(header);
  columns.forEach((c, i) => {
    const col = i + 1;
    sheet.setColumnWidth(col, c.w);
    const body = sheet.getRange(2, col, rows, 1);
    body.setNumberFormat(c.fmt || TEXT);
    body.setWrapStrategy(c.wrap ? SpreadsheetApp.WrapStrategy.WRAP : SpreadsheetApp.WrapStrategy.CLIP);
    if (c.center) body.setHorizontalAlignment('center');
    if (c.team) header.getCell(1, col).setBackground(COLOR.accentDark);
    header.getCell(1, col).setNote(c.note || '');
  });
  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(frozenColumns);
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, rows + 1, width).createFilter();
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach((p) => {
    if (p.getDescription() === 'Column headers') p.remove();
  });
  header.protect().setDescription('Column headers').setWarningOnly(true);
}

// Values the studio added to a list are kept; missing defaults are added back.
function buildLists_(ss) {
  const sheet = sheet_(ss, TAB.lists, '#bbbbbb');
  ensureColumns_(sheet, LISTS.length);
  const maxRows = sheet.getMaxRows();
  LISTS.forEach((list, i) => {
    const col = i + 1;
    const body = sheet.getRange(2, col, maxRows - 1, 1);
    const existing = body.getValues().map((r) => String(r[0]).trim()).filter((v) => v !== '');
    const merged = existing.concat(list[1].filter((v) => existing.indexOf(v) < 0));
    body.clearContent();
    sheet.getRange(1, col).setValue(list[0]);
    sheet.getRange(2, col, merged.length, 1).setNumberFormat(TEXT).setValues(merged.map((v) => [v]));
    sheet.setColumnWidth(col, 230);
  });
  sheet.getRange(1, 1, maxRows, LISTS.length).setFontFamily('Arial').setFontSize(10).setFontColor(COLOR.ink);
  header_(sheet.getRange(1, 1, 1, LISTS.length));
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
}

function buildRequests_(ss) {
  const sheet = sheet_(ss, TAB.requests, COLOR.ink);
  prepareDataTab_(ss, sheet, REQUEST_COLUMNS, LOG_ROWS, 3);
  dropdown_(ss, sheet.getRange(2, 13, LOG_ROWS, 1), 'Request status');
  dropdown_(ss, sheet.getRange(2, 8, LOG_ROWS, 1), 'Service category', true);
  dropdown_(ss, sheet.getRange(2, 7, LOG_ROWS, 1), 'Inquiry type', true);
  const status = sheet.getRange(2, 13, LOG_ROWS, 1);
  sheet.setConditionalFormatRules([
    colorRule_(status, 'M', 'New', '#ffe2c6'),
    colorRule_(status, 'M', 'Contacted', '#fff4c2'),
    colorRule_(status, 'M', 'Quote sent', '#dcebff'),
    colorRule_(status, 'M', 'Confirmed', '#d4f1dc'),
    colorRule_(status, 'M', 'Lost', '#ededed'),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($I2<>"",$M2="New")')
      .setBold(true)
      .setFontColor(COLOR.accentDark)
      .setRanges([sheet.getRange(2, 9, LOG_ROWS, 2)])
      .build(),
  ]);
}

function buildFeedback_(ss) {
  const sheet = sheet_(ss, TAB.feedback, COLOR.ink);
  prepareDataTab_(ss, sheet, FEEDBACK_COLUMNS, LOG_ROWS, 3);
  dropdown_(ss, sheet.getRange(2, 9, LOG_ROWS, 1), 'Yes / No');
  dropdown_(ss, sheet.getRange(2, 11, LOG_ROWS, 2), 'Yes / No');
  sheet.getRange(2, 6, LOG_ROWS, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(1, 5).setAllowInvalid(false).build(),
  );
  const rating = sheet.getRange(2, 6, LOG_ROWS, 2);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$F2>=4').setBackground('#d4f1dc').setRanges([rating]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($F2<>"",$F2<=2)').setBackground('#fddcdc').setRanges([rating]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$I2="Yes"').setFontColor('#1e7a3c').setBold(true).setRanges([sheet.getRange(2, 9, LOG_ROWS, 1)]).build(),
  ]);
  sheet.getRange(2, 7, LOG_ROWS, 1).setFontColor(COLOR.accentDark);
}

function buildClients_(ss) {
  const sheet = sheet_(ss, TAB.clients, COLOR.accentDark);
  const isNew = sheet.getLastRow() < 2;
  prepareDataTab_(ss, sheet, CLIENT_COLUMNS, CLIENT_ROWS, 2);
  header_(sheet.getRange(1, 1, 1, CLIENT_COLUMNS.length), COLOR.accentDark);
  // Balance for every row from one formula in the header cell.
  sheet.getRange(1, 16).setFormula('={"Balance (₹)";ARRAYFORMULA(IF(N2:N="","",N2:N-O2:O))}');
  dropdown_(ss, sheet.getRange(2, 7, CLIENT_ROWS, 1), 'Client type');
  dropdown_(ss, sheet.getRange(2, 8, CLIENT_ROWS, 1), 'Service category', true);
  dropdown_(ss, sheet.getRange(2, 13, CLIENT_ROWS, 1), 'Project status');
  dropdown_(ss, sheet.getRange(2, 17, CLIENT_ROWS, 1), 'Payment');
  dropdown_(ss, sheet.getRange(2, 18, CLIENT_ROWS, 1), 'Source', true);
  sheet.getRange(2, 11, CLIENT_ROWS, 2).setDataValidation(
    SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).build(),
  );
  const status = sheet.getRange(2, 13, CLIENT_ROWS, 1);
  const payment = sheet.getRange(2, 17, CLIENT_ROWS, 1);
  sheet.setConditionalFormatRules([
    colorRule_(status, 'M', 'Lead', '#ffe2c6'),
    colorRule_(status, 'M', 'Proposal sent', '#fff4c2'),
    colorRule_(status, 'M', 'In progress', '#dcebff'),
    colorRule_(status, 'M', 'In review', '#e9ddff'),
    colorRule_(status, 'M', 'Delivered', '#d4f1dc'),
    colorRule_(status, 'M', 'On hold', '#ededed'),
    colorRule_(status, 'M', 'Cancelled', '#ededed'),
    colorRule_(payment, 'Q', 'Not paid', '#fddcdc'),
    colorRule_(payment, 'Q', 'Advance received', '#fff4c2'),
    colorRule_(payment, 'Q', 'Paid in full', '#d4f1dc'),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0).setFontColor('#b3261e').setBold(true).setRanges([sheet.getRange(2, 16, CLIENT_ROWS, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=REGEXMATCH($B2,"^Example")').setBackground(COLOR.input).setItalic(true).setRanges([sheet.getRange(2, 1, CLIENT_ROWS, CLIENT_COLUMNS.length)]).build(),
  ]);
  if (isNew) {
    const today = new Date();
    writeRow_(sheet, 2, 1, [
      'EXAMPLE',
      'Example: Chai Corner Café',
      'Riya Sharma',
      'riya@example.com',
      '+91 98765 43210',
      'Jaipur',
      DATA.clientTypes[1][0],
      'Websites & Digital Experiences',
      'Restaurant & hotel website',
      'Menu website with table reservations',
      today,
      new Date(today.getTime() + 21 * 86400000),
      'In progress',
      14999,
      7500,
    ]);
    writeRow_(sheet, 2, 17, ['Advance received', 'Website', '', 'Example row showing the format. Delete it when you add your first client. Dashboard totals ignore it.']);
  }
}

function buildClientTypes_(ss) {
  const sheet = freshSheet_(ss, TAB.clientTypes, COLOR.accentDark);
  title_(sheet, 'A1', 'Client types', 'Who the studio designs for, the services each client type usually needs, and how many clients of each type you have.');
  const head = ['Client type', 'What they need', 'Services we recommend', 'Starting from (₹)', 'Clients', 'Active projects', 'Quoted (₹)'];
  const top = 4;
  sheet.getRange(top, 1, 1, head.length).setValues([head]);
  header_(sheet.getRange(top, 1, 1, head.length));
  const rows = DATA.clientTypes.concat([['Other', 'Anything that does not fit the types above.', 'Custom quote', '']]);
  rows.forEach((t, i) => {
    const r = top + 1 + i;
    sheet.getRange(r, 1, 1, 4).setValues([[t[0], t[1], t[2], t[3]]]);
    sheet.getRange(r, 5, 1, 3).setFormulas([[
      '=COUNTIFS(Clients!$G$2:$G,$A' + r + ',Clients!$B$2:$B,' + NOT_EXAMPLE + ')',
      '=COUNTIFS(Clients!$G$2:$G,$A' + r + ',Clients!$M$2:$M,"In progress",Clients!$B$2:$B,' + NOT_EXAMPLE + ')+COUNTIFS(Clients!$G$2:$G,$A' + r + ',Clients!$M$2:$M,"In review",Clients!$B$2:$B,' + NOT_EXAMPLE + ')',
      '=SUMIFS(Clients!$N$2:$N,Clients!$G$2:$G,$A' + r + ',Clients!$B$2:$B,' + NOT_EXAMPLE + ')',
    ]]);
  });
  const body = sheet.getRange(top + 1, 1, rows.length, head.length);
  body.setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID).setWrap(true);
  sheet.getRange(top + 1, 1, rows.length, 1).setFontWeight('bold');
  sheet.getRange(top + 1, 4, rows.length, 1).setNumberFormat(INR);
  sheet.getRange(top + 1, 7, rows.length, 1).setNumberFormat(INR);
  sheet.getRange(top + 1, 4, rows.length, 4).setHorizontalAlignment('right');
  sheet.getRange(top + 1, 1, rows.length, head.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)
    .setFirstRowColor(COLOR.white).setSecondRowColor(COLOR.paper);
  [210, 300, 420, 120, 80, 110, 110].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  sheet.setRowHeight(top, 32);
  sheet.setFrozenRows(top);
}

function buildPricing_(ss) {
  const sheet = freshSheet_(ss, TAB.pricing, COLOR.muted);
  const head = ['Category', 'Service', 'Starting price (₹)', 'Per', 'What the starting price includes', 'Requested on website'];
  sheet.getRange(1, 1, 1, head.length).setValues([head]);
  header_(sheet.getRange(1, 1, 1, head.length));
  const rows = DATA.services.flatMap((s) => s.offers.map((o) => [s.name, o[0], o[1], o[2], o[3]]));
  // Text columns stay text; column C holds the prices.
  const textRows = rows.length + DATA.packages.length + 4;
  sheet.getRange(2, 1, textRows, 2).setNumberFormat(TEXT);
  sheet.getRange(2, 4, textRows, 2).setNumberFormat(TEXT);
  sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  // Pricing-page buttons send "Name — from ₹… / unit".
  const countFormula = (r) => '=COUNTIF(\'Service Requests\'!$I$2:$I,$B' + r + '&" — *")';
  sheet.getRange(2, 6, rows.length, 1).setFormulas(rows.map((_, i) => [countFormula(i + 2)]));
  const last = rows.length + 1;
  const pk = last + 3;
  section_(sheet, pk - 1, 1, 'Packages');
  const pkHead = ['Package', 'For', 'Price (₹)', 'Per', 'Includes', 'Requested on website'];
  sheet.getRange(pk, 1, 1, pkHead.length).setValues([pkHead]);
  header_(sheet.getRange(pk, 1, 1, pkHead.length));
  sheet.getRange(pk + 1, 1, DATA.packages.length, 5).setValues(DATA.packages);
  sheet.getRange(pk + 1, 6, DATA.packages.length, 1).setFormulas(DATA.packages.map((_, i) => [countFormula(pk + 1 + i)]));
  [[2, rows.length], [pk + 1, DATA.packages.length]].forEach((block) => {
    const range = sheet.getRange(block[0], 1, block[1], head.length);
    range.setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(block[0], 3, block[1], 1).setNumberFormat(INR);
    sheet.getRange(block[0], 5, block[1], 1).setWrap(true);
    sheet.getRange(block[0], 6, block[1], 1).setHorizontalAlignment('center');
  });
  [240, 320, 130, 110, 520, 120].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, last, head.length).createFilter();
}

function buildWebsite_(ss) {
  const sheet = freshSheet_(ss, TAB.website, COLOR.muted);
  title_(sheet, 'A1', 'Website reference', 'Business details, pages, search titles and where each form sends its data.');
  section_(sheet, 4, 1, 'Business details');
  const c = DATA.contact;
  const details = [
    ['Business name', 'Visionpact Flamingo Media'],
    ['Email', c.email],
    ['Phone 1', c.phones[0].label],
    ['Phone 2', c.phones[1].label],
    ['LinkedIn', c.linkedin],
    ['Instagram', c.instagram + '  (demo link, replace with the real profile)'],
    ['Currency', 'Indian rupee (INR, ₹)'],
    ['Area served', 'India'],
  ];
  sheet.getRange(5, 1, details.length, 2).setNumberFormat(TEXT).setValues(details);
  sheet.getRange(5, 1, details.length, 1).setFontWeight('bold');
  sheet.getRange(5, 1, details.length, 2).setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);

  const pr = 5 + details.length + 2;
  section_(sheet, pr - 1, 1, 'Pages');
  const pageHead = ['Page', 'Path', 'Purpose', 'Search title', 'Search keywords', 'Shown in Google'];
  sheet.getRange(pr, 1, 1, pageHead.length).setValues([pageHead]);
  header_(sheet.getRange(pr, 1, 1, pageHead.length));
  sheet.getRange(pr + 1, 1, DATA.pages.length, pageHead.length).setNumberFormat(TEXT).setValues(DATA.pages)
    .setWrap(true).setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);

  const fr = pr + DATA.pages.length + 3;
  section_(sheet, fr - 1, 1, 'Forms and where the data goes');
  const formHead = ['Form', 'Where on the website', 'Rows go to this tab', 'Also emailed to', 'Also stored in', 'Protection'];
  const forms = [
    ['Service request (contact form)', '/contact, and every button on the Pricing page', TAB.requests, c.email, 'Website database (inquiries table)', 'Same-site check, spam trap, size limit and a per-visitor rate limit'],
    ['Client feedback', '/studio (About) and /feedback', TAB.feedback, c.email, 'Website database (feedback table)', 'Same-site check, spam trap, size limit and a per-visitor rate limit'],
  ];
  sheet.getRange(fr, 1, 1, formHead.length).setValues([formHead]);
  header_(sheet.getRange(fr, 1, 1, formHead.length));
  sheet.getRange(fr + 1, 1, forms.length, formHead.length).setNumberFormat(TEXT).setValues(forms)
    .setWrap(true).setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);
  [190, 260, 300, 380, 360, 220].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

function buildGuide_(ss) {
  const sheet = freshSheet_(ss, TAB.guide, COLOR.muted);
  title_(sheet, 'A1', 'How to use this workbook');
  const rows = [
    ['Dashboard', 'Live totals for requests, packages, feedback and client projects. Every figure is a formula over the other tabs, so never type on it.'],
    [TAB.requests, 'One row per contact-form submission, added automatically within a few seconds. Selected package and Package price show what the visitor wants to buy when they came from a Pricing page button. Work each lead with Status, Follow-up date, Handled by and Notes.'],
    ['Request status', 'New: not yet contacted. Contacted: first reply sent. Quote sent: price and scope shared. Confirmed: the client agreed or paid, and the request is copied to Clients. Lost: not going ahead.'],
    [TAB.feedback, 'One row per feedback-form submission, added automatically. Quote feedback publicly only when "May we quote this?" is Yes, and use the first name only. Mark Reviewed once you have read it.'],
    [TAB.clients, 'Your project tracker. Confirmed website requests are added here automatically; add other clients by typing a name in column B (the Client ID fills itself). Balance is calculated from Quoted and Received.'],
    [TAB.clientTypes, 'The client types shown on the website with the services each usually needs, plus live counts from Clients.'],
    [TAB.pricing, 'Every service and package with the starting prices shown on the website, and how often each was requested.'],
    [TAB.website, 'Business details, every page with its search title and keywords, and where each form sends its data.'],
    [TAB.lists, 'The values behind every dropdown. Add a value at the end of a list to make it available.'],
    ['Colours', 'Dark headers: filled by the website. Darker orange headers: filled by the studio. Yellow rows: examples to delete.'],
    ['Automatic rows', 'Rows are written by the Apps Script attached to this sheet (Extensions > Apps Script). Keep the tab names and the column order of Service Requests and Feedback, or the website cannot write to them. Visionpact > Rebuild layout restores the formatting and keeps every row.'],
    ['Privacy', 'This sheet holds personal details from the website forms. Share it only with people who handle client requests.'],
  ];
  sheet.getRange(3, 1, rows.length, 2).setValues(rows).setWrap(true)
    .setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(3, 1, rows.length, 1).setFontWeight('bold');
  sheet.setColumnWidth(1, 190);
  sheet.setColumnWidth(2, 820);
}

function buildDashboard_(ss) {
  const sheet = freshSheet_(ss, TAB.dashboard, COLOR.accent);
  sheet.setHiddenGridlines(true);
  [230, 110, 120, 24, 220, 120, 24, 210, 100, 24, 210, 110].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  title_(sheet, 'A1', 'Visionpact Flamingo Media', 'Website requests, packages, client feedback and projects. Every figure updates from the other tabs.');
  const R = "'Service Requests'!";
  const thisMonth = '">="&(EOMONTH(TODAY(),-1)+1)';
  const topPackage = 'IFERROR(TRIM(REGEXEXTRACT(INDEX(QUERY(' + R + 'I2:I,"select I, count(I) where I <> \'\' group by I order by count(I) desc limit 1 label count(I) \'\'",0),1,1),"^[^—]*")),"None yet")';
  kpis_(sheet, 1, 'Service requests', [
    ['Total requests', '=COUNTA(' + R + 'B2:B)', '0'],
    ['Received this month', '=COUNTIFS(' + R + 'A2:A,' + thisMonth + ')', '0'],
    ['New, not yet contacted', '=COUNTIF(' + R + 'M2:M,"New")', '0'],
    ['Confirmed', '=COUNTIF(' + R + 'M2:M,"Confirmed")', '0'],
    ['Conversion rate', '=IFERROR(B8/B5,0)', '0.0%'],
  ], 2);
  kpis_(sheet, 5, 'Packages (purchases)', [
    ['Requests with a package', '=COUNTIF(' + R + 'I2:I,"?*")', '0'],
    ['Value requested', '=SUM(' + R + 'J2:J)', INR],
    ['Packages confirmed', '=COUNTIFS(' + R + 'I2:I,"?*",' + R + 'M2:M,"Confirmed")', '0'],
    ['Confirmed value', '=SUMIFS(' + R + 'J2:J,' + R + 'M2:M,"Confirmed")', INR],
    ['Most requested', '=' + topPackage, '0'],
  ]);
  kpis_(sheet, 8, 'Client feedback', [
    ['Feedback received', '=COUNTA(Feedback!B2:B)', '0'],
    ['Average rating (of 5)', '=IFERROR(AVERAGE(Feedback!F2:F),0)', '0.0'],
    ['5-star ratings', '=COUNTIF(Feedback!F2:F,5)', '0'],
    ['May be quoted', '=COUNTIF(Feedback!I2:I,"Yes")', '0'],
    ['Not yet reviewed', '=COUNTIFS(Feedback!B2:B,"<>",Feedback!K2:K,"<>Yes")', '0'],
  ]);
  kpis_(sheet, 11, 'Client projects', [
    ['Clients', '=COUNTIFS(Clients!B2:B,"<>",Clients!B2:B,' + NOT_EXAMPLE + ')', '0'],
    ['Active projects', '=COUNTIFS(Clients!M2:M,"In progress",Clients!B2:B,' + NOT_EXAMPLE + ')+COUNTIFS(Clients!M2:M,"In review",Clients!B2:B,' + NOT_EXAMPLE + ')', '0'],
    ['Total quoted', '=SUMIFS(Clients!N2:N,Clients!B2:B,' + NOT_EXAMPLE + ')', INR],
    ['Total received', '=SUMIFS(Clients!O2:O,Clients!B2:B,' + NOT_EXAMPLE + ')', INR],
    ['Outstanding', '=L7-L8', INR],
  ]);
  // The "Most requested" value is text, so it uses a smaller size.
  sheet.getRange('F9').setFontSize(10).setWrap(true);

  const listRef = (name, i) => '=Lists!' + String.fromCharCode(65 + LISTS.findIndex((l) => l[0] === name)) + (i + 2);
  const listLength = (name) => LISTS.find((l) => l[0] === name)[1].length;

  const services = listLength('Service category');
  table_(sheet, 12, 1, 'Requests by service', ['Service', 'Requests', 'Package value (₹)'], services, (r, i) => [
    listRef('Service category', i),
    '=COUNTIF(' + R + '$H$2:$H,$A' + r + ')',
    '=SUMIFS(' + R + '$J$2:$J,' + R + '$H$2:$H,$A' + r + ')',
  ], { 3: INR });
  table_(sheet, 12, 5, 'Requests by status', ['Status', 'Requests'], 5, (r, i) => [
    listRef('Request status', i),
    '=COUNTIF(' + R + '$M$2:$M,$E' + r + ')',
  ]);
  table_(sheet, 20, 5, 'Feedback by rating', ['Rating', 'Count'], 5, (r, i) => [
    5 - i,
    '=COUNTIF(Feedback!$F$2:$F,$E' + r + ')',
  ]);
  const types = listLength('Client type');
  table_(sheet, 12, 8, 'Clients by type', ['Client type', 'Clients'], types, (r, i) => [
    listRef('Client type', i),
    '=COUNTIFS(Clients!$G$2:$G,$H' + r + ',Clients!$B$2:$B,' + NOT_EXAMPLE + ')',
  ]);
  table_(sheet, 12, 11, 'Projects by status', ['Project status', 'Projects'], 7, (r, i) => [
    listRef('Project status', i),
    '=COUNTIFS(Clients!$M$2:$M,$K' + r + ',Clients!$B$2:$B,' + NOT_EXAMPLE + ')',
  ]);
  const trendTop = 12 + services + 3;
  table_(sheet, trendTop, 1, 'Last 6 months', ['Month', 'Requests', 'Feedback'], 6, (r, i) => [
    '=EOMONTH(TODAY(),' + (i - 6) + ')+1',
    '=COUNTIFS(' + R + '$A$2:$A,">="&$A' + r + ',' + R + '$A$2:$A,"<"&EDATE($A' + r + ',1))',
    '=COUNTIFS(Feedback!$A$2:$A,">="&$A' + r + ',Feedback!$A$2:$A,"<"&EDATE($A' + r + ',1))',
  ], { 1: 'mmm yyyy' });
  const latestTop = trendTop + 10;
  section_(sheet, latestTop, 1, 'Latest requests');
  sheet.getRange(latestTop + 1, 1, 1, 3).setValues([['Name', 'Received at', 'Status']]);
  header_(sheet.getRange(latestTop + 1, 1, 1, 3));
  sheet.getRange(latestTop + 2, 1).setFormula(
    '=IFERROR(ARRAY_CONSTRAIN(SORT(FILTER({' + R + 'C2:C,' + R + 'A2:A,' + R + 'M2:M},' + R + 'B2:B<>""),2,FALSE),8,3),"No requests yet")',
  );
  sheet.getRange(latestTop + 2, 2, 8, 1).setNumberFormat(DATETIME);
  section_(sheet, latestTop, 8, 'Latest feedback');
  sheet.getRange(latestTop + 1, 8, 1, 2).setValues([['Name', 'Rating']]);
  header_(sheet.getRange(latestTop + 1, 8, 1, 2));
  sheet.getRange(latestTop + 2, 8).setFormula(
    '=IFERROR(ARRAY_CONSTRAIN(SORT(FILTER({Feedback!C2:C,Feedback!F2:F,Feedback!A2:A},Feedback!B2:B<>""),3,FALSE),8,2),"No feedback yet")',
  );

  const chartRow = latestTop + 12;
  sheet.insertChart(
    sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange(trendTop + 1, 1, 7, 3))
      .setNumHeaders(1)
      .setPosition(chartRow, 1, 0, 0)
      .setOption('title', 'Requests and feedback, last 6 months')
      .setOption('colors', [COLOR.accent, COLOR.ink])
      .setOption('legend', { position: 'bottom' })
      .setOption('width', 600)
      .setOption('height', 300)
      .build(),
  );
  sheet.insertChart(
    sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange(13, 1, services + 1, 2))
      .setNumHeaders(1)
      .setPosition(chartRow, 8, 0, 0)
      .setOption('title', 'Requests by service')
      .setOption('colors', [COLOR.accentDark])
      .setOption('legend', { position: 'none' })
      .setOption('width', 640)
      .setOption('height', 300)
      .build(),
  );
}

// A block of five figures with a title: label in one column, value in the next
// `span` columns (merged).
function kpis_(sheet, col, titleText, items, span) {
  const width = 1 + (span || 1);
  sheet.getRange(4, col, 1, width).setBackground(COLOR.accent);
  sheet.getRange(4, col).setValue(titleText).setFontWeight('bold').setFontSize(11).setVerticalAlignment('middle');
  sheet.setRowHeight(4, 30);
  items.forEach((item, i) => {
    const row = 5 + i;
    sheet.getRange(row, col).setValue(item[0]).setVerticalAlignment('middle');
    const value = sheet.getRange(row, col + 1, 1, width - 1);
    if (width > 2) value.merge();
    sheet.getRange(row, col + 1).setFormula(item[1]);
    value.setNumberFormat(item[2])
      .setFontSize(15).setFontWeight('bold').setHorizontalAlignment('right').setVerticalAlignment('middle');
    sheet.getRange(row, col, 1, width).setBackground(COLOR.paper)
      .setBorder(true, true, true, true, null, null, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(row, 30);
  });
}

// A titled summary table; rowFn(row, index) returns the row's values or formulas.
function table_(sheet, top, col, titleText, head, count, rowFn, formats) {
  section_(sheet, top, col, titleText);
  sheet.getRange(top + 1, col, 1, head.length).setValues([head]);
  header_(sheet.getRange(top + 1, col, 1, head.length));
  const rows = [];
  for (let i = 0; i < count; i++) rows.push(rowFn(top + 2 + i, i));
  const body = sheet.getRange(top + 2, col, count, head.length);
  body.setFormulas(rows.map((r) => r.map((v) => (typeof v === 'string' && v.charAt(0) === '=' ? v : ''))));
  rows.forEach((r, i) => r.forEach((v, j) => {
    if (!(typeof v === 'string' && v.charAt(0) === '=')) sheet.getRange(top + 2 + i, col + j).setValue(v);
  }));
  body.setBorder(true, true, true, true, true, true, '#e3d9cf', SpreadsheetApp.BorderStyle.SOLID).setVerticalAlignment('middle');
  sheet.getRange(top + 2, col + 1, count, head.length - 1).setHorizontalAlignment('right');
  sheet.getRange(top + 2, col, count, 1).setWrap(true);
  Object.keys(formats || {}).forEach((k) => sheet.getRange(top + 2, col + Number(k) - 1, count, 1).setNumberFormat(formats[k]));
}
