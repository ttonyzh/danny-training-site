// ============================================================
// Danny Elite Training — Trainer Intake Form
// Google Apps Script
//
// HOW TO USE:
//   1. Go to https://script.google.com → New Project
//   2. Paste this entire file
//   3. Go to Project Settings (gear icon) → Script Properties
//      Add property: GITHUB_TOKEN  →  your GitHub PAT
//      (Create at: github.com/settings/tokens → Fine-grained → repo Contents write)
//   4. Run → createTrainerForm()  (one time only — creates the form)
//   5. Run → installSubmitTrigger() (one time only — enables auto-publish)
//
// After that: every trainer submission automatically updates the live site.
// You'll also get an email reminder to create their Calendly account.
// ============================================================

var GITHUB_OWNER = 'ttonyzh';
var GITHUB_REPO  = 'danny-training-site';
var GITHUB_BRANCH = 'main';
var OWNER_EMAIL  = 'ttonyzh@gmail.com';

// ── STEP 1: Create the form ──────────────────────────────────
function createTrainerForm() {
  var form = FormApp.create('Danny Elite Training — Trainer Application');

  form.setDescription(
    'Welcome to the Danny Elite Training team! Fill this out completely and accurately — ' +
    'the more training fields you list, the higher your chance of being matched with players near you. ' +
    'You\'ll receive a confirmation email once your profile is live.'
  );
  form.setCollectEmail(true);
  form.setConfirmationMessage(
    'Thanks! Your profile is being set up. You\'ll hear from Danny within 48 hours with your Calendly booking link.'
  );

  // ── Section 1: Personal Info ─────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Personal Information');

  form.addTextItem()
    .setTitle('Full Name')
    .setHelpText('First and last name — this is how you\'ll appear on the site.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Phone Number')
    .setHelpText('For Danny to reach you directly.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email Address')
    .setHelpText('Confirmation and communications will go here.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Short Bio')
    .setHelpText(
      'Write 2–3 sentences about yourself as a player and trainer. ' +
      'This appears on your profile page. Example: "I\'m a D1 soccer player at Fairfield University ' +
      'with experience in MLS Next and USL2. I specialize in technical development and 1v1 finishing. ' +
      'I\'m passionate about helping younger players reach their potential."'
    )
    .setRequired(true);

  // ── Section 2: Soccer Background ─────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Soccer Background');

  form.addParagraphTextItem()
    .setTitle('Teams Played For / Currently Playing')
    .setHelpText(
      'List all notable clubs and teams — current first, then past. Include level and years where possible.\n' +
      'Example:\n' +
      '• Fairfield University — NCAA D1 (current)\n' +
      '• Seacoast United Phantoms — USL2 (2024)\n' +
      '• Seacoast United — MLS Next (2022–2023)'
    )
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Accolades & Achievements')
    .setHelpText(
      'List your standout accomplishments. Each line becomes a credential card on your profile.\n' +
      'Example:\n' +
      '• 4 Years Varsity — Boston College High School\n' +
      '• Bulgaria U17 Youth National Team\n' +
      '• Multiple Top D1 Official Visits'
    )
    .setRequired(true);

  // ── Section 3: Training Specialties ──────────────────────
  form.addSectionHeaderItem()
    .setTitle('Training Specialties');

  var specItem = form.addCheckboxItem();
  specItem.setTitle('Training Specialties')
          .setHelpText('Select all that apply — these help parents find the right fit for their child.')
          .setChoices([
            specItem.createChoice('Technical / Ball Mastery'),
            specItem.createChoice('Finishing & Shooting'),
            specItem.createChoice('1v1 Attacking & Defending'),
            specItem.createChoice('Speed & Agility'),
            specItem.createChoice('Positioning & Movement'),
            specItem.createChoice('Passing & Combination Play'),
            specItem.createChoice('Defending & Pressing'),
            specItem.createChoice('Goalkeeper Training')
          ])
          .setRequired(true);

  // ── Section 4: Profile Photo ──────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Profile Photo');

  form.addParagraphTextItem()
    .setTitle('Profile Photo — Google Drive Link')
    .setHelpText(
      'Upload your photo to Google Drive, right-click it → "Share" → set to "Anyone with the link can view" → paste the link here. ' +
      'Use a clear, well-lit photo (action or training shot preferred). JPG or PNG only. ' +
      'This appears on your trainer card on the website.'
    )
    .setRequired(true);

  // ── Section 5: Training Locations ────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Training Locations')
    .setHelpText(
      '⚠️ You must provide at least 5 fields. The more locations you list, the higher your ' +
      'chance of being matched with players near them. Include the complete address (street, city, state, zip).'
    );

  var fieldNums = ['1', '2', '3', '4', '5', '6 (optional)', '7 (optional)', '8 (optional)'];
  var required  = [true, true, true, true, true, false, false, false];

  for (var i = 0; i < fieldNums.length; i++) {
    var req = required[i];
    form.addTextItem()
      .setTitle('Field ' + fieldNums[i] + ' — Name')
      .setHelpText(req ? 'e.g. Harry Downes Field' : 'Leave blank if fewer than ' + fieldNums[i] + ' fields.')
      .setRequired(req);

    form.addTextItem()
      .setTitle('Field ' + fieldNums[i] + ' — Full Address')
      .setHelpText(req ? 'e.g. 24 Highland Rd, Brookline, MA 02445' : '')
      .setRequired(req);
  }

  // ── Link to response sheet ────────────────────────────────
  var sheet = SpreadsheetApp.create('Danny Elite Training — Trainer Applications');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // ── Log URLs ──────────────────────────────────────────────
  Logger.log('✅ Form created!');
  Logger.log('📋 Share this link with trainers: ' + form.getPublishedUrl());
  Logger.log('✏️  Edit the form here:           ' + form.getEditUrl());
  Logger.log('📊 Responses sheet:               ' + sheet.getUrl());
  Logger.log('');
  Logger.log('Next: run installSubmitTrigger() to enable auto-publishing.');

  // Store form ID for the trigger
  PropertiesService.getScriptProperties().setProperty('FORM_ID', form.getId());
}


