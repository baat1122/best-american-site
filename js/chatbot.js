// js/chatbot.js — Best American Auto Transport Inc AI Sales Agent Widget
// Conversational AI chatbot for lead qualification and quote generation

(function () {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    apiEndpoint: '/api/chat',
    web3formsKey: '39370f4e-9eb6-47ed-99a2-31569ae34b2a',
    geminiApiKey: 'AQ.Ab8RN6J2lyEfxnWXHY2R8tisdYKAWZFnsi94QXrJuAtL_ZOfXw',
    phone: '(302) 355-5544',
    phoneRaw: '3023555544',
    maxMessages: 60,
    greeting: "Welcome to Best American Auto Transport Inc! 👋 How can I help you today? I can help you get a quick shipping quote, answer questions about our services, or connect you with our team.",
    followUp: "To get started, could you tell me the **Year, Make, and Model** of the vehicle you need shipped?",
    placeholderText: 'Type your message...',
  };

  // ---- State ----
  let isOpen = false;
  let isProcessing = false;
  let conversationHistory = [];
  let extractedFields = {};
  let leadSubmitted = false;
  let messageCount = 0;

  // ---- DOM References ----
  let chatBubble, chatWindow, messagesContainer, inputField, sendBtn, inputArea;

  // ---- Initialize ----
  function init() {
    if (document.getElementById('neon-chat-bubble')) return;
    createBubble();
    createChatWindow();
    bindEvents();
  }

  // ---- Create Floating Bubble ----
  function createBubble() {
    chatBubble = document.createElement('button');
    chatBubble.id = 'neon-chat-bubble';
    chatBubble.setAttribute('aria-label', 'Open AI chat assistant');
    chatBubble.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="chat-badge" id="neon-chat-badge" style="display:none">1</span>
    `;
    document.body.appendChild(chatBubble);
  }

  // ---- Create Chat Window ----
  function createChatWindow() {
    chatWindow = document.createElement('div');
    chatWindow.id = 'neon-chat-window';
    chatWindow.innerHTML = `
      <div class="neon-chat-header">
        <div class="neon-chat-header-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="neon-chat-header-info">
          <h4>Best American AI Specialist</h4>
          <p><span class="status-dot"></span>Online — Responds instantly</p>
        </div>
        <button class="neon-chat-header-close" id="neon-chat-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="neon-chat-messages" id="neon-chat-messages">
        <!-- Messages go here -->
      </div>
      <div class="neon-chat-input-area" id="neon-chat-input-area">
        <textarea id="neon-chat-input" class="neon-chat-input" placeholder="${CONFIG.placeholderText}" rows="1"></textarea>
        <button id="neon-chat-send" class="neon-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="neon-chat-powered">
        Powered by <strong>Best American Auto AI</strong>
      </div>
    `;
    document.body.appendChild(chatWindow);
    messagesContainer = document.getElementById('neon-chat-messages');
    inputField = document.getElementById('neon-chat-input');
    sendBtn = document.getElementById('neon-chat-send');
    inputArea = document.getElementById('neon-chat-input-area');
  }

  // ---- Bind Events ----
  function bindEvents() {
    chatBubble.addEventListener('click', toggleChat);
    document.getElementById('neon-chat-close').addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Auto-expand textarea
    inputField.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  // ---- Toggle Chat Visibility ----
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add('visible');
      chatBubble.classList.add('open');
      chatBubble.querySelector('.chat-icon').style.display = 'none';
      chatBubble.querySelector('.close-icon').style.display = 'block';
      const badge = document.getElementById('neon-chat-badge');
      if (badge) badge.style.display = 'none';
      inputField.focus();
      
      if (conversationHistory.length === 0) {
        // Show greeting then follow-up after a brief delay
        addBotMessage(CONFIG.greeting);
        conversationHistory.push({ role: 'assistant', content: CONFIG.greeting });
        setTimeout(() => {
          addBotMessage(CONFIG.followUp);
          conversationHistory.push({ role: 'assistant', content: CONFIG.followUp });
        }, 800);
      }
    } else {
      chatWindow.classList.remove('visible');
      chatBubble.classList.remove('open');
      chatBubble.querySelector('.chat-icon').style.display = 'block';
      chatBubble.querySelector('.close-icon').style.display = 'none';
    }
  }

  // ---- Render Messages ----
  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'neon-msg user';
    msg.innerHTML = `${escapeHTML(text)}`;
    messagesContainer.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'neon-msg bot';
    msg.innerHTML = `${formatMessageText(text)}`;
    messagesContainer.appendChild(msg);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'neon-typing-indicator';
    indicator.className = 'neon-typing';
    indicator.innerHTML = `
      <span class="neon-typing-dot"></span>
      <span class="neon-typing-dot"></span>
      <span class="neon-typing-dot"></span>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

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

  async function callGeminiDirectly(messages, extractedFields) {
    if (!CONFIG.geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const modelName = 'gemini-2.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${CONFIG.geminiApiKey}`;

    const geminiContents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

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

    const payload = {
      contents: geminiContents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT + contextNote }]
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 600
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini direct call failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('Empty response from Gemini API');
    }

    return JSON.parse(content);
  }

  // ---- Handle User Message Sending ----
  async function handleSendMessage() {
    const text = inputField.value.trim();
    if (!text || isProcessing) return;

    inputField.value = '';
    inputField.style.height = 'auto';
    isProcessing = true;
    messageCount++;

    addUserMessage(text);
    conversationHistory.push({ role: 'user', content: text });

    showTypingIndicator();

    try {
      let data;
      let usingFallback = false;

      try {
        const response = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            extractedFields: extractedFields
          })
        });

        if (!response.ok) {
          throw new Error('API server returned status ' + response.status);
        }

        data = await response.json();
      } catch (backendErr) {
        console.warn('Backend API failed, falling back to direct Gemini API:', backendErr);
        usingFallback = true;
        data = await callGeminiDirectly(conversationHistory, extractedFields);
      }

      const indicator = document.getElementById('neon-typing-indicator');
      if (indicator) indicator.remove();

      // Merge new extracted data
      if (data.extractedData) {
        extractedFields = { ...extractedFields, ...data.extractedData };
      }

      addBotMessage(data.reply);
      conversationHistory.push({ role: 'assistant', content: data.reply });

      // Action CTAs based on intent/completeness
      if (data.highIntent) {
        showCallCTA();
      }

      if (data.leadComplete && !leadSubmitted) {
        await handleLeadCompletion();
      }

    } catch (err) {
      console.error('Chatbot error:', err);
      const indicator = document.getElementById('neon-typing-indicator');
      if (indicator) indicator.remove();
      addBotMessage("I apologize, but I'm having trouble connecting right now. Please feel free to call our dispatch team directly at " + CONFIG.phone + " for immediate assistance!");
    } finally {
      isProcessing = false;
    }
  }

  // ---- Lead Completion Logic ----
  async function handleLeadCompletion() {
    leadSubmitted = true;
    
    // Save to local storage for the dashboard
    saveLeadToLocalStorage();

    // Render Shipment Summary Card in-chat
    renderSummaryCard();

    // Submit to Web3Forms
    try {
      const formData = new FormData();
      formData.append('access_key', CONFIG.web3formsKey);
      formData.append('subject', `New Lead from Best American Auto AI: ${extractedFields.firstName || ''} ${extractedFields.lastName || ''}`);
      formData.append('from_name', 'Best American Auto AI Assistant');
      
      // Append all lead details
      Object.entries(extractedFields).forEach(([key, val]) => {
        formData.append(key, val !== null ? val : 'N/A');
      });

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      console.log('Lead submitted to Web3Forms successfully');
    } catch (e) {
      console.error('Failed to submit to Web3Forms:', e);
    }

    // Submit directly to custom CRM endpoint
    try {
      const fieldsToSend = { ...extractedFields, source: 'AI Chatbot' };
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: fieldsToSend })
      });
      console.log('Lead successfully submitted to Best American CRM Database');
    } catch (e) {
      console.error('Failed to submit to Best American CRM Database:', e);
    }
  }

  // ---- Save Lead to LocalStorage ----
  function saveLeadToLocalStorage() {
    try {
      const existing = localStorage.getItem('neon_ai_leads');
      const leads = existing ? JSON.parse(existing) : [];
      
      const newLead = {
        id: 'lead_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'New Lead',
        leadScore: extractedFields.highIntent ? '🔥 Hot' : '❄️ Cold',
        source: window.location.pathname,
        dispatcherNotes: '',
        aiNotes: 'Lead captured via AI chat widget.',
        fields: { ...extractedFields }
      };

      leads.unshift(newLead);
      localStorage.setItem('neon_ai_leads', JSON.stringify(leads));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }

  // ---- Render Shipment Summary Card ----
  function renderSummaryCard() {
    const card = document.createElement('div');
    card.className = 'neon-shipment-summary';
    card.innerHTML = `
      <div class="neon-summary-header">
        <span>Quote Details Submitted</span>
      </div>
      <div class="neon-summary-body">
        <div class="neon-summary-row">
          <div class="icon">📍</div>
          <div>
            <div class="label">Route</div>
            <div class="value">
              Zip: ${extractedFields.pickupZip || 'N/A'} 
              <span class="neon-summary-route-arrow">➔</span> 
              Zip: ${extractedFields.deliveryZip || 'N/A'}
            </div>
          </div>
        </div>
        <div class="neon-summary-row">
          <div class="icon">🚗</div>
          <div>
            <div class="label">Vehicle</div>
            <div class="value">${extractedFields.vehicleYear || ''} ${extractedFields.vehicleMake || ''} ${extractedFields.vehicleModel || ''} (${extractedFields.vehicleType || 'Sedan'})</div>
          </div>
        </div>
        <div class="neon-summary-row">
          <div class="icon">⚙️</div>
          <div>
            <div class="label">Condition & Service</div>
            <div class="value">${extractedFields.vehicleCondition || 'Running'} | ${extractedFields.transportType || 'Open'} Transport</div>
          </div>
        </div>
        <div class="neon-summary-row">
          <div class="icon">📅</div>
          <div>
            <div class="label">Desired Date</div>
            <div class="value">${extractedFields.desiredPickupDate || 'ASAP'}</div>
          </div>
        </div>
        <div class="neon-summary-row">
          <div class="icon">👤</div>
          <div>
            <div class="label">Contact Info</div>
            <div class="value">${extractedFields.firstName || ''} ${extractedFields.lastName || ''} — ${extractedFields.phone || ''}</div>
          </div>
        </div>
      </div>
      <div class="neon-summary-footer">
        <div class="success-badge">✓ Request Received</div>
        <p>A specialist will call or email you shortly with custom pricing.</p>
      </div>
    `;
    messagesContainer.appendChild(card);
    scrollToBottom();
  }

  // ---- Show Call ----
  function showCallCTA() {
    if (document.getElementById('neon-call-cta')) return;

    const cta = document.createElement('div');
    cta.id = 'neon-call-cta';
    cta.className = 'neon-chat-call-cta';
    cta.innerHTML = `
      <a href="tel:${CONFIG.phoneRaw}">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.27 1.11z"></path>
        </svg>
        Call Specialist: ${CONFIG.phone}
      </a>
      <div class="subtext">Call to speak with a coordinator directly.</div>
    `;
    messagesContainer.appendChild(cta);
    scrollToBottom();
  }

  // ---- Utilities ----
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMessageText(text) {
    return escapeHTML(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  // Run initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
