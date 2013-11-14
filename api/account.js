(function() {
  module.exports = function(Reddit) {
    Reddit.prototype.clearSessions = function(modhash, password, url, callback) {
      var options, params,
        _this = this;
      options = {
        curpass: password,
        dest: url,
        uh: modhash
      };
      params = Object.keys(options);
      return this._post('/api/clear_sessions', options, params, function(error, res) {
        if (error != null) {
          return callback(error);
        }
        return callback();
      });
    };
    Reddit.prototype.deleteUser = function(username, password, modhash, callback) {
      var options, params,
        _this = this;
      options = {
        confirm: true,
        passwd: password,
        uh: modhash,
        user: username
      };
      params = Object.keys(options);
      return this._post('/api/delete_user', options, params, function(error, res) {
        if (error != null) {
          return callback(error);
        }
        return callback();
      });
    };
    Reddit.prototype.setCookie = function(cookie) {
      return this._agent.jar.setCookies(["reddit_session=" + cookie + "; Domain=reddit.com; Path=/; HttpOnly"]);
    };
    Reddit.prototype.login = function(username, password, callback) {
      var options, params,
        _this = this;
      params = ['user', 'passwd'];
      options = {
        api_type: 'json',
        user: username,
        passwd: password,
        rem: false
      };
      this._post('/api/login', options, params, function(error, res) {
        var data, _ref, _ref1;
        return data = (_ref = res.body) != null ? (_ref1 = _ref.json) != null ? _ref1.data : void 0 : void 0;
      });
      this._agent.jar.setCookies(["reddit_session=" + (typeof data !== "undefined" && data !== null ? data.cookie : void 0) + "; Domain=reddit.com; Path=/; HttpOnly"]);
      if (typeof error !== "undefined" && error !== null) {
        return callback(error);
      }
      return callback(null, typeof data !== "undefined" && data !== null ? data.modhash : void 0, typeof data !== "undefined" && data !== null ? data.cookie : void 0);
    };
    Reddit.prototype.oAuthAuthorize = function(clientId, clientSecret, state, code, scope, callback) {
      var details, options,
        _this = this;
      if (scope == null) {
        scope = ['identity'];
      }
      if (typeof scope === 'function') {
        callback = scope;
        scope = ['identity'];
      }
      options = {
        state: state,
        scope: scope.join(','),
        client_id: 'tMsPeTkhps5_tg',
        redirect_uri: 'http://reddichat.com/reddit/oauth',
        code: code,
        grant_type: 'authorization_code'
      };
      details = {
        name: "reddit OAuth authorization",
        options: options
      };
      return this._enqueue(details, function(finished) {
        return _this._agent.post("https://" + clientId + ":" + clientSecret + "@ssl.reddit.com/api/v1/access_token").set('Content-Type', 'application/x-www-form-urlencoded').set('User-Agent', _this._userAgent).send(options).end(function(res) {
          if (res.status === 200) {
            callback(null, res.body);
          } else {
            callback(new Error(JSON.stringify(details)));
          }
          return finished();
        });
      });
    };
    Reddit.prototype.oAuthMe = function(token, callback) {
      var details,
        _this = this;
      details = {
        name: "reddit OAuth Me",
        options: {
          token: token
        }
      };
      return this._enqueue(details, function(finished) {
        return _this._agent.get('https://oauth.reddit.com/api/v1/me').set('Authorization', "bearer " + token).set('User-Agent', _this._userAgent).end(function(res) {
          if (res.status === 200) {
            callback(null, res.body);
          } else {
            callback(new Error(JSON.stringify(details)));
          }
          return finished();
        });
      });
    };
    Reddit.prototype.me = function(callback) {
      return this._get('/api/me.json', function(error, res) {
        if (error != null) {
          return callback(error);
        }
        return callback(null, res.body.data);
      });
    };
    return Reddit.prototype.update = function(password, email, newPassword, modhash, callback) {
      var options, params;
      options = {
        curpass: password,
        email: email,
        newpass: newPassword,
        uh: modhash,
        verify: true,
        verpass: newPassword
      };
      params = Object.keys(options);
      return this._post('/api/update', options, params, function(error, res) {
        if (error != null) {
          return callback(error);
        }
        return callback();
      });
    };
  };

}).call(this);
