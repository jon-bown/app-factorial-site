// Fills in live App Store ratings for every element with a data-app-store-id.
// Elements stay hidden if the lookup fails or an app has no ratings yet.
// Use class "rating rating-large" for the App Store style block on app pages.
(function () {
  var els = document.querySelectorAll("[data-app-store-id]");
  if (!els.length || !window.fetch) return;

  var STAR = "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z";
  var uid = 0;

  // Five stars, each filled 0–100% so a 4.7 shows four full stars and one 70% star.
  function stars(rating) {
    var svg = "";
    for (var i = 0; i < 5; i++) {
      var fill = Math.max(0, Math.min(1, rating - i));
      var id = "star-fill-" + uid++;
      var pct = Math.round(fill * 100) + "%";
      svg +=
        '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false">' +
        '<defs><linearGradient id="' + id + '">' +
        '<stop offset="' + pct + '" stop-color="#ffc83d"/>' +
        '<stop offset="' + pct + '" stop-color="#c9ced6"/>' +
        "</linearGradient></defs>" +
        '<path d="' + STAR + '" fill="url(#' + id + ')"/></svg>';
    }
    return '<span class="stars" aria-hidden="true">' + svg + "</span>";
  }

  var ids = Array.prototype.map.call(els, function (el) { return el.dataset.appStoreId; });
  var unique = ids.filter(function (id, i) { return ids.indexOf(id) === i; });
  var url = "https://itunes.apple.com/lookup?country=us&id=" + unique.join(",");

  fetch(url)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (data) {
      var byId = {};
      data.results.forEach(function (app) { byId[app.trackId] = app; });

      els.forEach(function (el) {
        var app = byId[el.dataset.appStoreId];
        if (!app || !app.userRatingCount) return;

        var score = (Math.round(app.averageUserRating * 10) / 10).toFixed(1);
        var count = app.userRatingCount.toLocaleString("en-US");
        var label = app.userRatingCount === 1 ? "Rating" : "Ratings";

        if (el.classList.contains("rating-large")) {
          // App Store style: big score with "out of 5", stars and count beside it.
          el.innerHTML =
            '<span class="score"><span class="value">' + score + '</span> <span class="out-of">out of 5</span></span> ' +
            '<span class="detail">' + stars(app.averageUserRating) +
            ' <span class="count">' + count + " " + label + "</span></span>";
        } else {
          // Compact: stars and score on one line, count underneath.
          el.innerHTML =
            '<span class="line">' + stars(app.averageUserRating) +
            ' <span class="value">' + score + "</span></span>" +
            ' <span class="count">' + count + " " + label + "</span>";
        }

        el.setAttribute("role", "img");
        el.setAttribute("aria-label", score + " out of 5 stars, " + count + " " + label.toLowerCase() + " on the App Store");
        el.hidden = false;
      });
    })
    .catch(function () {});
})();
