// Fills in live App Store ratings for every element with a data-app-store-id.
// Elements stay hidden if the lookup fails or an app has no ratings yet.
(function () {
  var els = document.querySelectorAll("[data-app-store-id]");
  if (!els.length || !window.fetch) return;

  var ids = Array.prototype.map.call(els, function (el) { return el.dataset.appStoreId; });
  var url = "https://itunes.apple.com/lookup?country=us&id=" + ids.filter(function (id, i) { return ids.indexOf(id) === i; }).join(",");

  fetch(url)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (data) {
      var byId = {};
      data.results.forEach(function (app) { byId[app.trackId] = app; });

      els.forEach(function (el) {
        var app = byId[el.dataset.appStoreId];
        if (!app || !app.userRatingCount) return;

        var score = Math.round(app.averageUserRating * 10) / 10;
        var count = app.userRatingCount;
        var label = count === 1 ? "rating" : "ratings";

        el.innerHTML =
          '<span class="stars" aria-hidden="true"><span style="width:' + (app.averageUserRating / 5 * 100) + '%"></span></span>' +
          '<strong>' + score.toFixed(1) + '</strong>' +
          '<span class="count">' + count + ' ' + label + '</span>';
        el.setAttribute("aria-label", "Rated " + score.toFixed(1) + " out of 5 from " + count + " " + label + " on the App Store");
        el.hidden = false;
      });
    })
    .catch(function () {});
})();
