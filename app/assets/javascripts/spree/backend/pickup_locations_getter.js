function PickupLocationGetter(path) {
  this.path = path
  this.stateSelect = $('#state .select2');
  this.countrySelect = $('#country-select .select2');
}

PickupLocationGetter.prototype.init = function() {
  this.bindEvent();
};

PickupLocationGetter.prototype.bindEvent = function() {
  var _this = this;
  this.bindFetchStates();
  this.stateSelect.on('change', function(event) {
    var s_id = _this.stateSelect.find(':selected').val();
    var c_id = _this.countrySelect.find(':selected').val();
    path = _this.buildPath(s_id, c_id);
    $.get(path, function(data, status) {
      _this.initializeModalBuilder(data);
      _this.initializeMap(data);
    });
  });
};

PickupLocationGetter.prototype.bindFetchStates = function() {
  var _this = this;
  this.countrySelect.on('change', _this.fetchStates.bind(_this));
};

PickupLocationGetter.prototype.fetchStates = function() {
  var country_id = this.countrySelect.val(), _this= this;
  var state_input = $("span#state input.state_name");
  $.get(Spree.routes.states_search + "?country_id=" + country_id, function (data) {
    var states = data.states;
    if (states.length > 0) {
      _this.stateSelect.html("");
      var states_with_blank = [{
        name: "",
        id: ""
      }].concat(states);
      $.each(states_with_blank, function (pos, state) {
        var opt = $(document.createElement("option"))
          .prop("value", state.id)
          .html(state.name);
        _this.stateSelect.append(opt);
      });
      _this.stateSelect.prop("disabled", false).show();
      // state_select.select2();
      state_input.hide().prop("disabled", true);

    } else {
      // state_input.prop("disabled", false).show();
      _this.stateSelect.hide();
    }
  });
}

PickupLocationGetter.prototype.buildPath = function(s_id, c_id) {
  path = window.location.origin + this.path + '?s_id=' + s_id + '&c_id=' + c_id
  return path;
};

PickupLocationGetter.prototype.initializeMap = function(data) {
  var mI = new MapInitializer(this.stateSelect.find(':selected').text() + ', ' + this.countrySelect.find(':selected').text(), data);
  mI.init();
};

PickupLocationGetter.prototype.initializeModalBuilder = function(data) {
  var pickupListBuilder = new PickupListBuilder(data);
  pickupListBuilder.init();
};
