// trainers.js — single source of truth for all trainer data
// To add a new trainer:
//   1. Add an object to TRAINERS below
//   2. Create their Calendly account (danny1on1training+name@gmail.com → calendly.com/danny1on1training-name)
//   3. Add their photo to brand_assets/ and set the photo field
//   Done — both pages update automatically

var TRAINERS = [
  {
    id: 'Danny',
    name: 'Danny',
    role: 'Head Trainer',
    defaultSelected: true,
    showOnTeamPage: false,
    photo: '',
    calendly: 'https://calendly.com/danny1on1training?hide_gdpr_banner=1&background_color=1e293b&text_color=f8fafc&primary_color=22c55e',
    tags: [],
    credentials: [],
    locations: [
      { name: 'Harry Downes Field',          address: '24 Highland Rd, Brookline, MA 02445',       lat: 42.3248696, lng: -71.1184854 },
      { name: 'Brookline High School Field', address: '115 Greenough St, Brookline, MA 02445',      lat: 42.3312588, lng: -71.1262643 },
      { name: 'The Park School',             address: '171 Goddard Ave, Brookline, MA 02445',       lat: 42.3163183, lng: -71.1366620 },
      { name: 'Newton South Field',          address: '140 Brandeis Rd, Newton, MA 02459',          lat: 42.3132195, lng: -71.1874152 },
      { name: 'Warren-Lincoln Playground',   address: '29 Montclair Rd, Waban, MA 02468',           lat: 42.3295088, lng: -71.2280627 },
      { name: 'Coolidge Corner School',      address: '345 Harvard St, Brookline, MA 02446',        lat: 42.3449239, lng: -71.1236747 }
    ]
  },
  {
    id: 'Bobby',
    name: 'Bobby',
    role: 'MLS Next · D1',
    showOnTeamPage: true,
    photo: '',
    calendly: 'https://calendly.com/danny1on1training-bobby/30min?hide_gdpr_banner=1&background_color=1e293b&text_color=f8fafc&primary_color=22c55e',
    tags: ['MLS Next', 'National Team', 'D1 Recruit'],
    credentials: [
      { icon: 'shield',     title: 'Seacoast United U17 — MLS Next',    sub: "Starter for one of New England's top youth programs in the nation's premier development league" },
      { icon: 'globe',      title: 'Bulgaria U17 Youth National Team',   sub: 'Internationally selected to represent Bulgaria at the highest youth international level' },
      { icon: 'graduation', title: 'Multiple Top D1 Official Visits',    sub: 'Recruited by and visiting elite NCAA Division I programs across the country' }
    ],
    locations: [
      // Update with Bobby's actual training locations
      { name: 'Harry Downes Field',          address: '24 Highland Rd, Brookline, MA 02445',       lat: 42.3248696, lng: -71.1184854 },
      { name: 'Brookline High School Field', address: '115 Greenough St, Brookline, MA 02445',      lat: 42.3312588, lng: -71.1262643 }
    ]
  },
  {
    id: 'Elias',
    name: 'Elias',
    role: 'USL2 · D1',
    showOnTeamPage: true,
    photo: 'brand_assets/elias.png',
    calendly: 'https://calendly.com/danny1on1training-elias/30min?hide_gdpr_banner=1&background_color=1e293b&text_color=f8fafc&primary_color=22c55e',
    tags: ['USL2', 'D1 Soccer', 'MLS Next'],
    credentials: [
      { icon: 'trophy',     title: 'Seacoast United Phantoms — USL2',         sub: "Pre-professional experience with one of New England's premier clubs" },
      { icon: 'graduation', title: 'Fairfield University — NCAA D1 Soccer',    sub: 'Competing at the highest level of collegiate soccer' },
      { icon: 'shield',     title: 'Seacoast United — MLS Next',               sub: 'Competed in the top youth development league in the United States' },
      { icon: 'star',       title: 'Boston College High School — 4 Years Varsity', sub: "Four-year varsity starter at one of New England's top high school programs" }
    ],
    locations: [
      // Update with Elias's actual training locations
      { name: 'Harry Downes Field',          address: '24 Highland Rd, Brookline, MA 02445',       lat: 42.3248696, lng: -71.1184854 },
      { name: 'Newton South Field',          address: '140 Brandeis Rd, Newton, MA 02459',          lat: 42.3132195, lng: -71.1874152 }
    ]
  }
,
  {
    id: "tony",
    name: "Tony Zhang",
    role: "Elite",
    showOnTeamPage: true,
    photo: "brand_assets/tony-zhang.jpg",
    calendly: "https://calendly.com/danny1on1training-tony/30min?hide_gdpr_banner=1&background_color=1e293b&text_color=f8fafc&primary_color=22c55e",
    tags: ["Elite"],
    credentials: [
      { icon: "shield", title: "asdasd", sub: "" }
    ],
    locations: [
      { name: "Harry Downes Field", address: "24 Highland Rd, Brookline, MA 02445", lat: 42.3248696, lng: -71.1184854 },
      { name: "Harry Downes Field", address: "24 Highland Rd, Brookline, MA 02445", lat: 42.3248696, lng: -71.1184854 },
      { name: "Harry Downes Field", address: "24 Highland Rd, Brookline, MA 02445", lat: 42.3248696, lng: -71.1184854 },
      { name: "Harry Downes Field", address: "24 Highland Rd, Brookline, MA 02445", lat: 42.3248696, lng: -71.1184854 },
      { name: "Harry Downes Field", address: "24 Highland Rd, Brookline, MA 02445", lat: 42.3248696, lng: -71.1184854 }
    ]
  }
];

