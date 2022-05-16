'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchOnlineTracker = void 0;
var axios_1 = require("axios");
var EventEmitter = require("events");
/**
 * Twitch Online Tracker
 *
 * @class TwitchOnlineTracker
 */
var TwitchOnlineTracker = /** @class */ (function (_super) {
    __extends(TwitchOnlineTracker, _super);
    /**
     *Creates an instance of TwitchOnlineTracker.
     * @param {TwitchOnlineTrackerOptions} options Options to pass
     * @memberof TwitchOnlineTracker
     */
    function TwitchOnlineTracker(options) {
        var _this = _super.call(this) || this;
        _this.tracked = new Set();
        _this._cachedStreamData = [];
        _this._cachedClipData = [];
        _this.options = options;
        _this._start = new Date();
        if (_this.options.client_id === undefined || typeof _this.options.client_id !== 'string') {
            throw new Error('`client_id` must be set and a string for TwitchOnlineTracker to work.');
        }
        if (_this.options.debug === undefined) {
            _this.options.debug = false;
        }
        if (_this.options.pollInterval === undefined) {
            _this.options.pollInterval = 30;
        }
        if (_this.options.track === undefined) {
        }
        else {
            _this.track(_this.options.track);
        }
        if (_this.options.start) {
            _this.start();
        }
        return _this;
    }
    /**
     * Log something to console.
     *
     * @param {*} rest
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.log = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        if (this.options.debug)
            console.log.apply(console, __spreadArray(['[twitchonlinetracker]'], rest, false));
    };
    /**
     * Make a request on the Twitch Helix API. Used internally but can be used for something custom.
     *
     * @param {string} endpoint The endpoint, plus parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.api = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var twitchApiBase, response, rv, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        twitchApiBase = 'https://api.twitch.tv/helix/';
                        this.log("making a request: ".concat(twitchApiBase).concat(endpoint));
                        return [4 /*yield*/, (0, axios_1.default)(twitchApiBase + endpoint, {
                                headers: {
                                    'Client-ID': this.options.client_id,
                                    'Authorization': "Bearer ".concat(this.bearer)
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        rv = {};
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [2 /*return*/, rv];
                    case 2:
                        err_1 = _a.sent();
                        throw new Error(err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a /users Twitch API request.
     *
     * Either `id` or `login` must be used.
     *
     * @param {UsersApiEndpointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.users = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var paramString_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!params.id && !params.login) {
                            throw new Error("Need login or id for Users endpoint.");
                        }
                        paramString_1 = '';
                        if (params.id) {
                            params.id.forEach(function (id, idx) {
                                paramString_1 += "id=".concat(id);
                                if (idx < params.id.length)
                                    paramString_1 += '&';
                            });
                        }
                        if (params.id && params.login)
                            paramString_1 += '&';
                        if (params.login) {
                            params.login.forEach(function (login, idx) {
                                paramString_1 += "login=".concat(login, "&");
                            });
                        }
                        paramString_1 = paramString_1.slice(0, -1);
                        return [4 /*yield*/, this.api("users?".concat(paramString_1))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a /streams API request.
     *
     * @param {StreamsApiEndPointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.streams = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var paramString, param, join, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        paramString = '';
                        for (param in params) {
                            if (Array.isArray(params[param])) {
                                join = "&".concat(param, "=");
                                paramString += "".concat(param, "=").concat(params[param].join(join));
                                paramString.slice(0, -(join.length));
                            }
                        }
                        return [4 /*yield*/, this.api("streams?".concat(paramString))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a /streams API request.
     *
     * @param {ClipsApiEndPointOptions} params The API parameters.
     * @returns The response JSON data, unaltered from Twitch.
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.clips = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var paramString, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        paramString = '';
                        paramString = Object.keys(params).map(function (e) {
                            if (Array.isArray(params[e])) {
                                return params[e].map(function (i) { return "".concat(e, "=").concat(i); });
                            }
                            else {
                                return "".concat(e, "=").concat(params[e]);
                            }
                        }).join("&");
                        return [4 /*yield*/, this.api("clips?".concat(paramString))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Begin tracking a stream
     *
     * @param {string[]} loginNames An array of login names of streamers
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.track = function (loginNames) {
        var _this = this;
        this.log("tracking ".concat(loginNames.join(', ')));
        loginNames.forEach(function (login) {
            _this.tracked.add(login.toLowerCase());
        });
    };
    /**
     * Stop tracking a stream
     *
     * @param {string[]} loginNames An array of login names of streamers
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.untrack = function (loginNames) {
        var _this = this;
        this.log("untracking ".concat(loginNames.join(', ')));
        loginNames.forEach(function (login) {
            _this.tracked.delete(login.toLowerCase());
        });
    };
    /**
     * Start making requests.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.start = function () {
        var _this = this;
        this.log("starting to poll at ".concat(this.options.pollInterval, "s intervals"));
        this.getTwitchBearerToken(this.options.client_id, this.options.client_secret).then(function (res) {
            _this.bearer = res;
            _this._loopIntervalId = setInterval(function () {
                _this._loop();
            }, _this.options.pollInterval * 1000);
            return _this;
        });
    };
    /**
     * Get a Twitch Auth Bearer for App-Auth
     *
     * @param {string} clientId Your App-Client-Id
     * @param {string} clientSecrect Your App-Client-Secret
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.getTwitchBearerToken = function (clientId, clientSecrect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.log("getting a Twitch bearer token");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        axios_1.default.post('https://id.twitch.tv/oauth2/token', null, { params: {
                                "client_id": clientId,
                                "client_secret": clientSecrect,
                                "grant_type": "client_credentials"
                            } })
                            .then(function (res) {
                            if (res.status === 200) {
                                _this.log("got a bearer token");
                                resolve(res.data.access_token);
                            }
                            else {
                                _this.log("Error while getting a bearer token");
                                reject(res.status);
                            }
                        })
                            .catch(function (error) {
                            _this.emit('error', error);
                            reject(error);
                        });
                    })];
            });
        });
    };
    /**
     * Stops polling.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype.stop = function () {
        this.log('forcefully stopping polling');
        clearInterval(this._loopIntervalId);
        this._loopIntervalId = 0;
    };
    /**
     * The internal loop.
     *
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._loop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _streamDataJson, broadcaster_ids, _clipDataJson, streamRequestData_1, clipRequestData_1, started, stopped, diff, e_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.tracked.size) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.streams({ user_login: Array.from(this.tracked) })];
                    case 1:
                        _streamDataJson = _a.sent();
                        return [4 /*yield*/, this.users({ login: Array.from(this.tracked) })];
                    case 2:
                        broadcaster_ids = (_a.sent()).data.map(function (e) { return e.id; });
                        return [4 /*yield*/, this.clips({ broadcaster_id: broadcaster_ids, started_at: this._start.toISOString() })];
                    case 3:
                        _clipDataJson = _a.sent();
                        streamRequestData_1 = _streamDataJson;
                        clipRequestData_1 = _clipDataJson;
                        started = streamRequestData_1.data
                            .filter(function (current) {
                            return _this._cachedStreamData.filter(function (other) {
                                return other.user_name === current.user_name;
                            }).length == 0;
                        });
                        stopped = this._cachedStreamData
                            .filter(function (current) {
                            return streamRequestData_1.data.filter(function (other) {
                                return other.user_name === current.user_name;
                            }).length == 0;
                        });
                        if (started.length) {
                            this.log("".concat(started.length, " new streams"));
                            started.forEach(function (startedStream) { return _this._announce(startedStream); });
                        }
                        if (stopped.length) {
                            this.log("".concat(stopped.length, " stopped streams"));
                            stopped.forEach(function (stoppedStream) { return _this._offline(stoppedStream); });
                        }
                        if (clipRequestData_1.data.length > 0 && this.options.clips) {
                            diff = clipRequestData_1.data.length - this._cachedClipData.length;
                            if (diff > 0) {
                                this.log("".concat(diff, " new clips found"));
                                clipRequestData_1.data.forEach(function (clip) {
                                    if (!_this._cachedClipData.some(function (e) { return e.id === clip.id; })) {
                                        _this._newClip(clip);
                                        _this._cachedClipData = clipRequestData_1.data;
                                    }
                                });
                            }
                            else {
                                this._cachedClipData = clipRequestData_1.data;
                            }
                        }
                        this._cachedStreamData = streamRequestData_1.data;
                        return [2 /*return*/, started];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_4 = _a.sent();
                        // unauthorized
                        if (e_4.message.includes('401')) {
                            this.log("unauthorized... trying to get a new bearer token");
                            this.getTwitchBearerToken(this.options.client_id, this.options.client_secret)
                                .then(function (res) {
                                // refreshing the token
                                _this.log("got a bearer token");
                                _this.bearer = res;
                            })
                                .catch(function (e) {
                                _this.log(e);
                                _this.emit('error', Error('Twitch returned with an Unauthorized response. Your client_id probably wrong. Stopping.'));
                                _this.stop();
                            });
                        }
                        else {
                            this.emit('error', e_4);
                            this.stop();
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Emit an event when a stream starts
     * @fires TwitchOnlineTracker#started
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._announce = function (streamData) {
        /**
         * @event TwitchOnlineTracker#live
         * @param {StreamData} The stream that has started
         */
        this.emit('live', streamData);
    };
    /**
     * Emit an event when a stream stops
     * @fires TwitchOnlineTracker#offline
     * @param {string} channelName the channel name of the stream that has stopped
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._offline = function (streamData) {
        /**
         * @event TwitchOnlineTracker#offline
         * @param {string} The stream that has stopped
         */
        this.emit('offline', streamData);
    };
    /**
     * Emit an event when a stream stops
     * @fires TwitchOnlineTracker#newClip
     * @param {string} channelName the channel name of the stream that has stopped
     * @memberof TwitchOnlineTracker
     */
    TwitchOnlineTracker.prototype._newClip = function (clipData) {
        /**
         * @event TwitchOnlineTracker#newClip
         * @param {string} The stream has a new clip
         */
        this.emit('clip', clipData);
    };
    return TwitchOnlineTracker;
}(EventEmitter));
exports.TwitchOnlineTracker = TwitchOnlineTracker;
