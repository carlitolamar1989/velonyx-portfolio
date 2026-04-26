/**
 * GARAGE DOOR KINGS — Mock Data
 * ─────────────────────────────────────────────────────────────
 * All fake-but-realistic data that powers the customer portal,
 * admin dashboard, and any demo flow that needs "live business" feel.
 *
 * Conventions:
 *   - Phone numbers use 702-555-XXXX (FCC-reserved fake-number prefix)
 *   - Names mix ethnicities/demographics common to Las Vegas
 *   - Addresses are in real LV-area neighborhoods
 *   - Dates are relative to "today" via a single GDK_TODAY constant so
 *     the demo always feels current
 * ─────────────────────────────────────────────────────────────
 */

// Fixed reference "today" for relative dates (kept stable so portal/
// admin always render consistent timelines).
const GDK_TODAY = new Date();
GDK_TODAY.setHours(0, 0, 0, 0);

// Helper: date offset in days from today
function _d(daysOffset, hour = 9, minute = 0) {
  const d = new Date(GDK_TODAY);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

const NEIGHBORHOODS = ['Henderson', 'Summerlin', 'Paradise', 'Spring Valley', 'Enterprise', 'North Las Vegas', 'Boulder City', 'Las Vegas'];
const STREETS = [
  'Eastern Ave', 'W Sahara Ave', 'S Decatur Blvd', 'E Tropicana Ave', 'N Buffalo Dr',
  'W Charleston Blvd', 'E Flamingo Rd', 'S Rainbow Blvd', 'W Russell Rd', 'N Pecos Rd',
  'Sunset Rd', 'Horizon Ridge Pkwy', 'Town Center Dr', 'Anthem Pkwy', 'Mountain Vista St',
];
const SERVICES_OFFERED = [
  { id: 'emergency',   name: 'Emergency Repair',   priceFrom: 89,   avg: 245 },
  { id: 'spring',      name: 'Spring Replacement', priceFrom: 285,  avg: 425 },
  { id: 'opener',      name: 'Opener Install',     priceFrom: 489,  avg: 685 },
  { id: 'new-door',    name: 'New Door Install',   priceFrom: 1450, avg: 1850 },
  { id: 'commercial',  name: 'Commercial Doors',   priceFrom: 2400, avg: 3200 },
  { id: 'maintenance', name: 'Maintenance Plans',  priceFrom: 149,  avg: 199 },
];

// ─────────────────────────────────────────────────────────────
// CUSTOMERS (15-20 with realistic LV diversity)
// ─────────────────────────────────────────────────────────────
const GDK_CUSTOMERS = [
  { id: 'cust-001', name: 'Michael Robinson', email: 'michael.r@example.com', phone: '702-555-0142', address: '8742 Horizon Ridge Pkwy, Henderson, NV 89052', neighborhood: 'Henderson', joinedDate: _d(-184), lifetimeValue: 1850 },
  { id: 'cust-002', name: 'Maria Gonzalez',    email: 'mgonzalez@example.com',  phone: '702-555-0203', address: '12 Sunset Mesa Ct, Henderson, NV 89052', neighborhood: 'Henderson', joinedDate: _d(-92),  lifetimeValue: 285 },
  { id: 'cust-003', name: 'James Chen',        email: 'jchen@example.com',      phone: '702-555-0317', address: '4408 Buffalo Dr, Las Vegas, NV 89129', neighborhood: 'Summerlin', joinedDate: _d(-410), lifetimeValue: 2435 },
  { id: 'cust-004', name: 'Aisha Williams',    email: 'aisha.w@example.com',    phone: '702-555-0489', address: '2156 Mountain Vista St, Henderson, NV 89014', neighborhood: 'Henderson', joinedDate: _d(-58),  lifetimeValue: 489 },
  { id: 'cust-005', name: 'Tony Romano',       email: 'tromano@example.com',    phone: '702-555-0571', address: '7720 W Russell Rd, Spring Valley, NV 89117', neighborhood: 'Spring Valley', joinedDate: _d(-22),  lifetimeValue: 645 },
  { id: 'cust-006', name: 'Sarah Patel',       email: 'spatel@example.com',     phone: '702-555-0628', address: '1100 Town Center Dr, Summerlin, NV 89144', neighborhood: 'Summerlin', joinedDate: _d(-138), lifetimeValue: 1850 },
  { id: 'cust-007', name: 'Derek Johnson',     email: 'derek.j@example.com',    phone: '702-555-0745', address: '630 N Pecos Rd, Las Vegas, NV 89101', neighborhood: 'Las Vegas', joinedDate: _d(-301), lifetimeValue: 3200 },
  { id: 'cust-008', name: 'Linda Nguyen',      email: 'lnguyen@example.com',    phone: '702-555-0816', address: '8855 Anthem Pkwy, Henderson, NV 89052', neighborhood: 'Henderson', joinedDate: _d(-67),  lifetimeValue: 425 },
  { id: 'cust-009', name: 'Carlos Mendoza',    email: 'cmendoza@example.com',   phone: '702-555-0901', address: '450 Boulder City Pkwy, Boulder City, NV 89005', neighborhood: 'Boulder City', joinedDate: _d(-12),  lifetimeValue: 89 },
  { id: 'cust-010', name: 'Jenna Taylor',      email: 'jtaylor@example.com',    phone: '702-555-1024', address: '3320 N Las Vegas Blvd, North Las Vegas, NV 89030', neighborhood: 'North Las Vegas', joinedDate: _d(-203), lifetimeValue: 685 },
  { id: 'cust-011', name: 'Marcus Lee',        email: 'mlee@example.com',       phone: '702-555-1147', address: '6618 W Charleston Blvd, Las Vegas, NV 89146', neighborhood: 'Las Vegas', joinedDate: _d(-78),  lifetimeValue: 285 },
  { id: 'cust-012', name: 'Rachel O\'Brien',   email: 'robrien@example.com',    phone: '702-555-1218', address: '950 Eastern Ave, Henderson, NV 89014', neighborhood: 'Henderson', joinedDate: _d(-340), lifetimeValue: 2150 },
  { id: 'cust-013', name: 'Hassan Ali',        email: 'hali@example.com',       phone: '702-555-1392', address: '1255 S Rainbow Blvd, Spring Valley, NV 89146', neighborhood: 'Spring Valley', joinedDate: _d(-44),  lifetimeValue: 489 },
  { id: 'cust-014', name: 'Stephanie Brown',   email: 'sbrown@example.com',     phone: '702-555-1483', address: '7741 E Flamingo Rd, Las Vegas, NV 89121', neighborhood: 'Paradise', joinedDate: _d(-156), lifetimeValue: 1450 },
  { id: 'cust-015', name: 'Ricardo Vasquez',   email: 'rvasquez@example.com',   phone: '702-555-1547', address: '2200 Sunset Rd, Henderson, NV 89014', neighborhood: 'Henderson', joinedDate: _d(-31),  lifetimeValue: 425 },
  { id: 'cust-016', name: 'Karen Murphy',      email: 'kmurphy@example.com',    phone: '702-555-1638', address: '8101 W Sahara Ave, Las Vegas, NV 89117', neighborhood: 'Las Vegas', joinedDate: _d(-95),  lifetimeValue: 685 },
  { id: 'cust-017', name: 'Tyrone Washington', email: 'twashington@example.com',phone: '702-555-1729', address: '3434 N Buffalo Dr, Las Vegas, NV 89129', neighborhood: 'Summerlin', joinedDate: _d(-220), lifetimeValue: 1850 },
];

// ─────────────────────────────────────────────────────────────
// LEADS (40-60 with status distribution)
// New: 12 · Contacted: 15 · Estimated: 10 · Won: 15 · Lost: 8 = 60
// ─────────────────────────────────────────────────────────────
const _LEAD_NAMES_NEW = [
  'Pamela Stewart', 'Jordan Phillips', 'Vanessa Cruz', 'Eric Sandoval', 'Yuki Tanaka',
  'Brandon Walsh', 'Tasha Edwards', 'Samuel Mensah', 'Olivia Reyes', 'Garrett Hunt',
  'Priya Sharma', 'Wendell Carter',
];
const _LEAD_NAMES_CONTACTED = [
  'Anthony Russo', 'Bianca Foster', 'Christopher Yi', 'Denise Holloway', 'Edgar Salinas',
  'Felicia Park', 'Gregory Adams', 'Hannah Schmitt', 'Isaiah Brooks', 'Janet Iverson',
  'Khalil Banks', 'Lauren Maxwell', 'Miguel Espinoza', 'Natalie Curtis', 'Owen Bradford',
];
const _LEAD_NAMES_ESTIMATED = [
  'Patricia Lin', 'Quincy Watts', 'Rosa Delgado', 'Stuart Henderson', 'Tracy McKinney',
  'Umar Sadik', 'Victoria Pham', 'Wesley Tucker', 'Xiomara Ortiz', 'Yusuf Hassan',
];
const _LEAD_NAMES_WON = [
  'Aaron Mitchell', 'Brielle Coleman', 'Cody Sanchez', 'Diana Khoury', 'Edwin Park',
  'Fiona MacLeod', 'Garrison Webb', 'Helena Sokolova', 'Ian Becker', 'Julissa Romero',
  'Kenji Watanabe', 'Lila Ross', 'Marcus Bell', 'Naomi Castro', 'Otis Pryor',
];
const _LEAD_NAMES_LOST = [
  'Pamela Aguilar', 'Quentin Hayes', 'Rebecca Sterling', 'Samir Choudhury', 'Tatiana Volkov',
  'Ulrich Bauer', 'Veronica Lloyd', 'Wesley Knox',
];

function _mkLead(id, name, status, daysAgo, svcId, value, neighborhood) {
  const svc = SERVICES_OFFERED.find(s => s.id === svcId) || SERVICES_OFFERED[0];
  const lastNames = name.split(' ');
  // Char-code helpers — fall back to safe values if id is shorter than expected
  const c5 = id.charCodeAt(5) || 65;
  const c6 = id.charCodeAt(6) || 65;
  const c7 = id.charCodeAt(7) || 65;
  // Build a stable 4-digit phone tail from the id
  const phoneTail = String(2000 + ((c5 * 13 + c6 * 7) % 8000)).slice(-4);
  return {
    id, name,
    email: (lastNames[0][0] + lastNames[1] + '@example.com').toLowerCase(),
    phone: `702-555-${phoneTail}`,
    neighborhood,
    address: `${1000 + Math.abs(c5 * 7) % 8000} ${STREETS[c6 % STREETS.length]}, ${neighborhood}, NV 89${String(100 + Math.abs(c7 * 3) % 50).slice(-3)}`,
    serviceInterest: svc.name,
    serviceId: svc.id,
    status,
    estimatedValue: value || svc.avg,
    // Spread leads through the day using safe modulo math (no NaN)
    createdAt: _d(-daysAgo, 9 + (c7 % 8), (c6 * 7) % 60),
    source: ['Google Search', 'Google Local', 'Referral', 'Yelp', 'Facebook Ad', 'Direct'][c7 % 6],
    notes: status === 'lost' ? 'Customer chose competitor on price.' :
           status === 'won'  ? 'Job completed successfully. Review request sent.' :
           status === 'estimated' ? 'Estimate sent — awaiting decision.' :
           status === 'contacted' ? 'Spoke with customer. Scheduling estimate.' :
           '',
  };
}

const GDK_LEADS = [
  // 12 NEW (last 7 days)
  ..._LEAD_NAMES_NEW.map((n, i) => _mkLead(`lead-N${String(i+1).padStart(2,'0')}`, n, 'new', i % 7, ['emergency','spring','opener','new-door','maintenance','spring','opener'][i % 7], null, NEIGHBORHOODS[i % NEIGHBORHOODS.length])),
  // 15 CONTACTED (3-21 days ago)
  ..._LEAD_NAMES_CONTACTED.map((n, i) => _mkLead(`lead-C${String(i+1).padStart(2,'0')}`, n, 'contacted', 3 + (i % 18), ['emergency','spring','opener','new-door','spring','opener','new-door'][i % 7], null, NEIGHBORHOODS[(i+1) % NEIGHBORHOODS.length])),
  // 10 ESTIMATED (5-30 days ago)
  ..._LEAD_NAMES_ESTIMATED.map((n, i) => _mkLead(`lead-E${String(i+1).padStart(2,'0')}`, n, 'estimated', 5 + (i*3 % 25), ['new-door','opener','spring','commercial','new-door','opener'][i % 6], null, NEIGHBORHOODS[(i+2) % NEIGHBORHOODS.length])),
  // 15 WON (10-90 days ago)
  ..._LEAD_NAMES_WON.map((n, i) => _mkLead(`lead-W${String(i+1).padStart(2,'0')}`, n, 'won', 10 + (i*5 % 80), ['emergency','spring','opener','new-door','spring','maintenance','spring','opener'][i % 8], null, NEIGHBORHOODS[(i+3) % NEIGHBORHOODS.length])),
  // 8 LOST (15-60 days ago)
  ..._LEAD_NAMES_LOST.map((n, i) => _mkLead(`lead-L${String(i+1).padStart(2,'0')}`, n, 'lost', 15 + (i*4 % 45), ['new-door','opener','spring','commercial'][i % 4], null, NEIGHBORHOODS[(i+4) % NEIGHBORHOODS.length])),
];

// ─────────────────────────────────────────────────────────────
// JOBS (8-12 active on calendar across next 30 days)
// ─────────────────────────────────────────────────────────────
const GDK_JOBS = [
  { id: 'job-001', customerId: 'cust-005', customerName: 'Tony Romano',       address: '7720 W Russell Rd, Spring Valley',     service: 'Spring Replacement', techName: 'Diego Ruiz',  scheduledFor: _d(0,  10, 0),  durationMinutes: 90,  value: 425,  status: 'scheduled' },
  { id: 'job-002', customerId: 'cust-009', customerName: 'Carlos Mendoza',    address: '450 Boulder City Pkwy, Boulder City',  service: 'Emergency Repair',   techName: 'Trent Walker', scheduledFor: _d(0, 13, 30), durationMinutes: 60,  value: 89,   status: 'in-progress' },
  { id: 'job-003', customerId: 'cust-001', customerName: 'Michael Robinson',  address: '8742 Horizon Ridge Pkwy, Henderson',   service: 'Opener Install',     techName: 'Diego Ruiz',  scheduledFor: _d(2,  9, 0),   durationMinutes: 120, value: 685,  status: 'scheduled' },
  { id: 'job-004', customerId: 'cust-013', customerName: 'Hassan Ali',        address: '1255 S Rainbow Blvd, Spring Valley',   service: 'Spring Replacement', techName: 'Trent Walker', scheduledFor: _d(3,  11, 0),  durationMinutes: 75,  value: 425,  status: 'scheduled' },
  { id: 'job-005', customerId: 'cust-004', customerName: 'Aisha Williams',    address: '2156 Mountain Vista St, Henderson',    service: 'New Door Install',   techName: 'Marcus Reed', scheduledFor: _d(5,  9, 0),   durationMinutes: 240, value: 1850, status: 'scheduled' },
  { id: 'job-006', customerId: 'cust-008', customerName: 'Linda Nguyen',      address: '8855 Anthem Pkwy, Henderson',          service: 'Maintenance Plan',   techName: 'Diego Ruiz',  scheduledFor: _d(7,  14, 0),  durationMinutes: 60,  value: 199,  status: 'scheduled' },
  { id: 'job-007', customerId: 'cust-015', customerName: 'Ricardo Vasquez',   address: '2200 Sunset Rd, Henderson',            service: 'Spring Replacement', techName: 'Trent Walker', scheduledFor: _d(9,  10, 30), durationMinutes: 75,  value: 425,  status: 'scheduled' },
  { id: 'job-008', customerId: 'cust-016', customerName: 'Karen Murphy',      address: '8101 W Sahara Ave, Las Vegas',         service: 'Opener Install',     techName: 'Diego Ruiz',  scheduledFor: _d(12, 9, 0),   durationMinutes: 120, value: 685,  status: 'scheduled' },
  { id: 'job-009', customerId: 'cust-017', customerName: 'Tyrone Washington', address: '3434 N Buffalo Dr, Summerlin',          service: 'New Door Install',   techName: 'Marcus Reed', scheduledFor: _d(14, 9, 0),   durationMinutes: 240, value: 1850, status: 'scheduled' },
  { id: 'job-010', customerId: 'cust-011', customerName: 'Marcus Lee',        address: '6618 W Charleston Blvd, Las Vegas',     service: 'Emergency Repair',   techName: 'Trent Walker', scheduledFor: _d(18, 13, 0),  durationMinutes: 60,  value: 285,  status: 'scheduled' },
  { id: 'job-011', customerId: 'cust-007', customerName: 'Derek Johnson',     address: '630 N Pecos Rd, Las Vegas',            service: 'Commercial Doors',   techName: 'Marcus Reed', scheduledFor: _d(22, 9, 0),   durationMinutes: 360, value: 3200, status: 'scheduled' },
  { id: 'job-012', customerId: 'cust-002', customerName: 'Maria Gonzalez',    address: '12 Sunset Mesa Ct, Henderson',          service: 'Spring Replacement', techName: 'Diego Ruiz',  scheduledFor: _d(28, 11, 0),  durationMinutes: 90,  value: 425,  status: 'scheduled' },
];

// ─────────────────────────────────────────────────────────────
// ESTIMATES (5-8 in different states)
// ─────────────────────────────────────────────────────────────
const GDK_ESTIMATES = [
  { id: 'est-001', leadId: 'lead-E01', customerName: 'Patricia Lin',   service: 'New Door Install',   total: 1850, status: 'sent',     sentDate: _d(-3),  expiresIn: 27 },
  { id: 'est-002', leadId: 'lead-E02', customerName: 'Quincy Watts',   service: 'Opener Install',     total: 685,  status: 'approved', sentDate: _d(-7),  approvedDate: _d(-2) },
  { id: 'est-003', leadId: 'lead-E03', customerName: 'Rosa Delgado',   service: 'Spring Replacement', total: 425,  status: 'sent',     sentDate: _d(-1),  expiresIn: 29 },
  { id: 'est-004', leadId: 'lead-E04', customerName: 'Stuart Henderson', service: 'Commercial Doors', total: 3200, status: 'draft',    sentDate: null,    expiresIn: null },
  { id: 'est-005', leadId: 'lead-E05', customerName: 'Tracy McKinney', service: 'New Door Install',   total: 2150, status: 'declined', sentDate: _d(-12), declinedDate: _d(-5) },
  { id: 'est-006', leadId: 'lead-E06', customerName: 'Umar Sadik',     service: 'Opener Install',     total: 685,  status: 'sent',     sentDate: _d(-5),  expiresIn: 25 },
  { id: 'est-007', leadId: 'lead-E07', customerName: 'Victoria Pham',  service: 'Spring Replacement', total: 425,  status: 'approved', sentDate: _d(-9),  approvedDate: _d(-4) },
  { id: 'est-008', leadId: 'lead-E08', customerName: 'Wesley Tucker',  service: 'New Door Install',   total: 1850, status: 'draft',    sentDate: null,    expiresIn: null },
];

// ─────────────────────────────────────────────────────────────
// SMS LOG (30-50 realistic message exchanges)
// ─────────────────────────────────────────────────────────────
const GDK_SMS_LOG = [
  { id: 'sms-001', customerName: 'Tony Romano',       phone: '702-555-0571', direction: 'out', message: 'Garage Door Kings: Diego is en route. ETA 10:00 AM. Reply STOP to opt out.', sentAt: _d(0, 9, 12),  status: 'delivered' },
  { id: 'sms-002', customerName: 'Carlos Mendoza',    phone: '702-555-0901', direction: 'in',  message: 'My garage door spring just snapped, can someone come today?',                  sentAt: _d(0, 12, 4),  status: 'received'  },
  { id: 'sms-003', customerName: 'Carlos Mendoza',    phone: '702-555-0901', direction: 'out', message: 'Garage Door Kings: Yes — Trent will be there 1:30 PM. We\'ll text 30 min out.', sentAt: _d(0, 12, 7),  status: 'delivered' },
  { id: 'sms-004', customerName: 'Carlos Mendoza',    phone: '702-555-0901', direction: 'out', message: 'Garage Door Kings: Trent arriving in 30 minutes.',                            sentAt: _d(0, 13, 0),  status: 'delivered' },
  { id: 'sms-005', customerName: 'Michael Robinson',  phone: '702-555-0142', direction: 'out', message: 'Garage Door Kings: Reminder — Opener Install scheduled for ' + _d(2,9,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' at 9:00 AM.', sentAt: _d(-1, 16, 30), status: 'delivered' },
  { id: 'sms-006', customerName: 'Hassan Ali',        phone: '702-555-1392', direction: 'out', message: 'Garage Door Kings: Spring Replacement confirmed for ' + _d(3,11,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' at 11:00 AM.', sentAt: _d(-2, 14, 15), status: 'delivered' },
  { id: 'sms-007', customerName: 'Aisha Williams',    phone: '702-555-0489', direction: 'out', message: 'Garage Door Kings: Your new door arrives ' + _d(5,9,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + '. Marcus will be there 9 AM sharp.', sentAt: _d(-3, 11, 0), status: 'delivered' },
  { id: 'sms-008', customerName: 'Linda Nguyen',      phone: '702-555-0816', direction: 'out', message: 'Garage Door Kings: Maintenance visit set for ' + _d(7,14,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' 2 PM.',                  sentAt: _d(-4, 10, 22), status: 'delivered' },
  { id: 'sms-009', customerName: 'Patricia Lin',      phone: '702-555-2026', direction: 'out', message: 'Garage Door Kings: Your estimate for the new door install is ready. View it: gdk.lv/q/PL2026',                                          sentAt: _d(-3, 13, 45), status: 'delivered' },
  { id: 'sms-010', customerName: 'Patricia Lin',      phone: '702-555-2026', direction: 'in',  message: 'Looks great. Can we do next Tuesday?',                                       sentAt: _d(-3, 17, 12), status: 'received'  },
  { id: 'sms-011', customerName: 'Patricia Lin',      phone: '702-555-2026', direction: 'out', message: 'Garage Door Kings: Tuesday works. Locking that in. We\'ll send a confirmation in the AM.', sentAt: _d(-3, 17, 18), status: 'delivered' },
  { id: 'sms-012', customerName: 'Quincy Watts',      phone: '702-555-2049', direction: 'out', message: 'Garage Door Kings: Estimate approved! Your install is set for next Thursday 9 AM.',         sentAt: _d(-2, 9, 0),   status: 'delivered' },
  { id: 'sms-013', customerName: 'Aaron Mitchell',    phone: '702-555-2087', direction: 'out', message: 'Garage Door Kings: Hope your new opener is working great. Mind leaving us a quick review? gdk.lv/r/AM2087', sentAt: _d(-7, 10, 30), status: 'delivered' },
  { id: 'sms-014', customerName: 'Aaron Mitchell',    phone: '702-555-2087', direction: 'in',  message: 'Done! Five stars. Y\'all were awesome.',                                     sentAt: _d(-7, 11, 18), status: 'received'  },
  { id: 'sms-015', customerName: 'Brielle Coleman',   phone: '702-555-2094', direction: 'out', message: 'Garage Door Kings: Your invoice is paid in full — $425. Receipt: gdk.lv/p/BC2094. Thank you!', sentAt: _d(-12, 14, 50), status: 'delivered' },
  { id: 'sms-016', customerName: 'Cody Sanchez',      phone: '702-555-2107', direction: 'out', message: 'Garage Door Kings: Quick reminder: your annual maintenance is due. Book here: gdk.lv/maint/CS2107', sentAt: _d(-5, 9, 0),  status: 'delivered' },
  { id: 'sms-017', customerName: 'Diana Khoury',      phone: '702-555-2128', direction: 'out', message: 'Garage Door Kings: Trent finished early — gate is fully repaired and tested. Quote is unchanged.',  sentAt: _d(-15, 16, 40),status: 'delivered' },
  { id: 'sms-018', customerName: 'Edwin Park',        phone: '702-555-2143', direction: 'in',  message: 'My opener is making weird noises again',                                       sentAt: _d(-1, 8, 24),  status: 'received'  },
  { id: 'sms-019', customerName: 'Edwin Park',        phone: '702-555-2143', direction: 'out', message: 'Garage Door Kings: That\'s under your warranty. We\'ll send Diego tomorrow morning, no charge.', sentAt: _d(-1, 8, 32),  status: 'delivered' },
  { id: 'sms-020', customerName: 'Fiona MacLeod',     phone: '702-555-2168', direction: 'out', message: 'Garage Door Kings: Welcome aboard! Save this number — we\'re here 24/7 for emergencies.', sentAt: _d(-22, 11, 0), status: 'delivered' },
  { id: 'sms-021', customerName: 'Karen Murphy',      phone: '702-555-1638', direction: 'out', message: 'Garage Door Kings: New opener install scheduled for ' + _d(12,9,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' 9 AM.', sentAt: _d(-6, 13, 22), status: 'delivered' },
  { id: 'sms-022', customerName: 'Tyrone Washington', phone: '702-555-1729', direction: 'out', message: 'Garage Door Kings: Door arrives ' + _d(14,9,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + '. Marcus on site 9 AM.',     sentAt: _d(-8, 10, 5), status: 'delivered' },
  { id: 'sms-023', customerName: 'Marcus Lee',        phone: '702-555-1147', direction: 'in',  message: 'Door won\'t close all the way',                                              sentAt: _d(-1, 19, 33), status: 'received'  },
  { id: 'sms-024', customerName: 'Marcus Lee',        phone: '702-555-1147', direction: 'out', message: 'Garage Door Kings: Could be sensor alignment. Trent will be out ' + _d(18,13,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' 1 PM. $89 service call.', sentAt: _d(-1, 19, 41), status: 'delivered' },
  { id: 'sms-025', customerName: 'Derek Johnson',     phone: '702-555-0745', direction: 'out', message: 'Garage Door Kings: Commercial install is on track for ' + _d(22,9,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + '. We\'ll arrive 9 AM with the full crew.', sentAt: _d(-10, 9, 30), status: 'delivered' },
  { id: 'sms-026', customerName: 'Helena Sokolova',   phone: '702-555-2231', direction: 'out', message: 'Garage Door Kings: Receipt for today\'s service — $245. View: gdk.lv/p/HS2231. 5-year warranty active.', sentAt: _d(-25, 17, 0), status: 'delivered' },
  { id: 'sms-027', customerName: 'Ian Becker',        phone: '702-555-2245', direction: 'out', message: 'Garage Door Kings: Hi Ian, hope the new door is working great! Mind dropping us a 2-line review? gdk.lv/r/IB2245', sentAt: _d(-30, 10, 0), status: 'delivered' },
  { id: 'sms-028', customerName: 'Julissa Romero',    phone: '702-555-2267', direction: 'out', message: 'Garage Door Kings: Your annual tune-up reminder — book a slot here: gdk.lv/maint/JR2267',                  sentAt: _d(-2, 8, 0),   status: 'delivered' },
  { id: 'sms-029', customerName: 'Kenji Watanabe',    phone: '702-555-2284', direction: 'out', message: 'Garage Door Kings: All done. Thanks for choosing us. Estimate covered exactly what we did — no surprises.', sentAt: _d(-18, 16, 22), status: 'delivered' },
  { id: 'sms-030', customerName: 'Lila Ross',         phone: '702-555-2298', direction: 'out', message: 'Garage Door Kings: Heads up — your opener is due for a battery replacement next visit. Free under your maintenance plan.', sentAt: _d(-40, 11, 11), status: 'delivered' },
  { id: 'sms-031', customerName: 'Maria Gonzalez',    phone: '702-555-0203', direction: 'out', message: 'Garage Door Kings: Spring replacement scheduled for ' + _d(28,11,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' 11 AM.', sentAt: _d(-3, 14, 0),  status: 'delivered' },
  { id: 'sms-032', customerName: 'Naomi Castro',      phone: '702-555-2314', direction: 'in',  message: 'How much for a smart wifi opener install?',                                  sentAt: _d(-4, 16, 12), status: 'received'  },
  { id: 'sms-033', customerName: 'Naomi Castro',      phone: '702-555-2314', direction: 'out', message: 'Garage Door Kings: $685 installed (LiftMaster Smart). Book a free estimate: gdk.lv/q', sentAt: _d(-4, 16, 19), status: 'delivered' },
  { id: 'sms-034', customerName: 'James Chen',        phone: '702-555-0317', direction: 'out', message: 'Garage Door Kings: Your maintenance plan renewed — you\'re covered through ' + _d(365).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) + '.', sentAt: _d(-30, 9, 0), status: 'delivered' },
  { id: 'sms-035', customerName: 'Sarah Patel',       phone: '702-555-0628', direction: 'out', message: 'Garage Door Kings: Annual tune-up booked. See you ' + _d(7,14,0).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' at 2 PM.', sentAt: _d(-5, 12, 30), status: 'delivered' },
];

// ─────────────────────────────────────────────────────────────
// REVIEW REQUEST HISTORY (8-12)
// ─────────────────────────────────────────────────────────────
const GDK_REVIEW_REQUESTS = [
  { id: 'rev-001', customerName: 'Aaron Mitchell',   sentAt: _d(-7),  status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Five stars. Y\'all were awesome.' },
  { id: 'rev-002', customerName: 'Brielle Coleman',  sentAt: _d(-12), status: 'reviewed', rating: 5, channel: 'Yelp',     reviewText: 'Trent fixed our spring in 30 min. So fast.' },
  { id: 'rev-003', customerName: 'Cody Sanchez',     sentAt: _d(-5),  status: 'pending',  rating: null, channel: null,    reviewText: null },
  { id: 'rev-004', customerName: 'Diana Khoury',     sentAt: _d(-15), status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Came on time, fixed it, didn\'t try to upsell. That\'s the magic.' },
  { id: 'rev-005', customerName: 'Edwin Park',       sentAt: _d(-1),  status: 'pending',  rating: null, channel: null,    reviewText: null },
  { id: 'rev-006', customerName: 'Fiona MacLeod',    sentAt: _d(-22), status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Marcus and his team are pros. New door looks gorgeous.' },
  { id: 'rev-007', customerName: 'Helena Sokolova',  sentAt: _d(-25), status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Honest pricing, clean work, friendly tech. Best in Vegas.' },
  { id: 'rev-008', customerName: 'Ian Becker',       sentAt: _d(-30), status: 'pending',  rating: null, channel: null,    reviewText: null },
  { id: 'rev-009', customerName: 'Julissa Romero',   sentAt: _d(-35), status: 'reviewed', rating: 4, channel: 'Yelp',     reviewText: 'Solid work, fair price. Took an extra day but they kept me updated.' },
  { id: 'rev-010', customerName: 'Kenji Watanabe',   sentAt: _d(-18), status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Better than my last garage door company by a mile.' },
  { id: 'rev-011', customerName: 'Lila Ross',        sentAt: _d(-40), status: 'reviewed', rating: 5, channel: 'Facebook', reviewText: 'Fast, reliable, and so professional. Highly recommend!' },
  { id: 'rev-012', customerName: 'Marcus Bell',      sentAt: _d(-50), status: 'reviewed', rating: 5, channel: 'Google',   reviewText: 'Diego is a magician. My door has never run smoother.' },
];

// ─────────────────────────────────────────────────────────────
// CUSTOMER PORTAL DEMO USER (Michael Robinson)
// ─────────────────────────────────────────────────────────────
const GDK_PORTAL_USER = {
  customer: GDK_CUSTOMERS[0], // Michael Robinson
  pastJobs: [
    {
      id: 'past-001',
      service: 'Spring Replacement',
      tech: 'Diego Ruiz',
      completedDate: _d(-184),
      total: 425,
      paid: true,
      paidDate: _d(-184),
      invoiceNumber: 'INV-2025-0641',
      photos: 3,
      warrantyYears: 5,
    },
  ],
  upcomingJobs: [
    {
      id: 'job-003',
      service: 'Opener Install',
      tech: 'Diego Ruiz',
      scheduledFor: _d(2, 9, 0),
      durationMinutes: 120,
      address: '8742 Horizon Ridge Pkwy, Henderson, NV 89052',
      total: 685,
      depositPaid: 200,
      balanceDue: 485,
    },
  ],
  invoices: [
    { id: 'INV-2025-0641', date: _d(-184), amount: 425,  paid: true,  status: 'Paid' },
    { id: 'INV-2026-0089', date: _d(-3),   amount: 200,  paid: true,  status: 'Deposit Paid' },
    { id: 'INV-2026-0090', date: _d(2),    amount: 485,  paid: false, status: 'Balance Due' },
  ],
  messages: [
    { from: 'Marcus Reed', body: 'Hey Michael! Diego is set to install your new opener Wednesday at 9. Heads up — he\'ll need access to a power outlet near the ceiling.', at: _d(-3, 14, 22) },
    { from: 'Michael Robinson',  body: 'Sounds good. There\'s an outlet right above the door — you used it last time.', at: _d(-3, 14, 38) },
    { from: 'Marcus Reed', body: 'Perfect, that one works. See you Wednesday.', at: _d(-3, 14, 41) },
  ],
};

// ─────────────────────────────────────────────────────────────
// PAYMENTS (~12 historical mock payments — mix of methods + statuses)
// Powers /pay.html (customer-facing) and the Payments table on /admin.html
// ─────────────────────────────────────────────────────────────
const GDK_PAYMENTS = [
  // PAID IN-PERSON (tradesman handed phone to customer on-site)
  { id: 'PAY-1252', customerId: 'cust-005', customerName: 'Tony Romano',     customerPhone: '702-555-0571', customerEmail: 'tromano@example.com',    amount: 645,  description: 'Spring replacement (dual torsion)',     method: 'paid-inperson', status: 'paid',    createdAt: _d(0,  10, 22), paidAt: _d(0,  10, 27), techName: 'Marcus Reed', paymentMethod: 'apple-pay' },
  { id: 'PAY-1251', customerId: 'cust-008', customerName: 'Linda Nguyen',    customerPhone: '702-555-0816', customerEmail: 'lnguyen@example.com',    amount: 425,  description: 'Spring replacement (single torsion)',   method: 'paid-inperson', status: 'paid',    createdAt: _d(-1, 14, 5),  paidAt: _d(-1, 14, 11), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1250', customerId: 'cust-013', customerName: 'Hassan Ali',      customerPhone: '702-555-1392', customerEmail: 'hali@example.com',       amount: 489,  description: 'Smart wifi opener install',             method: 'paid-inperson', status: 'paid',    createdAt: _d(-1, 11, 40), paidAt: _d(-1, 11, 46), techName: 'Marcus Reed', paymentMethod: 'card' },
  { id: 'PAY-1249', customerId: 'cust-009', customerName: 'Carlos Mendoza',  customerPhone: '702-555-0901', customerEmail: 'cmendoza@example.com',   amount: 89,   description: 'Emergency service call (after-hours)',  method: 'paid-inperson', status: 'paid',    createdAt: _d(-2, 21, 15), paidAt: _d(-2, 21, 18), techName: 'Trent Walker',paymentMethod: 'google-pay' },
  { id: 'PAY-1248', customerId: 'cust-002', customerName: 'Maria Gonzalez',  customerPhone: '702-555-0203', customerEmail: 'mgonzalez@example.com',  amount: 450,  description: 'Spring replacement + tune-up',          method: 'paid-inperson', status: 'paid',    createdAt: _d(-2, 16, 30), paidAt: _d(-2, 16, 34), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1245', customerId: 'cust-015', customerName: 'Ricardo Vasquez', customerPhone: '702-555-1547', customerEmail: 'rvasquez@example.com',   amount: 285,  description: 'Spring replacement (single)',           method: 'paid-inperson', status: 'paid',    createdAt: _d(-3, 9,  50), paidAt: _d(-3, 9,  53), techName: 'Marcus Reed', paymentMethod: 'apple-pay' },
  { id: 'PAY-1242', customerId: 'cust-011', customerName: 'Marcus Lee',      customerPhone: '702-555-1147', customerEmail: 'mlee@example.com',       amount: 149,  description: 'Annual maintenance + tune-up',          method: 'paid-inperson', status: 'paid',    createdAt: _d(-4, 13, 15), paidAt: _d(-4, 13, 17), techName: 'Trent Walker',paymentMethod: 'card' },

  // PAID ONLINE (link sent, customer paid remotely)
  { id: 'PAY-1247', customerId: 'cust-003', customerName: 'James Chen',      customerPhone: '702-555-0317', customerEmail: 'jchen@example.com',      amount: 1850, description: 'New door install (double-car insulated)',method: 'paid-online',   status: 'paid',    createdAt: _d(-2, 18, 5),  paidAt: _d(-2, 19, 22), techName: 'Marcus Reed', paymentMethod: 'affirm' },
  { id: 'PAY-1244', customerId: 'cust-007', customerName: 'Derek Johnson',   customerPhone: '702-555-0745', customerEmail: 'derek.j@example.com',    amount: 685,  description: 'Smart wifi opener + remote programming',method: 'paid-online',   status: 'paid',    createdAt: _d(-3, 17, 10), paidAt: _d(-3, 20, 45), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1240', customerId: 'cust-014', customerName: 'Stephanie Brown', customerPhone: '702-555-1483', customerEmail: 'sbrown@example.com',     amount: 2400, description: 'Commercial roll-up door (warehouse)',   method: 'paid-online',   status: 'paid',    createdAt: _d(-5, 15, 30), paidAt: _d(-4, 9,  12), techName: 'Marcus Reed', paymentMethod: 'klarna' },

  // LINK SENT BUT NOT YET PAID (pending)
  { id: 'PAY-1253', customerId: 'cust-004', customerName: 'Aisha Williams',  customerPhone: '702-555-0489', customerEmail: 'aisha.w@example.com',    amount: 385,  description: 'Spring replacement (single torsion)',   method: 'link-sent',     status: 'pending', createdAt: _d(0,  9,  15), paidAt: null,           techName: 'Diego Ruiz',  paymentMethod: null },
  { id: 'PAY-1246', customerId: 'cust-006', customerName: 'Sarah Patel',     customerPhone: '702-555-0628', customerEmail: 'spatel@example.com',     amount: 1450, description: 'New door install (single-car steel)',   method: 'link-sent',     status: 'pending', createdAt: _d(-2, 16, 50), paidAt: null,           techName: 'Marcus Reed', paymentMethod: null },

  // ─── HISTORICAL (past 12 months — for YTD totals + tax-season demo) ───
  // Helper: most are paid-online or paid-inperson, mix of payment methods, realistic seasonal spread
  // March 2026
  { id: 'PAY-1238', customerId: 'cust-016', customerName: 'Karen Murphy',    customerPhone: '702-555-1638', customerEmail: 'kmurphy@example.com',    amount: 685,  description: 'Smart wifi opener install',             method: 'paid-online',   status: 'paid',    createdAt: _d(-7,  10, 30), paidAt: _d(-7,  12, 5),  techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1235', customerId: 'cust-001', customerName: 'Michael Robinson',customerPhone: '702-555-0142', customerEmail: 'michael.r@example.com',  amount: 1850, description: 'New door install (insulated double-car)',method: 'paid-online',   status: 'paid',    createdAt: _d(-12, 14, 0),  paidAt: _d(-11, 8,  20), techName: 'Marcus Reed', paymentMethod: 'affirm' },
  { id: 'PAY-1232', customerId: 'cust-010', customerName: 'Jenna Taylor',    customerPhone: '702-555-1024', customerEmail: 'jtaylor@example.com',    amount: 285,  description: 'Spring replacement (single)',           method: 'paid-inperson', status: 'paid',    createdAt: _d(-15, 11, 15), paidAt: _d(-15, 11, 20), techName: 'Trent Walker',paymentMethod: 'card' },
  { id: 'PAY-1228', customerId: 'cust-002', customerName: 'Maria Gonzalez',  customerPhone: '702-555-0203', customerEmail: 'mgonzalez@example.com',  amount: 89,   description: 'Emergency service call diagnostic',     method: 'paid-inperson', status: 'paid',    createdAt: _d(-22, 19, 45), paidAt: _d(-22, 19, 48), techName: 'Marcus Reed', paymentMethod: 'apple-pay' },
  // February 2026
  { id: 'PAY-1219', customerId: 'cust-012', customerName: "Rachel O'Brien",  customerPhone: '702-555-1218', customerEmail: 'robrien@example.com',    amount: 2150, description: 'New door install (premium wood-look)',  method: 'paid-online',   status: 'paid',    createdAt: _d(-38, 13, 0),  paidAt: _d(-37, 16, 32), techName: 'Marcus Reed', paymentMethod: 'klarna' },
  { id: 'PAY-1215', customerId: 'cust-017', customerName: 'Tyrone Washington',customerPhone:'702-555-1729', customerEmail: 'twashington@example.com',amount: 1850, description: 'New door install + opener bundle',      method: 'paid-online',   status: 'paid',    createdAt: _d(-44, 9,  20), paidAt: _d(-43, 11, 5),  techName: 'Marcus Reed', paymentMethod: 'affirm' },
  { id: 'PAY-1212', customerId: 'cust-005', customerName: 'Tony Romano',     customerPhone: '702-555-0571', customerEmail: 'tromano@example.com',    amount: 425,  description: 'Spring replacement (single torsion)',   method: 'paid-inperson', status: 'paid',    createdAt: _d(-50, 14, 30), paidAt: _d(-50, 14, 36), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1207', customerId: 'cust-013', customerName: 'Hassan Ali',      customerPhone: '702-555-1392', customerEmail: 'hali@example.com',       amount: 149,  description: 'Annual maintenance plan (residential)', method: 'paid-online',   status: 'paid',    createdAt: _d(-58, 11, 0),  paidAt: _d(-57, 8,  15), techName: 'Trent Walker',paymentMethod: 'card' },
  // January 2026
  { id: 'PAY-1198', customerId: 'cust-007', customerName: 'Derek Johnson',   customerPhone: '702-555-0745', customerEmail: 'derek.j@example.com',    amount: 3200, description: 'Commercial roll-up door (warehouse, 2-bay)',method:'paid-online',status: 'paid',    createdAt: _d(-72, 10, 30), paidAt: _d(-71, 14, 22), techName: 'Marcus Reed', paymentMethod: 'klarna' },
  { id: 'PAY-1192', customerId: 'cust-014', customerName: 'Stephanie Brown', customerPhone: '702-555-1483', customerEmail: 'sbrown@example.com',     amount: 489,  description: 'Smart wifi opener install',             method: 'paid-inperson', status: 'paid',    createdAt: _d(-79, 15, 0),  paidAt: _d(-79, 15, 12), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1188', customerId: 'cust-009', customerName: 'Carlos Mendoza',  customerPhone: '702-555-0901', customerEmail: 'cmendoza@example.com',   amount: 285,  description: 'Spring replacement (single)',           method: 'paid-online',   status: 'paid',    createdAt: _d(-86, 18, 30), paidAt: _d(-85, 9,  10), techName: 'Marcus Reed', paymentMethod: 'card' },
  { id: 'PAY-1184', customerId: 'cust-015', customerName: 'Ricardo Vasquez', customerPhone: '702-555-1547', customerEmail: 'rvasquez@example.com',   amount: 89,   description: 'Service call diagnostic',               method: 'paid-inperson', status: 'paid',    createdAt: _d(-92, 13, 15), paidAt: _d(-92, 13, 18), techName: 'Trent Walker',paymentMethod: 'google-pay' },
  // December 2025
  { id: 'PAY-1175', customerId: 'cust-008', customerName: 'Linda Nguyen',    customerPhone: '702-555-0816', customerEmail: 'lnguyen@example.com',    amount: 1450, description: 'New door install (single-car steel)',   method: 'paid-online',   status: 'paid',    createdAt: _d(-115,11, 0),  paidAt: _d(-114,9,  30), techName: 'Marcus Reed', paymentMethod: 'affirm' },
  { id: 'PAY-1170', customerId: 'cust-011', customerName: 'Marcus Lee',      customerPhone: '702-555-1147', customerEmail: 'mlee@example.com',       amount: 685,  description: 'Smart wifi opener + keypad',            method: 'paid-inperson', status: 'paid',    createdAt: _d(-122,16, 30), paidAt: _d(-122,16, 38), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1166', customerId: 'cust-003', customerName: 'James Chen',      customerPhone: '702-555-0317', customerEmail: 'jchen@example.com',      amount: 385,  description: 'Spring replacement (single torsion)',   method: 'paid-online',   status: 'paid',    createdAt: _d(-128,9,  20), paidAt: _d(-127,11, 15), techName: 'Trent Walker',paymentMethod: 'apple-pay' },
  // November 2025
  { id: 'PAY-1158', customerId: 'cust-004', customerName: 'Aisha Williams',  customerPhone: '702-555-0489', customerEmail: 'aisha.w@example.com',    amount: 489,  description: 'Smart wifi opener install',             method: 'paid-inperson', status: 'paid',    createdAt: _d(-145,14, 0),  paidAt: _d(-145,14, 8),  techName: 'Marcus Reed', paymentMethod: 'card' },
  { id: 'PAY-1152', customerId: 'cust-006', customerName: 'Sarah Patel',     customerPhone: '702-555-0628', customerEmail: 'spatel@example.com',     amount: 245,  description: 'Emergency repair (off-track door)',     method: 'paid-online',   status: 'paid',    createdAt: _d(-152,21, 0),  paidAt: _d(-151,8,  45), techName: 'Diego Ruiz',  paymentMethod: 'google-pay' },
  // October 2025
  { id: 'PAY-1142', customerId: 'cust-001', customerName: 'Michael Robinson',customerPhone: '702-555-0142', customerEmail: 'michael.r@example.com',  amount: 149,  description: 'Annual maintenance + tune-up',          method: 'paid-online',   status: 'paid',    createdAt: _d(-175,10, 30), paidAt: _d(-174,12, 0),  techName: 'Marcus Reed', paymentMethod: 'card' },
  { id: 'PAY-1138', customerId: 'cust-016', customerName: 'Karen Murphy',    customerPhone: '702-555-1638', customerEmail: 'kmurphy@example.com',    amount: 285,  description: 'Spring replacement',                    method: 'paid-inperson', status: 'paid',    createdAt: _d(-183,15, 0),  paidAt: _d(-183,15, 5),  techName: 'Trent Walker',paymentMethod: 'apple-pay' },
  // September 2025
  { id: 'PAY-1125', customerId: 'cust-007', customerName: 'Derek Johnson',   customerPhone: '702-555-0745', customerEmail: 'derek.j@example.com',    amount: 1850, description: 'New door install (insulated)',          method: 'paid-online',   status: 'paid',    createdAt: _d(-205,11, 30), paidAt: _d(-204,15, 18), techName: 'Marcus Reed', paymentMethod: 'affirm' },
  { id: 'PAY-1118', customerId: 'cust-013', customerName: 'Hassan Ali',      customerPhone: '702-555-1392', customerEmail: 'hali@example.com',       amount: 89,   description: 'Service call (after-hours)',            method: 'paid-inperson', status: 'paid',    createdAt: _d(-218,22, 30), paidAt: _d(-218,22, 33), techName: 'Trent Walker',paymentMethod: 'apple-pay' },
  // August 2025
  { id: 'PAY-1108', customerId: 'cust-012', customerName: "Rachel O'Brien",  customerPhone: '702-555-1218', customerEmail: 'robrien@example.com',    amount: 685,  description: 'Smart wifi opener',                     method: 'paid-online',   status: 'paid',    createdAt: _d(-238,9,  0),  paidAt: _d(-237,11, 22), techName: 'Diego Ruiz',  paymentMethod: 'apple-pay' },
  { id: 'PAY-1102', customerId: 'cust-014', customerName: 'Stephanie Brown', customerPhone: '702-555-1483', customerEmail: 'sbrown@example.com',     amount: 425,  description: 'Spring replacement',                    method: 'paid-inperson', status: 'paid',    createdAt: _d(-249,14, 30), paidAt: _d(-249,14, 35), techName: 'Marcus Reed', paymentMethod: 'card' },
  // July 2025
  { id: 'PAY-1090', customerId: 'cust-002', customerName: 'Maria Gonzalez',  customerPhone: '702-555-0203', customerEmail: 'mgonzalez@example.com',  amount: 1450, description: 'New door install',                      method: 'paid-online',   status: 'paid',    createdAt: _d(-272,13, 0),  paidAt: _d(-271,16, 5),  techName: 'Marcus Reed', paymentMethod: 'klarna' },
  { id: 'PAY-1085', customerId: 'cust-017', customerName: 'Tyrone Washington',customerPhone:'702-555-1729', customerEmail: 'twashington@example.com',amount: 149,  description: 'Annual maintenance',                    method: 'paid-online',   status: 'paid',    createdAt: _d(-285,10, 0),  paidAt: _d(-284,9,  15), techName: 'Trent Walker',paymentMethod: 'card' },
  // June 2025 (one tax-relevant: this is FY 2025 closeout for an example)
  { id: 'PAY-1072', customerId: 'cust-005', customerName: 'Tony Romano',     customerPhone: '702-555-0571', customerEmail: 'tromano@example.com',    amount: 2400, description: 'Commercial roll-up + opener',           method: 'paid-online',   status: 'paid',    createdAt: _d(-305,11, 0),  paidAt: _d(-304,14, 30), techName: 'Marcus Reed', paymentMethod: 'klarna' },
];

// ─────────────────────────────────────────────────────────────
// LIVE DEMO PAYMENTS — persisted via localStorage so newly-created
// invoices on /admin-pay.html show up on the /admin.html dashboard
// when the tradesman navigates back. Survives reloads + tab restarts.
// Cleared via the "Reset Demo Data" link on /admin.html.
// ─────────────────────────────────────────────────────────────
const GDK_DEMO_STORAGE_KEY = 'gdk-demo-payments-v1';

function gdkGetDemoPayments() {
  try {
    const raw = localStorage.getItem(GDK_DEMO_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // Rehydrate Date objects (JSON serialized them as strings)
    return arr.map(p => {
      const out = Object.assign({}, p);
      if (p.createdAt) out.createdAt = new Date(p.createdAt);
      if (p.paidAt)    out.paidAt    = new Date(p.paidAt);
      return out;
    });
  } catch (e) {
    return [];
  }
}

function gdkSaveDemoPayment(payment) {
  try {
    const all = gdkGetDemoPayments();
    const existing = all.findIndex(p => p.id === payment.id);
    const stored = Object.assign({}, payment, { isDemoEntry: true });
    // Serialize dates as ISO strings for JSON
    if (stored.createdAt instanceof Date) stored.createdAt = stored.createdAt.toISOString();
    if (stored.paidAt instanceof Date)    stored.paidAt    = stored.paidAt.toISOString();
    if (existing >= 0) {
      all[existing] = Object.assign({}, all[existing], stored);
      // Re-stringify the existing entry's dates if they got rehydrated
      if (all[existing].createdAt instanceof Date) all[existing].createdAt = all[existing].createdAt.toISOString();
      if (all[existing].paidAt instanceof Date)    all[existing].paidAt    = all[existing].paidAt.toISOString();
    } else {
      all.unshift(stored);
    }
    // Cap at 50 entries to avoid unbounded growth in long demo sessions
    localStorage.setItem(GDK_DEMO_STORAGE_KEY, JSON.stringify(all.slice(0, 50)));
    return true;
  } catch (e) {
    console.warn('[GDK] Could not persist demo payment to localStorage:', e);
    return false;
  }
}

function gdkClearDemoPayments() {
  try {
    localStorage.removeItem(GDK_DEMO_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// EXPORT for browser global access
// ─────────────────────────────────────────────────────────────
window.GDK_DATA = {
  customers: GDK_CUSTOMERS,
  leads: GDK_LEADS,
  jobs: GDK_JOBS,
  estimates: GDK_ESTIMATES,
  smsLog: GDK_SMS_LOG,
  reviews: GDK_REVIEW_REQUESTS,
  payments: GDK_PAYMENTS,
  portalUser: GDK_PORTAL_USER,
  services: SERVICES_OFFERED,
  neighborhoods: NEIGHBORHOODS,
  today: GDK_TODAY,
  // Live demo helpers
  getDemoPayments: gdkGetDemoPayments,
  saveDemoPayment: gdkSaveDemoPayment,
  clearDemoPayments: gdkClearDemoPayments,
};

if (typeof console !== 'undefined') {
  console.log('%c[GDK Mock Data Loaded]%c ' +
    `${GDK_LEADS.length} leads · ${GDK_JOBS.length} jobs · ${GDK_ESTIMATES.length} estimates · ` +
    `${GDK_CUSTOMERS.length} customers · ${GDK_SMS_LOG.length} SMS · ${GDK_REVIEW_REQUESTS.length} reviews · ` +
    `${GDK_PAYMENTS.length} payments`,
    'color:#B8732E;font-weight:bold;', 'color:#999;');
}

// ─────────────────────────────────────────────────────────────
// LIVE DEMO LEADS (P3 — created via "+ New Lead" modal)
// ─────────────────────────────────────────────────────────────
const GDK_LEADS_STORAGE_KEY = 'gdk-demo-leads-v1';

function gdkGetDemoLeads() {
  try {
    const raw = localStorage.getItem(GDK_LEADS_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map(l => Object.assign({}, l, { createdAt: new Date(l.createdAt) }));
  } catch (e) { return []; }
}

function gdkSaveDemoLead(lead) {
  try {
    const all = gdkGetDemoLeads();
    const stored = Object.assign({}, lead, { isDemoEntry: true });
    if (stored.createdAt instanceof Date) stored.createdAt = stored.createdAt.toISOString();
    all.unshift(stored);
    localStorage.setItem(GDK_LEADS_STORAGE_KEY, JSON.stringify(all.slice(0, 50)));
    return true;
  } catch (e) { return false; }
}

function gdkClearDemoLeads() {
  try { localStorage.removeItem(GDK_LEADS_STORAGE_KEY); return true; } catch (e) { return false; }
}

// ─────────────────────────────────────────────────────────────
// PORTAL MESSAGES — persist customer messages across reloads
// ─────────────────────────────────────────────────────────────
const GDK_MSG_STORAGE_KEY = 'gdk-portal-messages-v1';
function gdkGetDemoMessages() {
  try {
    const raw = localStorage.getItem(GDK_MSG_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map(m => Object.assign({}, m, { at: new Date(m.at) }));
  } catch (e) { return []; }
}
function gdkSaveDemoMessage(msg) {
  try {
    const all = gdkGetDemoMessages();
    const stored = Object.assign({}, msg);
    if (stored.at instanceof Date) stored.at = stored.at.toISOString();
    all.push(stored);
    localStorage.setItem(GDK_MSG_STORAGE_KEY, JSON.stringify(all.slice(-30)));
    return true;
  } catch (e) { return false; }
}

window.GDK_DATA.getDemoLeads = gdkGetDemoLeads;
window.GDK_DATA.saveDemoLead = gdkSaveDemoLead;
window.GDK_DATA.clearDemoLeads = gdkClearDemoLeads;
window.GDK_DATA.getDemoMessages = gdkGetDemoMessages;
window.GDK_DATA.saveDemoMessage = gdkSaveDemoMessage;

// ─────────────────────────────────────────────────────────────
// SHARED UI HELPERS — toast + sign-out fade
// ─────────────────────────────────────────────────────────────
function gdkToast({ title, subtitle = '', icon = '✓', duration = 3800, variant = 'success' }) {
  // Ensure container exists
  let container = document.getElementById('gdk-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'gdk-toast-container';
    container.className = 'gdk-toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'gdk-toast gdk-toast-' + variant;
  toast.innerHTML = `
    <div class="gdk-toast-icon">${icon}</div>
    <div class="gdk-toast-body">
      <div class="gdk-toast-title">${title}</div>
      ${subtitle ? `<div class="gdk-toast-sub">${subtitle}</div>` : ''}
    </div>
  `;
  container.appendChild(toast);
  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add('visible'));
  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 350);
  }, duration);
  return toast;
}
window.gdkToast = gdkToast;

function gdkSignOut(redirectTo = '/demos/garage/') {
  const overlay = document.createElement('div');
  overlay.className = 'gdk-signout-overlay';
  overlay.innerHTML = `
    <div class="gdk-signout-card">
      <div class="gdk-signout-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>
      <div class="gdk-signout-title">Signed out successfully</div>
      <div class="gdk-signout-sub">Redirecting...</div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
  setTimeout(() => { window.location.href = redirectTo; }, 1100);
}
window.gdkSignOut = gdkSignOut;