var TRAINER_ICONS = {
  shield:     '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  globe:      '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  graduation: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  trophy:     '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
  star:       '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
};

var CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function renderTrainerSelector(gridId) {
  var grid = document.getElementById(gridId);
  if (!grid) return;
  TRAINERS.forEach(function(t) {
    var div = document.createElement('div');
    div.className = 'trainer-option' + (t.defaultSelected ? ' trainer-option--active' : '');
    div.dataset.trainer = t.id;
    div.dataset.calendly = t.calendly;
    div.innerHTML =
      '<div class="trainer-option__avatar">' + t.name[0] + '</div>' +
      '<div class="trainer-option__info">' +
        '<p class="trainer-option__name">' + t.name + '</p>' +
        '<p class="trainer-option__role">' + t.role + '</p>' +
      '</div>' +
      '<div class="trainer-option__check">' + CHECK_SVG + '</div>';
    grid.appendChild(div);
  });
}

function renderTeamCards(gridId) {
  var grid = document.getElementById(gridId);
  if (!grid) return;
  var delays = ['delay-1', 'delay-2', 'delay-3', 'delay-4'];
  TRAINERS.filter(function(t) { return t.showOnTeamPage; }).forEach(function(t, i) {
    var initial = t.name[0];
    var tagsHtml = t.tags.map(function(tag) {
      return '<span class="player-tag">' + tag + '</span>';
    }).join('');
    var credsHtml = t.credentials.map(function(cred) {
      return '<div class="cred-item">' +
        '<div class="cred-icon">' + (TRAINER_ICONS[cred.icon] || '') + '</div>' +
        '<div>' +
          '<div class="cred-title">' + cred.title + '</div>' +
          '<div class="cred-sub">' + cred.sub + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    var delay = delays[i] || 'delay-1';
    var card = document.createElement('div');
    card.className = 'player-card animate-fadeup ' + delay;
    card.innerHTML =
      '<div class="player-photo-frame">' +
        '<img class="player-photo-img" src="' + (t.photo || '') + '" alt="' + t.name + '" onerror="this.style.display=\'none\'">' +
        '<div class="player-photo-fallback">' +
          '<span class="player-photo-initial">' + initial + '</span>' +
          '<span class="player-photo-hint">Photo coming soon</span>' +
        '</div>' +
      '</div>' +
      '<div class="player-card__header">' +
        '<div class="player-card__top">' +
          '<div class="player-card__avatar">' + initial + '</div>' +
          '<div>' +
            '<h2 class="player-card__name">' + t.name + '</h2>' +
            '<div class="player-card__tags">' + tagsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="player-card__body">' +
        '<div class="creds-label">Credentials</div>' +
        '<div class="creds-list">' + credsHtml + '</div>' +
      '</div>';
    grid.appendChild(card);
  });
}
