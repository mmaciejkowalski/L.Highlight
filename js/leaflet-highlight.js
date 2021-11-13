/**
 * L.Higlight Leaflet plugin (https://github.com/mmaciejkowalski/L.Highlight)
 * version: 1.0.0
 */

L.Layer.Highlight = L.Layer.extend({
  _data: undefined,
  _initOpt: {},
  _otherOpt: undefined,
  _searchOpt: undefined,
  _layers: [],

  onAdd: function (_map) {
    let layer = L.geoJSON(this._data, this._otherOpt);

    if (this._otherOpt.eventHandlers !== undefined) {
      Object.keys(this._otherOpt.eventHandlers).forEach((e) => {
        layer.on(e, this._otherOpt.eventHandlers[e]);
      })
    }

    this._layers.push(layer.addTo(_map));
  },

  initialize: function (_opt) {
    if (_opt && _opt.email) {
      this._initOpt.email = _opt.email;
    }
  },

  do: function (_searchOpt, _otherOpt = {}) {
    this._handleOpts(_searchOpt, _otherOpt);

    this._data = this._getHighlightData({ street: _searchOpt.street, city: _searchOpt.city, q: _searchOpt.q });

    return this;
  },

  onRemove: function (x) {
    this._layers.forEach(l => l.removeFrom(this._map));
  },

  _getHighlightData: function (_opt) {
    let result = this._getBatch(_opt);
    let i = 0;

    if (this._searchOpt.limit > 1) {
      while (this._filter(result).features.length % this._searchOpt.limit === 0) {
        _opt.exclude = result.features.map(e => e.properties.place_id);
        result.features = result.features.concat(this._getBatch(_opt).features);

        i++;
        if (i > 10) { break; }
      }
    }

    return this._cleanup(result, _opt);
  },

  _getBatch: function (_opt) {
    let result = undefined;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://nominatim.openstreetmap.org/search?" + this._encodeQueryData(_opt), false);
    xmlhttp.setRequestHeader('Accept', 'application/json');
    xmlhttp.send();

    if (xmlhttp.status == 200) {
      result = JSON.parse(xmlhttp.responseText);
    } else {
      console.error(xmlhttp);
    }

    return result;
  },

  _handleOpts: function (_searchOpt, _otherOpt) {
    if (!_searchOpt || (!_searchOpt.q && !_searchOpt.city && !_searchOpt.street)) {
      throw Error('Empty search in L.Highlight constructor.');
    }

    if (_searchOpt.filter == null || _searchOpt.filter == undefined) {
      _searchOpt.filter = 'LineString';
    }

    if (_searchOpt.limit == null || _searchOpt.limit == undefined) {
      _searchOpt.limit = 50;
    }

    if (!_otherOpt.style) {
      _otherOpt.style = function (x) {
        return { color: '#0040ff', opacity: 1 };
      };
    }

    this._searchOpt = _searchOpt;
    this._otherOpt = _otherOpt;
  },

  _cleanup: function (_data) {
    if (this._searchOpt.filter) {
      _data.features = _data.features.filter(e => e.geometry.type == this._searchOpt.filter);
    }

    _data = this._filter(_data);

    return _data;
  },

  _filter: function (_data) {
    if (this._searchOpt.city) {
      _data.features = _data.features.filter(e => (e.properties.address.city == this._searchOpt.city)
        || (e.properties.address.town == this._searchOpt.city)
        || (e.properties.address.county == this._searchOpt.city));
    }

    if (this._searchOpt.street) {
      _data.features = _data.features.filter(e => e.properties.address.road == this._searchOpt.street);
    }

    return _data;
  },

  _encodeQueryData: function (_opt) {
    let result = [];
    let params = {
      q: _opt.q ? _opt.q : '',
      street: _opt.q ? '' : _opt.street,
      city: _opt.q ? '' : _opt.city,
      exclude_place_ids: _opt.exclude ? _opt.exclude.join(',') : '',
      format: 'geojson',
      polygon_geojson: 1,
      dedupe: 0,
      limit: this._searchOpt.limit,
      addressdetails: 1,
      polygon_geojson: 1,
      email: this._initOpt.email ? this._initOpt.email : ''
    };

    for (let p in params) {
      result.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
    }

    return result.join('&');
  }
});
