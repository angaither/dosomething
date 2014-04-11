define(["jquery", "unveil", "finder/Campaign"], function($, unveil, Campaign) {
  "use strict";

  /**
   * ResultsView manages search results from Finder
   * @type {Object}
   */
  var ResultsView = {
    // The div where the results go
    $div: null,

    // The div that is shown if no filters are selected
    $blankSlateDiv: null,

    // How many slots are currently used. Full-height = 2, half-height = 1
    slots: 0,

    // How many slots are we allowing
    maxSlots: 8,

    // Currently unused. For tracking what page we're on
    start: 0,

    /**
     * Construct the cloneables and set the parent div where the results go
     * @param  {jQuery} $div The div where the results will live
     */
    init: function ($div, $blankSlateDiv) {
      ResultsView.$div = $div;
      ResultsView.$div.hide();

      ResultsView.$blankSlateDiv = $blankSlateDiv;

      // Lazy-load in images
      ResultsView.$blankSlateDiv.find("img").unveil(200, function() {
        $(this).load(function() {
          this.style.opacity = 1;
        });
      });
    },

    /**
     * Shows the blank slate div (initial state).
     */
    showBlankSlate: function() {
      ResultsView.$div.hide();
      ResultsView.$blankSlateDiv.show();
    },

    /**
     * Loop through the results and convert them to Campaign objects
     * @param  {Object} data The raw data from the query
     */
    parseResults: function (data) {
      // Remove the old results
      ResultsView.clear();

      // Loopy loop! (Like me after drinking coffeeeee)
      for (var i in data.response.docs) {
        ResultsView.add(new Campaign(data.response.docs[i]));
      }

      // Hey! We're done loading! I guess we can let the users know we're done.
      ResultsView.loading(false);
    },

    /**
     * Toggle the loading indicator for the results div
     * @param  {boolean} setTo Should I stay or should I go? If I go there will be trouble...or clicking.
     */
    loading: function (setTo) {
      // Allow the function to be called without a parameter, since X.loading() would seem
      // to be a logical call.
      if (setTo === undefined) {
        setTo = true;
      }

      // If we're loading, add a class to the results div. Otherwise, remove it.
      ResultsView.$div.append("<div class='spinner'></div>");
      ResultsView.$div.toggleClass("loading", setTo);
    },

    /**
     * Have we run the init method?
     */
    checkInit: function () {
      if (ResultsView.$div === null) {
        // Nope. I'm gonna vomit...
        throw "Error: ResultsView is not initialized.";
      }

      // Yup.
    },

    /**
     * Remove the current results and reboot this object.
     */
    clear: function () {
      ResultsView.checkInit();
      ResultsView.$div.empty();

      ResultsView.$div.show();
      ResultsView.$blankSlateDiv.hide();

      ResultsView.slots = 0;
      ResultsView.start = 0;
    },

    /**
     * Add a campaign to the results
     * @param {Campaign} campaign The campaign to add
     */
    add: function (campaign) {
      // Make sure we've initialized ourself
      ResultsView.checkInit();

      // If we're full, screw it.
      if (ResultsView.slots === ResultsView.maxSlots) {
        return;
      }

      // At some point this may be useful for paging.
      //   ResultsView.start++;

      // Render campaign object and preload image
      ResultsView.slots += 1;
      ResultsView.$div.append(campaign.render());

      // Lazy-load in images
      ResultsView.$div.find("img").unveil(200, function() {
        $(this).load(function() {
          this.style.opacity = 1;
        });
      });
    }
  };

  return ResultsView;
});