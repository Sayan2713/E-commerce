// Run once: node src/seedDeliveryZones.js
// Pre-populates the state-wise delivery rate table so the admin has a
// starting point to hand-edit from the Delivery Zones page, instead of an
// empty table. Jharkhand (home state) ships local/cheapest; neighboring
// states are "Regional"; everything else is "National". Adjust freely -
// this is just a sensible default, not a fixed rule.
require('dotenv').config();
const mongoose = require('mongoose');
const DeliveryZone = require('./models/DeliveryZone');

const REGIONAL_NEIGHBORS = ['West Bengal', 'Bihar', 'Odisha', 'Chhattisgarh', 'Uttar Pradesh'];

const ALL_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothstore');

  let cfg = await DeliveryZone.findOne({ singleton: 'CONFIG' });
  if (!cfg) cfg = new DeliveryZone({ singleton: 'CONFIG' });
  cfg.homeState = 'Jharkhand';

  cfg.stateRates = ALL_STATES.map((state) => {
    if (state === 'Jharkhand') return { state, zoneLabel: 'Local', rate: 40 };
    if (REGIONAL_NEIGHBORS.includes(state)) return { state, zoneLabel: 'Regional', rate: 70 };
    return { state, zoneLabel: 'National', rate: 120 };
  });

  cfg.fallbackTiers = [
    { label: 'Local', maxDistanceKm: 100, rate: 40 },
    { label: 'Regional', maxDistanceKm: 600, rate: 70 },
    { label: 'National', maxDistanceKm: null, rate: 120 }, // catch-all
  ];

  await cfg.save();
  console.log(`Seeded delivery rates for ${cfg.stateRates.length} states. Edit any of them from the admin panel's Delivery Zones page.`);
  process.exit(0);
}

run();
