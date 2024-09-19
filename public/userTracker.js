(function () {
  const userTracker = {
    startTime: null,
    actions: [],
    widgetId: null,
    campaignId: null,
    displayMode: 'modal',

    init({ campaignId, widgetId, displayMode = 'modal' }) {
      this.startTime = new Date();
      this.campaignId = campaignId;
      this.widgetId = widgetId;
      this.displayMode = displayMode;
      this.trackPageInfo();
      this.setupEventListeners();
      if (this.displayMode === 'modal') {
        this.createModal();
      }
      
      window.addEventListener('load', () => this.loadWidget(this.widgetId));

      console.log(`Initialized userTracker for campaign: ${this.campaignId}, widget: ${this.widgetId}, mode: ${this.displayMode}`);
    },

    trackPageInfo() {
      this.actions.push({
        type: "pageInfo",
        url: window.location.href,
        localStorage: JSON.stringify(localStorage),
        timestamp: new Date(),
      });
    },

    trackAction(actionType, details = {}) {
      this.actions.push({
        type: actionType,
        campaignId: this.campaignId,
        widgetId: this.widgetId,
        ...details,
        timestamp: new Date(),
      });
    },

    setupEventListeners() {
      document.addEventListener("submit", (event) => {
        this.trackAction("submit");
        if (event.target.getAttribute("data-widget-submit") === "true") {
          this.sendData("submit");
        }
      });
      window.addEventListener("beforeunload", () => this.sendData("other"));
      
      // Add more event listeners to track various interactions
      document.addEventListener("click", (event) => {
        this.trackAction("click", { 
          targetId: event.target.id, 
          targetClass: event.target.className 
        });
        this.sendData("click");
      });
    },

    createModal() {
      const modal = document.createElement('div');
      modal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
      `;
      
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background-color: #ffffff;
        margin: 10% auto;
        padding: 30px;
        border: none;
        width: 90%;
        max-width: 900px;
        position: relative;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      `;
      
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.cssText = `
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 32px;
        font-weight: bold;
        border: none;
        background: none;
        cursor: pointer;
        color: #555;
        transition: color 0.3s ease, transform 0.2s ease;
      `;
      closeButton.onmouseover = () => { 
        closeButton.style.color = '#000';
        closeButton.style.transform = 'scale(1.1)';
      };
      closeButton.onmouseout = () => { 
        closeButton.style.color = '#555';
        closeButton.style.transform = 'scale(1)';
      };
      closeButton.onclick = () => { 
        this.modal.style.opacity = '0';
        setTimeout(() => { this.modal.style.display = 'none'; }, 300);
      };
      
      modalContent.appendChild(closeButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      this.modal = modal;
      this.modalContent = modalContent;
    },

    loadWidget(widgetId) {
      this.widgetId = widgetId;
      this.trackAction('widgetLoad', { widgetId });
      
      const widgetContainer = this.displayMode === 'modal' 
        ? this.modalContent 
        : document.getElementById('div-widget-engage');

      if (!widgetContainer) {
        console.error('Widget container not found');
        return;
      }
      
      widgetContainer.innerHTML = '';
      
      fetch(`http://192.168.1.15:9000/api/v1/widgets/${widgetId}/html`)
        .then(response => response.text())
        .then(html => {
          widgetContainer.innerHTML = html;
          this.setupWidgetEventListeners(widgetContainer);
          if (this.displayMode === 'modal') {
            this.modal.style.display = 'block';
            setTimeout(() => { this.modal.style.opacity = '1'; }, 50);
          }
          this.sendData("other"); // Send data when widget is loaded
        })
        .catch(error => {
          console.error('Error loading widget:', error);
          this.trackAction('widgetLoadError', { widgetId, error: error.message });
          widgetContainer.innerHTML = '<p style="color: #ff4d4d; text-align: center;">Error loading widget. Please try again later.</p>';
          this.sendData("other");
        });
    },

    setupWidgetEventListeners(container) {
      container.addEventListener('click', (event) => {
        this.trackAction('widgetClick', { 
          widgetId: this.widgetId,
          targetId: event.target.id,
          targetClass: event.target.className
        });
      });

      container.addEventListener('submit', (event) => {
        this.trackAction('widgetSubmit', { widgetId: this.widgetId });
        this.sendData('submit');
      });
    },

    async getDeviceId() {
      if (localStorage.getItem("client_refrence_id")) {
        return localStorage.getItem("client_refrence_id");
      }
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        `${screen.width}x${screen.height}`,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
        gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      ];

      return this.hash(components.join("###"));
    },

    hash(str) {
      return str.split('').reduce((hash, char) => {
        const charCode = char.charCodeAt(0);
        return ((hash << 5) - hash) + charCode | 0;
      }, 0).toString(36);
    },

    async sendData(reason = "other") {
      const deviceId = await this.getDeviceId();
      const data = {
        widget_id: this.widgetId,
        client_refrence_id: deviceId,
        ref_url: window.location.href,
        interaction_type: reason,
        interaction_data: {
          startTime: this.startTime.toISOString(),
          endTime: new Date().toISOString(),
          actions: this.actions,
          campaignId: this.campaignId
        }
      };

      console.log("Sending tracking data:", data);

      try {
        const response = await fetch(`http://192.168.1.15:9000/api/v1/widgets/${this.widgetId}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
      } catch (error) {
        console.error("Error sending tracking data:", error);
      }
    },

    sendWidgetInteraction: async function(interactionType, interactionData) {
      const deviceId = await this.getDeviceId();
      const data = {
        widget_id: this.widgetId,
        client_refrence_id: deviceId, // Note: There's a typo in the API spec, it should be "reference"
        ref_url: window.location.href,
        interaction_type: interactionType,
        interaction_data: interactionData
      };

      console.log("Sending widget interaction data:", data);

      try {
        const response = await fetch(`http://192.168.1.15:9000/api/v1/widgets/${this.widgetId}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
      } catch (error) {
        console.error("Error sending widget interaction data:", error);
      }
    },
  };

  // Parse script parameters and initialize the tracker
  const script = document.currentScript;
  userTracker.init({
    campaignId: script.getAttribute('data-campaign-id'),
    widgetId: script.getAttribute('data-widget-id'),
    displayMode: script.getAttribute('data-display-mode') || 'modal'
  });

  window.onWidgetSubmit = function(data) {
    if (data.choice) {
      // Multi-choice question
      userTracker.sendWidgetInteraction('multi_choice', { selectedChoice: data.choice });
    } else if (data.result && typeof data.result === 'string') {
      // Fortune wheel
      userTracker.sendWidgetInteraction('fortune_wheel', { result: data.result });
    } else if (data.playerScore !== undefined && data.botScore !== undefined) {
      // Pong game
      userTracker.sendWidgetInteraction('pong_game', {
        playerScore: data.playerScore,
        botScore: data.botScore,
        result: data.result
      });
    } else if (data.clicked !== undefined) {
      // Banner click
      userTracker.sendWidgetInteraction('banner_click', { clicked: data.clicked });
    } else {
      // Generic interaction
      userTracker.sendWidgetInteraction('other', data);
    }
  };
})();