// ── STEP 2: Install the auto-publish trigger ─────────────────
function installSubmitTrigger() {
  var formId = PropertiesService.getScriptProperties().getProperty('FORM_ID');
  if (!formId) {
    throw new Error('Run createTrainerForm() first.');
  }
  ScriptApp.newTrigger('onTrainerSubmit')
    .forForm(formId)
    .onFormSubmit()
    .create();
  Logger.log('✅ Trigger installed. New submissions will auto-publish to the site.');
}


// ── STEP 3: Auto-publish handler (runs on every submission) ──
function onTrainerSubmit(e) {
  try {
    var resp    = e.response;
    var answers = resp.getItemResponses();
    var data    = {};

    answers.forEach(function(r) {
      data[r.getItem().getTitle()] = r.getResponse();
    });

    var name        = (data['Full Name'] || '').trim();
    var email       = data['Email Address'] || resp.getRespondentEmail() || '';
    var phone       = data['Phone Number'] || '';
    var bio         = data['Short Bio'] || '';
    var teams       = data['Teams Played For / Currently Playing'] || '';
    var accolades   = data['Accolades & Achievements'] || '';
    var specialties = data['Training Specialties'] || [];
    var photoLink   = data['Profile Photo — Google Drive Link'] || '';

    // Collect training fields (up to 8)
    var locations = [];
    var fieldNums = ['1', '2', '3', '4', '5', '6 (optional)', '7 (optional)', '8 (optional)'];
    fieldNums.forEach(function(n) {
      var fName = (data['Field ' + n + ' — Name'] || '').trim();
      var fAddr = (data['Field ' + n + ' — Full Address'] || '').trim();
      if (fName && fAddr) {
        locations.push({ name: fName, address: fAddr });
      }
    });

    // Upload profile photo to GitHub from Drive share link
    var photoPath = '';
    if (photoLink) {
      var fileId = extractDriveId(photoLink);
      if (fileId) {
        var fileName = slugify(name) + '.jpg';
        photoPath    = 'brand_assets/' + fileName;
        uploadPhotoToGitHub(fileId, photoPath);
      }
    }

    // Build credential objects from accolade lines
    var credIcons   = ['shield', 'globe', 'graduation', 'trophy', 'star'];
    var credLines   = accolades.split('\n').map(function(l) { return l.replace(/^[•\-*]\s*/, '').trim(); }).filter(Boolean);
    var credentials = credLines.map(function(line, i) {
      return {
        icon:  credIcons[i % credIcons.length],
        title: line,
        sub:   ''
      };
    });

    // Build location objects (geocoding not available here — lat/lng TBD)
    // Tony will need to fill in lat/lng for the map markers
    var locationObjs = locations.map(function(loc) {
      return {
        name:    loc.name,
        address: loc.address,
        lat:     0,
        lng:     0
      };
    });

    // Build tag list from teams + accolades
    var tags = [];
    if (teams.match(/USL2/i))          tags.push('USL2');
    if (teams.match(/MLS Next/i))      tags.push('MLS Next');
    if (teams.match(/D1|Division I/i)) tags.push('D1 Soccer');
    if (teams.match(/National Team/i)) tags.push('National Team');
    if (tags.length === 0)             tags.push('Elite');

    // Build the new trainer object as a JS string
    var id           = slugify(name, true);
    var calendlySlug = 'danny1on1training-' + id;

    var trainerObj = buildTrainerString({
      id:          id,
      name:        name,
      role:        tags.slice(0, 2).join(' · '),
      photo:       photoPath,
      calendly:    'https://calendly.com/' + calendlySlug + '/30min?hide_gdpr_banner=1&background_color=1e293b&text_color=f8fafc&primary_color=22c55e',
      tags:        tags,
      credentials: credentials,
      locations:   locationObjs,
      bio:         bio
    });

    // Append to trainers.js in GitHub
    appendTrainerToGitHub(trainerObj, name);

    // Email Danny with Calendly setup instructions + geo reminder
    sendNotificationEmail(name, email, phone, calendlySlug, locationObjs, bio, teams, accolades, specialties);

    Logger.log('✅ ' + name + '\'s profile published successfully.');

  } catch (err) {
    Logger.log('❌ Error: ' + err.message);
    MailApp.sendEmail(OWNER_EMAIL, '⚠️ Trainer form error', 'Error processing submission: ' + err.message + '\n\nStack: ' + err.stack);
  }
}


