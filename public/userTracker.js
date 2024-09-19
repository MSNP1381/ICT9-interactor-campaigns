(function () {
  const userTracker = {
    startTime: null,
    actions: null,
    // widgetId: null,
    // campaignId: null,
    // displayMode: 'modal',
    baseUrl: "http://192.168.1.15:9000",
    client_reference_id:'',

    init: function ({ campaignId, widgetId, displayMode = "modal",client_reference_id=null }) {
      this.startTime = new Date();
      this.campaignId = campaignId;
      this.widgetId = widgetId;
      this.client_reference_id=client_reference_id;
      // var widgetId = widgetId;
      if (localStorage.getItem("widgetId")) {
        widgetId = localStorage.getItem("widgetId");
      }
      else{
        localStorage.setItem("widgetId", widgetId);
      }
      // console.log(campaignId, widgetId, displayMode );
      this.displayMode = displayMode;
      this.trackPageInfo();
      this.setupEventListeners();
      if (this.displayMode === "modal") {
        this.createModal();
      }

      window.addEventListener("load", () => this.loadWidget(this.widgetId));

      console.log(
        `Initialized userTracker for campaign: ${this.campaignId}, widget: ${this.widgetId}, mode: ${this.displayMode}`
      );
    },

    trackPageInfo() {
      this.actions=({
        type: "pageInfo",
        url: window.location.href,
        localStorage: JSON.stringify(localStorage),
        timestamp: new Date(),
      });
    },

    trackAction(actionType, details = {}) {
      this.actions=({
        type: actionType,
        campaignId: this.campaignId,
        widgetId: this.widgetId,
        ...details,
        timestamp: new Date(),
      });
    },

    setupEventListeners() {
      // return;
      document.addEventListener("widgetSubmit", (event) =>{ console.log(event);this.winSubmit(event.detail)});
      document.addEventListener("submit", (event) => {
        this.trackAction("submit");
        if (event.target.getAttribute("data-widget-submit") === "true") {
          this.sendData("submit");
        }
      });
      document.addEventListener("beforeunload", () => this.sendData("other"));
      // window.onwin
      // window.onWidgetSubmit=this.winSubmit;


      // Add more event listeners to track various interactions
      document.addEventListener("click", (event) => {
        this.trackAction("click", {
          targetId: event.target.id,
          targetClass: event.target.className,
        });
        this.sendData("click");
      });

    },

    createModal() {
      const modal = document.createElement("div");
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

      const modalContent = document.createElement("div");
      modalContent.style.cssText = `
        background-color: #ffffff;
        margin: 10% auto;
        padding: 10px;
        border: none;
        width: 90%;
        max-width: 900px;
        position: relative;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      `;

      const closeButton = document.createElement("button");
      closeButton.innerHTML = "&times;";
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
        closeButton.style.color = "#000";
        closeButton.style.transform = "scale(1.1)";
      };
      closeButton.onmouseout = () => {
        closeButton.style.color = "#555";
        closeButton.style.transform = "scale(1)";
      };
      closeButton.onclick = () => {
        this.modal.style.opacity = "0";
        setTimeout(() => {
          this.modal.style.display = "none";
        }, 300);
      };

      modalContent.appendChild(closeButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      this.modal = modal;
      this.modalContent = modalContent;
    },

    loadWidget(widgetId) {
      this.widgetId = widgetId;
      var widgetId = widgetId;
      this.trackAction("widgetLoad", { widgetId });

      const widgetContainer =
        this.displayMode === "modal"
          ? this.modalContent
          : document.getElementById("div-widget-engage");

      if (!widgetContainer) {
        console.error("Widget container not found");
        return;
      }

      widgetContainer.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.id = "div-widget-engage";
      iframe.style.width = "100%";
      iframe.style.minWidth = "830px";
      iframe.style.minHeight = "450px";
      iframe.style.border = "none";

      widgetContainer.appendChild(iframe);

      fetch(`${this.baseUrl}/api/v1/widgets/${widgetId}/html`)
        .then((response) => response.text())
        .then((html) => {
          iframe.srcdoc = html;
          this.setupWidgetEventListeners(iframe.contentWindow);
          if (this.displayMode === "modal") {
            this.modal.style.display = "block";
            setTimeout(() => {
              this.modal.style.opacity = "1";
            }, 50);
          }
          this.sendData("other"); // Changed from "other" to "widget_load"
        })
        .catch((error) => {
          console.error("Error loading widget:", error);
          this.trackAction("widgetLoadError", {
            widgetId,
            error: error.message,
          });
          iframe.srcdoc =
            '<p style="color: #ff4d4d; text-align: center;">Error loading widget. Please try again later.</p>';
          this.sendData("other"); // Changed from "other" to "widget_load_error"
        });
    },

    setupWidgetEventListeners(contentWindow) {
      contentWindow.addEventListener("click", (event) => {
        this.trackAction("widgetClick", {
          widgetId: this.widgetId,
          targetId: event.target.id,
          targetClass: event.target.className,
        });
      });

      contentWindow.addEventListener("submit", (event) => {
        this.trackAction("widgetSubmit", { widgetId: this.widgetId });
        this.sendData("widget_submit"); // Changed from "submit" to "widget_submit"
      });

      // Add close modal button
      const closeModalButton = document.createElement("button");
      closeModalButton.textContent = "Close";
      closeModalButton.style.cssText = `
        position: absolute;
        right: 15px;
        bottom: 15px;
        padding: 10px 20px;
        font-size: 16px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      `;
      closeModalButton.onmouseover = () => {
        closeModalButton.style.backgroundColor = "#d32f2f";
      };
      closeModalButton.onmouseout = () => {
        closeModalButton.style.backgroundColor = "#f44336";
      };
      closeModalButton.onclick = () => {
        if (this.modal) {
          this.modal.style.opacity = "0";
          setTimeout(() => {
            this.modal.style.display = "none";
          }, 300);
        }
      };
      this.modalContent.appendChild(closeModalButton);
    },

    async getDeviceId() {
      if (this.client_reference_id) {
        console.log("client_reference_id:", this.client_reference_id);
        return this.client_reference_id;
      }
      // if (localStorage.getItem("client_reference_id")) {
      //   return localStorage.getItem("client_reference_id");
      // }
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

      return this.md5(components.join("###"));
    },



    async sendData(interactionType, interactionData = {}) {
      const deviceId = await this.getDeviceId();
      // const widgetId = this.widgetId;
      var widgetId = localStorage.getItem("widgetId");
      console.log("Widget ID:", widgetId);
      // var widgetId = widgetId;
      if (!widgetId) {
        console.error("Widget ID is null or undefined");
        return;
      }

      const data = {
        widget_id: widgetId,
        client_reference_id: deviceId,
        ref_url: window.location.href,
        interaction_type: interactionType,
        interaction_data: {
          ...interactionData,
          startTime: this.startTime.toISOString(),
          endTime: new Date().toISOString(),
          actions: this.actions,
          campaignId: this.campaignId,
        },
      };

      console.log("Sending data:", data);

      try {
        const response = await fetch(
          `${this.baseUrl}/api/v1/widgets/${widgetId}/interactions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    },

    md5: function (inputString) {
      var hc = "0123456789abcdef";
      function rh(n) {
        var j,
          s = "";
        for (j = 0; j <= 3; j++)
          s +=
            hc.charAt((n >> (j * 8 + 4)) & 0x0f) +
            hc.charAt((n >> (j * 8)) & 0x0f);
        return s;
      }
      function ad(x, y) {
        var l = (x & 0xffff) + (y & 0xffff);
        var m = (x >> 16) + (y >> 16) + (l >> 16);
        return (m << 16) | (l & 0xffff);
      }
      function rl(n, c) {
        return (n << c) | (n >>> (32 - c));
      }
      function cm(q, a, b, x, s, t) {
        return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
      }
      function ff(a, b, c, d, x, s, t) {
        return cm((b & c) | (~b & d), a, b, x, s, t);
      }
      function gg(a, b, c, d, x, s, t) {
        return cm((b & d) | (c & ~d), a, b, x, s, t);
      }
      function hh(a, b, c, d, x, s, t) {
        return cm(b ^ c ^ d, a, b, x, s, t);
      }
      function ii(a, b, c, d, x, s, t) {
        return cm(c ^ (b | ~d), a, b, x, s, t);
      }
      function sb(x) {
        var i;
        var nblk = ((x.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < x.length; i++)
          blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = x.length * 8;
        return blks;
      }
      var i,
        x = sb("" + inputString),
        a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878,
        olda,
        oldb,
        oldc,
        oldd;
      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = ad(a, olda);
        b = ad(b, oldb);
        c = ad(c, oldc);
        d = ad(d, oldd);
      }
      return rh(a) + rh(b) + rh(c) + rh(d);
    },

    async winSubmit(data) {
      console.log("winSubmit called with data:", data);
      console.log("Current widgetId:", this.widgetId);

      if (data.choice) {
        // Multi-choice question
        await this.sendData("game_score", { name:"multi_choice",selectedChoice: data.choice });
      } else if (data.result && typeof data.result === "string") {
        // Fortune wheel
        await this.sendData("game_score", {name:"fortune_wheel", result: data.result });
      } else if (
        data.playerScore !== undefined &&
        data.botScore !== undefined
      ) {
        // Pong game
        await this.sendData("game_score", {
          name:"pong_game",
          playerScore: data.playerScore,
          botScore: data.botScore,
          result: data.result,
        });
      } else if (data.clicked !== undefined) {
        // Banner click
        await this.sendData("game_score", {name:"banner_Wheel", clicked: data.clicked });
      } else {
        // Generic interaction
        await this.sendData("other", data);
      }
    },
  };

  // Parse script parameters and initialize the tracker
  const script = document.currentScript;

  userTracker.init({
    campaignId: script.getAttribute("data-campaign-id"),
    widgetId: script.getAttribute("data-widget-id"),
    displayMode: script.getAttribute("data-display-mode") || "modal",
    client_reference_id: script.getAttribute("client-reference-id"),
  });
})();
