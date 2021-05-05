window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#343c66",
        "text": "#cfcfe8"
      },
      "button": {
        "background": "#f71559"
      }
    },
    "position": "bottom-right",
    "type": "opt-in",
    "content": {
      "message": "Ez a honlap a jobb felhasználói élmény érdekében sütiket használ",
      "dismiss": "Rendben",
      "deny": "Nem szeretném",
      "allow": "Elfogadom",
      "link": "További információ",
      "policy": 'Süti szabályok',
      "revokable": true,
      "href": "/sutik"
    },
    onInitialise: function (status) {
      var type = this.options.type;
      var didConsent = this.hasConsented();
      if (type == 'opt-in' && didConsent) {
        // enable cookies
        loadGAonConsent();
        loadDisqusOnConsent();
      }
      if (type == 'opt-out' && !didConsent) {
        // disable cookies
      }
    },
    onStatusChange: function(status, chosenBefore) {
      var type = this.options.type;
      var didConsent = this.hasConsented();
      if (type == 'opt-in' && didConsent) {
        // enable cookies
        loadGAonConsent();
        loadDisqusOnConsent();
      }
      if (type == 'opt-out' && !didConsent) {
        // disable cookies
      }
    },
    onRevokeChoice: function() {
      var type = this.options.type;
      if (type == 'opt-in') {
        // disable cookies
      }
      if (type == 'opt-out') {
        // enable cookies
        loadGAonConsent();
        loadDisqusOnConsent();
      }
    }
  });