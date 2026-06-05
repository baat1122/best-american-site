// api/leads.js — Neon Auto Transport
// Receives completed chatbot leads and saves them directly to Neon CRM Supabase database

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://waqyxjekpdbrtlohvgxs.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcXl4amVrcGRicnRsb2h2Z3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzM4OTIsImV4cCI6MjA5Mzc0OTg5Mn0.JpgCyDtWZgJkSH8-4oDeixT4u0JZ5XoiaeXY7X9mhK4";

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // If Supabase is not configured, return a graceful failure
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured — lead not saved to CRM.');
    return res.status(200).json({ success: false, message: 'CRM not configured' });
  }

  try {
    const { fields } = req.body;

    if (!fields) {
      return res.status(400).json({ error: 'Missing fields in request body' });
    }

    const {
      firstName, lastName, email, phone,
      vehicleYear, vehicleMake, vehicleModel, vehicleType, vehicleCondition,
      pickupZip, deliveryZip, desiredPickupDate, transportType, source
    } = fields;

    // Build the customer name
    const customerName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown (AI Lead)';

    // Build vehicle name string
    const vehicleName = [vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(' ') || 'Unknown Vehicle';

    // Build notes with all chatbot details
    const notes = [
      vehicleCondition ? `Condition: ${vehicleCondition}` : null,
      transportType ? `Transport: ${transportType} Transport` : null,
      vehicleType ? `Vehicle Type: ${vehicleType}` : null,
      desiredPickupDate ? `Desired Pickup Date: ${desiredPickupDate}` : null,
      `Source: ${source || 'AI Chat Widget'} (neonautotransport.com)`
    ].filter(Boolean).join(' | ');

    // ---- Step 1: Auto-save customer if not already in CRM ----
    if (customerName && customerName !== 'Unknown (AI Lead)') {
      const { data: existingCustomers } = await supabaseFetch('customers', {
        select: 'id',
        filters: `customer_name=eq.${encodeURIComponent(customerName)}`,
        limit: 1
      });

      if (!existingCustomers || existingCustomers.length === 0) {
        await supabaseInsert('customers', {
          customer_name: customerName,
          email: email || null,
          phone: phone || null
        });
      }
    }

    // ---- Step 2: Insert the Lead into Supabase ----
    const leadPayload = {
      customer_name: customerName,
      phone: phone || null,
      email: email || null,
      vehicle_name: vehicleName,
      pickup_location: pickupZip ? `Zip: ${pickupZip}` : 'Unknown',
      dropoff_location: deliveryZip ? `Zip: ${deliveryZip}` : 'Unknown',
      est_pickup_date: desiredPickupDate || null,
      est_delivery_date: null,
      estimated_price: 0, // No price yet — specialist will quote
      source: source || 'AI Chat Widget',
      status: 'New',
      notes: notes,
      is_archived: false
    };

    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(leadPayload)
    });

    if (!insertResponse.ok) {
      const errText = await insertResponse.text();
      console.error('Supabase insert error:', errText);
      return res.status(200).json({ success: false, message: 'CRM insert failed', error: errText });
    }

    const inserted = await insertResponse.json();
    const leadId = inserted?.[0]?.id;

    // ---- Step 3: Insert vehicle into quote_vehicles table ----
    if (leadId && vehicleMake) {
      await fetch(`${SUPABASE_URL}/rest/v1/quote_vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          lead_id: leadId,
          year: vehicleYear || '',
          make: vehicleMake || '',
          model: vehicleModel || '',
          vin: '',
          operable: vehicleCondition !== 'Non-Running',
          trailer_type: transportType || 'Open'
        })
      });
    }

    console.log(`✅ Lead saved to Neon CRM — ID: ${leadId}, Customer: ${customerName}`);

    return res.status(200).json({
      success: true,
      leadId,
      message: `Lead for ${customerName} saved to Neon CRM`
    });

  } catch (error) {
    console.error('Lead API error:', error);
    // Return 200 so the chatbot doesn't show an error to the customer
    return res.status(200).json({ success: false, message: 'Failed to save lead', error: error.message });
  }
};

// Helper to fetch from Supabase REST API
async function supabaseFetch(table, { select = '*', filters = '', limit = 10 } = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&${filters}&limit=${limit}`;
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  if (!response.ok) return { data: null };
  const data = await response.json();
  return { data };
}

// Helper to insert into Supabase
async function supabaseInsert(table, payload) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(payload)
  });
}