// ── GitHub helpers ────────────────────────────────────────────

function getGithubToken() {
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN not set in Script Properties.');
  return token;
}

function githubRequest(method, path, body) {
  var options = {
    method:  method,
    headers: {
      'Authorization': 'token ' + getGithubToken(),
      'Accept':        'application/vnd.github.v3+json',
      'Content-Type':  'application/json'
    },
    muteHttpExceptions: true
  };
  if (body) options.payload = JSON.stringify(body);
  var url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + path;
  var res = UrlFetchApp.fetch(url, options);
  return JSON.parse(res.getContentText());
}

function getFileSha(path) {
  var res = githubRequest('GET', '/contents/' + path + '?ref=' + GITHUB_BRANCH);
  return res.sha || null;
}

function appendTrainerToGitHub(trainerString, trainerName) {
  var path = 'trainers.js';
  var res  = githubRequest('GET', '/contents/' + path + '?ref=' + GITHUB_BRANCH);
  var currentContent = Utilities.newBlob(Utilities.base64Decode(res.content.replace(/\n/g, ''))).getDataAsString();
  var sha = res.sha;

  // Insert before the closing ]; of the TRAINERS array
  var insertPoint = currentContent.lastIndexOf('];');
  if (insertPoint === -1) throw new Error('Could not find ]; in trainers.js');

  var newContent = currentContent.slice(0, insertPoint) + ',\n' + trainerString + '\n' + currentContent.slice(insertPoint);
  var encoded    = Utilities.base64Encode(Utilities.newBlob(newContent).getBytes());

  githubRequest('PUT', '/contents/' + path, {
    message: 'Add trainer profile: ' + trainerName,
    content: encoded,
    sha:     sha,
    branch:  GITHUB_BRANCH
  });
}

