// api/chat.js — Vercel Serverless Function
// Proxies chat to OpenAI and extracts structured lead data

const SYSTEM_PROMPT = `You are the AI Sales Assistant for Best American Auto Transport Inc — a top-rated, FMCSA & US DOT approved nationwide car shipping company with offices in Malvern, PA and Houston, TX. You are a friendly, professional, and knowledgeable auto transport specialist.

YOUR GOAL:
Naturally guide customers through a conversational quote request. Collect all required information through friendly dialogue — do NOT present a form. Ask one or two questions at a time to keep it natural.

REQUIRED INFORMATION TO COLLECT:
1. Vehicle Info: Year, Make, Model (Ask for all three together in a single question)
2. Vehicle Type: Sedan, SUV, Truck, Van, Motorcycle, or Exotic
3. Vehicle Condition: Running or Non-Running (Ask explicitly if it is running or not running)
4. Pickup Zip Code (Ask explicitly for the pickup zipcode)
5. Delivery Zip Code (Ask explicitly for the drop off zipcode)
6. Desired Pickup Date
7. Transport Type: Open or Enclosed (Ask explicitly if they want open or enclosed transport)
8. Customer Name: First and Last
9. Email Address
10. Phone Number

ADDITIONAL QUALIFYING QUESTIONS (ask when relevant):
- Is the vehicle modified or lifted?
- Is the vehicle inoperable (can it roll/brake/steer)?
- Are there personal items inside the vehicle?
- Are you shipping multiple vehicles?

CONVERSATION STRATEGY:
- STEP 1: First message — Ask for the Year, Make, and Model of the vehicle (all at once in one question).
- STEP 2: Next — You MUST explicitly ask the user for TWO things in the same message: their Pick-up Zip Code AND their Delivery Zip Code.
- STEP 3: Next — Ask BOTH: Is the vehicle running or not running? AND Do they want Open or Enclosed transport? (ask both in the same message)
- STEP 4: Next — Ask for the desired pickup date.
- STEP 5: Finally — Collect contact info: name, email, and phone number.
- Keep responses concise (2-3 sentences max).
- Use a warm, professional tone.
- Use emojis sparingly (one per message max).
- NEVER re-ask for information already provided.
- NEVER ask for city/state — ONLY ask for zipcodes.

ROUTE INTELLIGENCE:
When asked about transit times, provide general estimates:
- Under 500 miles: 1-2 days
- 500-1000 miles: 2-3 days
- 1000-1500 miles: 3-5 days
- 1500-2500 miles: 5-7 days
- 2500+ miles: 7-10 days
Always note these are estimates that depend on carrier availability and exact locations.

PRICING RULES:
- NEVER give specific dollar amounts or fake prices
- Explain that pricing depends on: vehicle type, route distance, transport type (open vs enclosed), vehicle condition, time of year, and current carrier availability
- Guide the customer toward completing the quote so a specialist can provide an accurate quote

HIGH-INTENT SIGNALS:
If the customer mentions urgency, a deadline, asks about expedited service, or seems ready to book:
- Suggest they call directly for fastest service: (302) 355-5544
- Mark intent as high in your extraction

COMPANY FACTS:
- Phone: (302) 355-5544
- Email: info@bestamericanautotransport.com
- Address: 2709 Neabsco Common Pl Suite 101, Malvern, PA & Houston, TX 22191
- Hours: Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM
- Service: Door-to-door auto transport across all 50 states
- Insurance: All carriers carry active cargo insurance
- Experience: 9+ years, 150K+ vehicles shipped

RESPONSE FORMAT:
You must ALWAYS respond with valid JSON in this exact format:
{
  "reply": "Your natural language response to the customer",
  "extractedData": {
    "firstName": null,
    "lastName": null,
    "email": null,
    "phone": null,
    "vehicleYear": null,
    "vehicleMake": null,
    "vehicleModel": null,
    "vehicleType": null,
    "vehicleCondition": null,
    "pickupZip": null,
    "deliveryZip": null,
    "desiredPickupDate": null,
    "transportType": null,
    "isModified": null,
    "isLifted": null,
    "isInoperable": null,
    "hasPersonalItems": null,
    "multipleVehicles": null
  },
  "leadComplete": false,
  "highIntent": false
}

RULES FOR extractedData:
- Only include fields that the customer has EXPLICITLY stated in this message or previous messages
- Use null for any field not yet provided
- Set leadComplete to true ONLY when you have: firstName, lastName, email, phone, vehicle (year+make+model), pickupZip, deliveryZip, vehicleCondition, and transportType
- Set highIntent to true if the customer shows urgency or asks about expedited service
- For vehicleType, map the vehicle to: Sedan, SUV, Truck, Van, Motorcycle, or Exotic
- For vehicleCondition, use: Running or Non-Running
- For transportType, use: Open or Enclosed`;

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

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey && !openaiApiKey) {
    return handleMockSimulation(req, res);
  }

  try {
    const { messages, extractedFields } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // Rate limiting: max 60 messages per conversation
    if (messages.length > 60) {
      return res.status(429).json({ error: 'Conversation limit reached. Please call (302) 355-5544 for assistance.' });
    }

    // Sanitize messages
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: String(msg.content || '').slice(0, 500).replace(/<[^>]*>/g, '')
    }));

    // Build context about what's already been collected
    let contextNote = '';
    if (extractedFields && Object.keys(extractedFields).length > 0) {
      const collected = Object.entries(extractedFields)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      if (collected) {
        contextNote = `\n\n[SYSTEM NOTE: Fields already collected from this customer: ${collected}. Do not re-ask for these. Focus on collecting remaining required fields.]`;
      }
    }

    let content = '';

    if (geminiApiKey) {
      // Call Gemini API (Generous Free Tier)
      const geminiContents = sanitizedMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      let response;
      let lastError = '';
      const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-1.5-flash-8b', 'gemini-2.5-flash', 'gemini-2.0-flash'];

      for (const model of modelsToTry) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        try {
          response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: geminiContents,
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT + contextNote }]
              },
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          });

          if (response.ok) {
            break;
          } else {
            lastError = await response.text();
            console.warn(`Failed to call Gemini model ${model}, trying next... Error:`, lastError);
          }
        } catch (e) {
          lastError = e.message;
          console.warn(`Error calling Gemini model ${model}, trying next...`, e);
        }
      }

      if (!response || !response.ok) {
        const errText = lastError;
        console.error('All Gemini API models failed. Last error:', errText);
        // Always fall back to mock simulation if Gemini is unavailable
        console.warn('⚠️  Gemini API unavailable — falling back to smart mock simulation.');
        return handleMockSimulation(req, res);
      }

      const data = await response.json();
      content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else {
      // Call OpenAI API (Paid Tier)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + contextNote },
            ...sanitizedMessages
          ],
          temperature: 0.7,
          max_tokens: 600,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', response.status, errorData);
        return res.status(502).json({ error: 'AI service temporarily unavailable' });
      }

      const data = await response.json();
      content = data.choices?.[0]?.message?.content;
    }

    if (!content) {
      return res.status(502).json({ error: 'Empty response from AI service' });
    }

    // Parse the JSON response from the AI
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parsing fails, treat the whole response as the reply
      parsed = {
        reply: content,
        extractedData: {},
        leadComplete: false,
        highIntent: false
      };
    }

    return res.status(200).json({
      reply: parsed.reply || 'I apologize, could you repeat that?',
      extractedData: parsed.extractedData || {},
      leadComplete: parsed.leadComplete || false,
      highIntent: parsed.highIntent || false
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function handleMockSimulation(req, res) {
  const { messages, extractedFields } = req.body;
  const currentFields = { ...extractedFields };
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const text = lastUserMsg.toLowerCase().trim();

  let reply = '';
  let highIntent = false;

  // 1. Detect high intent
  if (text.includes('urgent') || text.includes('emergency') || text.includes('asap') || text.includes('expedite') || text.includes('now') || text.includes('ready to book')) {
    highIntent = true;
  }

  // 2. Pricing intelligence
  if (text.includes('how much') || text.includes('cost') || text.includes('price') || (text.includes('quote') && (text.includes('much') || text.includes('rate')))) {
    reply = "Pricing depends on vehicle type, route distance, transport type (open/enclosed), and vehicle condition. To get an accurate quote, let's finish collecting your details!";
  }
  // 3. Route intelligence
  else if (text.includes('how long') || text.includes('transit time') || (text.includes('days') && (text.includes('take') || text.includes('from')))) {
    reply = "Transit times generally depend on route distance: under 500 miles takes 1-2 days, 1000-1500 miles takes 3-5 days, and coast-to-coast (2500+ miles) takes 7-10 days. Let me get your route to be more specific.";
  }

  // 4. Extract data based on user input
  const yearMatch = text.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    currentFields.vehicleYear = yearMatch[1];
  }
  
  if (text.includes('tesla') || text.includes('model y') || text.includes('model 3')) {
    currentFields.vehicleMake = 'Tesla';
    if (text.includes('model y')) currentFields.vehicleModel = 'Model Y';
    else if (text.includes('model 3')) currentFields.vehicleModel = 'Model 3';
    currentFields.vehicleType = 'SUV';
  } else if (text.includes('ford') || text.includes('mustang') || text.includes('f-150')) {
    currentFields.vehicleMake = 'Ford';
    if (text.includes('f-150')) {
      currentFields.vehicleModel = 'F-150';
      currentFields.vehicleType = 'Truck';
    } else {
      currentFields.vehicleModel = 'Mustang';
      currentFields.vehicleType = 'Sedan';
    }
  } else if (text.includes('honda') || text.includes('civic') || text.includes('accord')) {
    currentFields.vehicleMake = 'Honda';
    currentFields.vehicleModel = text.includes('civic') ? 'Civic' : 'Accord';
    currentFields.vehicleType = 'Sedan';
  } else if (text.includes('toyota') || text.includes('rav4') || text.includes('camry')) {
    currentFields.vehicleMake = 'Toyota';
    currentFields.vehicleModel = text.includes('rav4') ? 'RAV4' : 'Camry';
    currentFields.vehicleType = text.includes('rav4') ? 'SUV' : 'Sedan';
  } else if (lastUserMsg && !currentFields.vehicleMake) {
    const words = lastUserMsg.split(' ');
    if (words.length >= 2) {
      if (yearMatch) {
        const yearIdx = words.findIndex(w => w.includes(currentFields.vehicleYear));
        if (yearIdx !== -1 && words[yearIdx + 1]) {
          currentFields.vehicleMake = words[yearIdx + 1];
          currentFields.vehicleModel = words.slice(yearIdx + 2).join(' ') || 'Model';
        }
      } else {
        currentFields.vehicleMake = words[0];
        currentFields.vehicleModel = words.slice(1).join(' ');
      }
    }
  }

  // Extract Zipcodes
  const zips = text.match(/\b\d{5}\b/g);
  if (zips) {
    if (zips.length >= 2) {
      currentFields.pickupZip = zips[0];
      currentFields.deliveryZip = zips[1];
    } else if (zips.length === 1) {
      if (!currentFields.pickupZip) {
        currentFields.pickupZip = zips[0];
      } else if (!currentFields.deliveryZip) {
        currentFields.deliveryZip = zips[0];
      }
    }
  } else {
    // If they typed name of city/state instead of zipcode, handle it as zip fallback
    const cleanInput = text.trim();
    if (cleanInput.length > 2 && isNaN(cleanInput)) {
      if (!currentFields.pickupZip) {
        currentFields.pickupZip = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
      } else if (!currentFields.deliveryZip) {
        currentFields.deliveryZip = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
      }
    }
  }

  // Extract transport type
  if (text.includes('enclosed')) {
    currentFields.transportType = 'Enclosed';
  } else if (text.includes('open')) {
    currentFields.transportType = 'Open';
  }

  // Extract condition
  if (text.includes('non-running') || text.includes('non running') || text.includes('inop') || text.includes('broken') || text.includes('not running')) {
    currentFields.vehicleCondition = 'Non-Running';
  } else if (text.includes('running') || text.includes('runs') || text.includes('drives')) {
    currentFields.vehicleCondition = 'Running';
  }

  // Extract date
  if (text.includes('june 15') || text.includes('06/15') || text.includes('6/15')) {
    currentFields.desiredPickupDate = 'June 15';
  } else if (text.includes('asap') || text.includes('soon') || text.includes('immediately')) {
    currentFields.desiredPickupDate = 'ASAP';
  } else if (text.includes('tomorrow')) {
    currentFields.desiredPickupDate = 'Tomorrow';
  }

  // Extract contact details (email, phone, name)
  const emailMatch = lastUserMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    currentFields.email = emailMatch[0];
  }
  const phoneMatch = text.match(/\b\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/);
  if (phoneMatch) {
    currentFields.phone = phoneMatch[0];
  }
  if (emailMatch || phoneMatch) {
    const cleanText = lastUserMsg.replace(emailMatch ? emailMatch[0] : '', '').replace(phoneMatch ? phoneMatch[0] : '', '').replace(/,/g, '').trim();
    const nameParts = cleanText.split(/[\s]+/);
    if (nameParts.length >= 2) {
      currentFields.firstName = nameParts[0];
      currentFields.lastName = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1 && nameParts[0].length > 1) {
      currentFields.firstName = nameParts[0];
      currentFields.lastName = 'Customer';
    }
  }

  // Determine response
  if (!reply) {
    if (!currentFields.vehicleMake || !currentFields.vehicleModel) {
      reply = "What is the **year, make, and model** of the vehicle you need shipped? (e.g., 2022 Honda Civic)";
    } else if (!currentFields.pickupZip || !currentFields.deliveryZip) {
      if (!currentFields.pickupZip && !currentFields.deliveryZip) {
        reply = "Great! Could you please provide me the **zipcodes** for both the pickup and drop off locations?";
      } else if (!currentFields.pickupZip) {
        reply = "What is the **zipcode** for the pickup location?";
      } else {
        reply = "And what is the **zipcode** for the drop off (delivery) location?";
      }
    } else if (!currentFields.vehicleCondition || !currentFields.transportType) {
      if (!currentFields.vehicleCondition && !currentFields.transportType) {
        reply = "Got it! Two quick questions — is the vehicle **running or not running**? And would you prefer **Open** or **Enclosed** transport?";
      } else if (!currentFields.vehicleCondition) {
        reply = "Is the vehicle **running** or **not running**?";
      } else {
        reply = "Would you prefer **Open Transport** or **Enclosed Transport**?";
      }
    } else if (!currentFields.desiredPickupDate) {
      reply = "What is your desired pickup date? 📅";
    } else if (!currentFields.firstName || !currentFields.phone || !currentFields.email) {
      reply = "Perfect! Last step — can I get your **name, email address, and phone number** so our team can send you a custom quote?";
    } else {
      reply = "🎉 All set! Your shipment details have been submitted. A specialist will reach out to you shortly with a custom quote!";
    }
  }

  const leadComplete = !!(
    currentFields.firstName &&
    currentFields.phone &&
    currentFields.email &&
    currentFields.vehicleMake &&
    currentFields.pickupZip &&
    currentFields.deliveryZip &&
    currentFields.vehicleCondition &&
    currentFields.transportType
  );

  return res.status(200).json({
    reply,
    extractedData: currentFields,
    leadComplete,
    highIntent
  });
}
