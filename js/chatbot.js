// js/chatbot.js — Neon Auto Transport AI Sales Agent Widget
// Conversational AI chatbot for lead qualification and quote generation

(function () {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    apiEndpoint: '/api/chat',
    web3formsKey: 'a479d604-6159-4cdd-8eeb-394772c41436',
    phone: '(571) 576-7711',
    phoneRaw: '5715767711',
    maxMessages: 60,
    greeting: "Welcome to Neon Auto Transport! 👋 How can I help you today? I can help you get a quick shipping quote, answer questions about our services, or connect you with our team.",
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
          <h4>Neon AI Specialist</h4>
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
        Powered by <strong>Neon Auto AI</strong>
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
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          extractedFields: extractedFields
        })
      });

      const indicator = document.getElementById('neon-typing-indicator');
      if (indicator) indicator.remove();

      if (!response.ok) {
        throw new Error('API server returned an error');
      }

      const data = await response.json();

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
      formData.append('subject', `New Lead from Neon Auto AI: ${extractedFields.firstName || ''} ${extractedFields.lastName || ''}`);
      formData.append('from_name', 'Neon Auto AI Assistant');
      
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
      console.log('Lead successfully submitted to Neon CRM Database');
    } catch (e) {
      console.error('Failed to submit to Neon CRM Database:', e);
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