function uploadPhotoToGitHub(driveFileId, repoPath) {
  var file    = DriveApp.getFileById(driveFileId);
  var bytes   = file.getBlob().getBytes();
  var encoded = Utilities.base64Encode(bytes);
  var sha     = getFileSha(repoPath);

  var body = {
    message: 'Add trainer photo: ' + repoPath,
    content: encoded,
    branch:  GITHUB_BRANCH
  };
  if (sha) body.sha = sha;

  githubRequest('PUT', '/contents/' + repoPath, body);
}

function extractDriveId(url) {
  var match = url.match(/[-\w]{25,}/);
  return match ? match[0] : url;
}


// ── Trainer JS object builder ─────────────────────────────────

function buildTrainerString(t) {
  var tagsStr  = JSON.stringify(t.tags);
  var credsStr = '[\n' + t.credentials.map(function(c) {
    return '      { icon: ' + JSON.stringify(c.icon) + ', title: ' + JSON.stringify(c.title) + ', sub: ' + JSON.stringify(c.sub) + ' }';
  }).join(',\n') + '\n    ]';

  var locsStr = '[\n' + t.locations.map(function(l) {
    return '      // TODO: fill in lat/lng for map marker\n      { name: ' + JSON.stringify(l.name) + ', address: ' + JSON.stringify(l.address) + ', lat: 0, lng: 0 }';
  }).join(',\n') + '\n    ]';

  return [
    '  {',
    '    id: '           + JSON.stringify(t.id)          + ',',
    '    name: '         + JSON.stringify(t.name)        + ',',
    '    role: '         + JSON.stringify(t.role)        + ',',
    '    showOnTeamPage: true,',
    '    photo: '        + JSON.stringify(t.photo)       + ',',
    '    calendly: '     + JSON.stringify(t.calendly)    + ',',
    '    tags: '         + tagsStr                       + ',',
    '    credentials: '  + credsStr                      + ',',
    '    locations: '    + locsStr,
    '  }'
  ].join('\n');
}


// ── Notification email to Danny ───────────────────────────────

function sendNotificationEmail(name, email, phone, calendlySlug, locations, bio, teams, accolades, specialties) {
  var subject = '🟢 New Trainer Profile Published: ' + name;

  var locationList = locations.map(function(l, i) {
    return (i + 1) + '. ' + l.name + '\n   ' + l.address + '\n   ⚠️ TODO: Find lat/lng and update trainers.js';
  }).join('\n\n');

  var body = [
    name + '\'s profile has been automatically added to trainers.js and pushed to the live site.',
    '',
    '══ ACTION REQUIRED ══════════════════════════════',
    '',
    '1. CREATE CALENDLY ACCOUNT',
    '   Email: danny1on1training+' + calendlySlug.replace('danny1on1training-', '') + '@gmail.com',
    '   Username: ' + calendlySlug,
    '   Connect their Google Calendar in Calendly settings.',
    '   Then update their calendly URL in trainers.js.',
    '',
    '2. ADD MAP COORDINATES',
    '   Look up each field on Google Maps, grab the lat/lng from the URL,',
    '   and update their locations array in trainers.js:',
    '',
    locationList,
    '',
    '═════════════════════════════════════════════════',
    '',
    '── TRAINER DETAILS ──────────────────────────────',
    'Name:       ' + name,
    'Email:      ' + email,
    'Phone:      ' + phone,
    '',
    'Bio:',
    bio,
    '',
    'Teams:',
    teams,
    '',
    'Accolades:',
    accolades,
    '',
    'Specialties: ' + (Array.isArray(specialties) ? specialties.join(', ') : specialties),
  ].join('\n');

  MailApp.sendEmail(OWNER_EMAIL, subject, body);
}


// ── Utility ───────────────────────────────────────────────────

function slugify(name, camel) {
  var parts = name.toLowerCase().trim().split(/\s+/);
  if (camel) return parts[0];
  return parts.join('-');
}
