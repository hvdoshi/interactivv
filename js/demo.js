// Filter based on two factors
// Uses URI hash as trigger allowing direct links
// Losely based on: http://isotope.metafizzy.co/filtering.html#url-hash and a Lynda/LinkedinLearning series, lol

jQuery(document).ready(function($) {
  var $container = $(".grid");

  // Filter isotope
  $container.isotope({
    // options
    itemSelector: ".content",
    layoutMode: "masonry",
    // fade in from bottom
    visibleStyle: {
      opacity: 1,
      transform: "translateY(0)"
    },
    hiddenStyle: {
      opacity: 0,
      transform: "translateY(100px)"
    }
  });

  // layout Isotope again after all images have loaded
  $container.imagesLoaded(function() {
    $container.isotope("layout");
  });

  // Set up filters array with default values
  var filters = {};

  // When a button is pressed, run filterSelect
  $(".button-group button").on("click", filterSelect);

  // Set the URI hash to the current selected filters
  function filterSelect() {
    // Current hash value
    var hashFilter = getHashFilter();

    // Set filters to current values (important for first run)
    filters["type"] = hashFilter["type"];
    filters["medium"] = hashFilter["medium"];

    // data-filter attribute of clicked button
    var currentFilter = $(this).attr("data-filter");
    // Navigation group (subject or author) as object
    var $navGroup = $(this).parents(".button-group");
    // data-filter-group key for the current nav group
    var filterGroup = $navGroup.attr("data-filter-group");

    // If the current data-filter attribute matches the current filter,
    if (
      currentFilter == hashFilter["type"] ||
      currentFilter == hashFilter["medium"]
    ) {
      // Reset group filter as the user has unselected the button
      filters[filterGroup] = "";
    } else {
      // Set data-filter of current button as value with filterGroup as key
      filters[filterGroup] = $(this).attr("data-filter");
    }

    // Create new hash
    var newHash =
      "type=" +
      encodeURIComponent(filters["type"]) +
      "&medium=" +
      encodeURIComponent(filters["medium"]);

    // Apply the new hash to the URI, triggering onHashchange()
    location.hash = newHash;
  } // filterSelect

  function onHashChange() {
    // Current hash value
    var hashFilter = getHashFilter();
    // Concatenate subject and author for Isotope filtering
    var theFilter = hashFilter["type"] + hashFilter["medium"];

    if (hashFilter) {
      // Repaint Isotope container with current filters and sorts
      $container.isotope({
        filter: decodeURIComponent(theFilter)
      });

      // Toggle checked status of filter buttons
      $(".button-group")
        .find(".is-checked")
        .removeClass("is-checked");
      $(".button-group")
        .find(
          "[data-filter='" +
            hashFilter["type"] +
            "'],[data-filter='" +
            hashFilter["medium"] +
            "']"
        )
        .addClass("is-checked");
    }
  } // onHashchange

  function getHashFilter() {
    // Get filters (matches)
    var type = location.hash.match(/type=([^&]+)/i);
    var medium = location.hash.match(/medium=([^&]+)/i);

    // Set up a hashFilter array
    var hashFilter = {};
    // Populate array with matches using ternary logic
    hashFilter["type"] = type ? type[1] : ".all-types";
    hashFilter["medium"] = medium ? medium[1] : ".all-media";

    return hashFilter;
  } // getHashFilter

  // When the hash changes, run onHashchange
  window.onhashchange = onHashChange;

  // When the page loads for the first time, run onHashChange
  onHashChange();
});

//caption display code
$.featherlight.prototype.afterContent = function() {
  var caption = this.$currentTarget.find("img").attr("title");
  this.$instance.find(".d-caption").remove();
  $('<div class="d-caption">')
    .text(caption)
    .appendTo(this.$instance.find(".featherlight-content"));
};