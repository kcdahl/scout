$(function() {

  // login link should always point to redirect back
  $("a.login, a.logout").attr("href", $("a.login, a.logout").attr("href") + "?redirect=" + Utils.currentPath());

  $("#content").on("click", "a.untruncate", function() {
    var to_hide = $(this).parent(".truncated");
    var tag = to_hide.data("tag");
    $(".untruncated[data-tag=" + tag + "]").show();
    to_hide.hide();
    return false;
  });

  $("#content").on("click", 'a[data-pjax]', function() {
    Utils.pjax($(this).attr("href"), $(this).data("pjax"));
    return false;
  });

  $("form#search_form").submit(function() {
    var query = $(this).find("input.query").val();
    if (query) query = $.trim(query);
    if (!query) return false;

    // if we are on the search page itself, this search box integrates with the filters
    if (typeof(goToSearch) != "undefined") {
      $(".filters input.query").val(query);
      goToSearch();
    } else {
      window.location = "/search/all/" + encodeURIComponent(query);
    }
    return false;
  });

});

var Utils = {
    log: function(msg) {
        console.log(msg);
    },

    pjax: function(href, container) {
      if (!container)
        container = "#center";

      $.pjax({
          url: href,
          container: container,
          error: function() {
            Utils.log("Error asking for: " + href);
          }, 
          timeout: 5000
      });
    },

    // returns a path string suitable for redirects back to this location
    currentPath: function(options) {
      var fullDomain = window.location.protocol + "//" + window.location.host;
      var queryString = window.location.href.replace(fullDomain + window.location.pathname, "");
      
      if (options) {
        if (queryString)
          queryString += "&" + $.param(options);
        else
          queryString = "?" + $.param(options);
      }

      return escape(window.location.pathname + queryString);
    }
};