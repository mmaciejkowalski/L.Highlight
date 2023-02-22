/**
 * L.Higlight Leaflet plugin (https://github.com/mmaciejkowalski/L.Highlight)
<<<<<<< Updated upstream
 * version: 1.0.1
=======
 * version: 1.1.0
>>>>>>> Stashed changes
 */

L.Layer.Highlight = L.Layer.extend({
  _data: undefined,
  _initOpt: {},
  _otherOpt: undefined,
  _searchOpt: undefined,
  _layers: [],

  onAdd: function (_map) {
    if (this._data) {
      let layer = L.geoJSON(this._data, this._otherOpt);

      if (this._otherOpt.eventHandlers !== undefined) {
        Object.keys(this._otherOpt.eventHandlers).forEach((e) => {
          layer.on(e, this._otherOpt.eventHandlers[e]);
        })
      }

      this._layers.push(layer.addTo(_map));
    } else {
      setTimeout(function () {
        this.onAdd(_map);
      }.bind(this), 1000);
    }
  },

  initialize: function (_opt) {
    if (_opt && _opt.email) {
      this._initOpt.email = _opt.email;
    }
    if (_opt && _opt.nominatimAPI) {
      this._initOpt.nominatimAPI = _opt.nominatimAPI;
    }
  },

  do: function (_searchOpt, _otherOpt = {}) {
    this._handleOpts(_searchOpt, _otherOpt);

    this._getHighlightData({ street: _searchOpt.street, city: _searchOpt.city, q: _searchOpt.q });

    return this;
  },

  onRemove: function (x) {
    this._layers.forEach(l => l.removeFrom(this._map));
  },

  _getHighlightData: function (_opt) {
    this._getBatch(_opt, this).then(function (_result) {
      this._getBatchHandleResult(_result, _opt);
    }.bind(this), function (error) {
      console.error(error);
    }.bind(this)
    );
  },

  _getBatchHandleResult: function (_result, _opt) {
    let i = 0;
    let queue = [];


    if (this._searchOpt.limit > 1) {
      while (this._filter(_result).features.length % this._searchOpt.limit === 0) {
        _opt.exclude = _result.features.map(e => e.properties.place_id);
        queue.push(this._getBatch(_opt, this));
        i++;
        if (i > 10) { break; }
      }
    }


    if (queue.length > 0) {
      Promise.all(queue).then(function (resolvedQueue) {
        resolvedQueue.forEach(function (r) {
          _result.features = _result.features.concat(r.features);
        });
      });
    }

    this._cleanup(_result, _opt);
  },

  _getBatch: function (_opt, that) {

    return new Promise(function (resolve, reject) {
      let result = undefined;
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onload = function () {
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else {
          reject({
            status: xmlhttp.status,
            statusText: xmlhttp.statusText
          });
        }

      }.bind(this);

      xmlhttp.open("GET", (that._initOpt.nominatimAPI ? that._initOpt.nominatimAPI : "https://nominatim.openstreetmap.org") + "/search?" + that._encodeQueryData(_opt), true);
      xmlhttp.setRequestHeader('Accept', 'application/json');
      xmlhttp.send(null);
    });
  }.bind(this),

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

    this._data = _data;
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
      city: _opt.city,
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
