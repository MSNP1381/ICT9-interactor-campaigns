(function () {
  const userTracker = {
    startTime: null,
    actions: [],

    init: function () {
      this.startTime = new Date();
      this.trackPageInfo();
      this.setupEventListeners();
    },

    trackPageInfo: function () {
      this.actions.push({
        type: "pageInfo",
        url: window.location.href,
        localStorage: JSON.stringify(localStorage),
        timestamp: new Date(),
      });
    },

    trackAction: function (actionType, details = {}) {
      this.actions.push({
        type: actionType,
        ...details,
        timestamp: new Date(),
      });
    },

    setupEventListeners: function () {
      document.addEventListener("submit", (event) => {
        this.trackAction("submit");
        if (event.target.getAttribute("data-widget-submit") === "true") {
          this.sendData("Widget_submit");
        }
      });
      window.addEventListener("beforeunload", () => this.trackAction("close"));
    },

    getDeviceId: function () {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

        let components = [
          navigator.userAgent,
          navigator.language,
          screen.colorDepth,
          screen.width + "x" + screen.height,
          new Date().getTimezoneOffset(),
          !!window.sessionStorage,
          !!window.localStorage,
          gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        ];

        let deviceId = this.hash(components.join("###"));
        resolve(deviceId);
      });
    },

    hash: function (str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(36);
    },

    sendData: async function (reason = "beforeunload") {
      const deviceId = await this.getDeviceId();
      const data = {
        startTime: this.startTime,
        endTime: new Date(),
        deviceId: deviceId,
        actions: this.actions,
        reason: reason,
      };

      console.log("User tracking data:", data);
      // Here you would typically send the data to your server
    },
  };

  userTracker.init();
  window.addEventListener("beforeunload", () => userTracker.sendData());
})();
