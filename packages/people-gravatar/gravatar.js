Gravatar = (function() {
  function Gravatar(email) {
    this.email = email;
    if (this.email) {
        this.hash = CryptoJS.MD5(this.email.trim().toLowerCase());
    } else {
        this.hash = "00000000000000000000000000000000";
    }
  }

  Gravatar.prototype.url = function(fallback) {
      if (!fallback) {
          if (this.email) {
              fallback = "retro";
          } else {
              fallback = "blank";
          }
      }
      url = '//www.gravatar.com/avatar/' + this.hash + "?d=" + fallback;
      return url;
  };

  return Gravatar;

})();
