'use strict'

import * as dotenv from 'dotenv'
import axios from 'axios'
import * as EventEmitter from 'events'

import {
  UserData,
  UserRequestData,
  StreamData,
  ClipData,
  StreamRequestData,
  ClipRequestData,
  StreamsApiEndPointOptions,
  ClipsApiEndPointOptions,
  TwitchOnlineTrackerOptions,
  UsersApiEndpointOptions
} from './interfaces'

/**
 * Twitch Online Tracker
 *
 * @class TwitchOnlineTracker
 */
export class TwitchOnlineTracker extends EventEmitter {
  options: TwitchOnlineTrackerOptions

  tracked: Set<string>

  bearer: string

  _cachedStreamData: StreamData[]
  _cachedClipData: ClipData[]
  _loopIntervalId: any

  /**
   *Creates an instance of TwitchOnlineTracker.
   * @param {TwitchOnlineTrackerOptions} options Options to pass
   * @memberof TwitchOnlineTracker
   */
  constructor (options: TwitchOnlineTrackerOptions) {
    super()
    this.tracked = new Set()
    this._cachedStreamData = []
    this._cachedClipData = []
    this.options = options
    this._start = new Date();

    if (this.options.client_id === undefined || typeof this.options.client_id !== 'string') {
      throw new Error('`client_id` must be set and a string for TwitchOnlineTracker to work.')
    }

    if (this.options.debug === undefined) {
      this.options.debug = false
    }

    if (this.options.pollInterval === undefined) {
        this.options.pollInterval = 30;
    }

    if (this.options.track === undefined) {
    } else {
      this.track(this.options.track)
    }

    if (this.options.start) {
      this.start()
    }
  }

  /**
   * Log something to console.
   *
   * @param {*} rest
   * @memberof TwitchOnlineTracker
   */
  log (...rest) {
    if (this.options.debug) console.log('[twitchonlinetracker]', ...rest)
  }

  /**
   * Make a request on the Twitch Helix API. Used internally but can be used for something custom.
   *
   * @param {string} endpoint The endpoint, plus parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async api (endpoint: string) {
    try {
      const twitchApiBase: string = 'https://api.twitch.tv/helix/'
      this.log(`making a request: ${twitchApiBase}${endpoint}`)
      const response = await axios(twitchApiBase + endpoint, {
        headers: {
          'Client-ID': this.options.client_id,
          'Authorization': `Bearer ${this.bearer}`
        }
      })
      let rv = {}
      if (response.data) {
        return response.data
      }
      return rv
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Make a /users Twitch API request.
   *
   * Either `id` or `login` must be used.
   *
   * @param {UsersApiEndpointOptions} params The API parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async users (params: UsersApiEndpointOptions) {
    try {
      if (!params.id && !params.login) {
        throw new Error(`Need login or id for Users endpoint.`)
      }

      let paramString = ''
      if (params.id) {
        params.id.forEach((id, idx) => {
          paramString += `id=${id}`
          if (idx < params.id.length) paramString += '&'
        })
      }

      if (params.id && params.login) paramString += '&'

      if (params.login) {
        params.login.forEach((login, idx) => {
          paramString += `login=${login}&`
        })
      }
      paramString = paramString.slice(0, -1)

      return await this.api(`users?${paramString}`)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Make a /streams API request.
   *
   * @param {StreamsApiEndPointOptions} params The API parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async streams (params: StreamsApiEndPointOptions) {
    try {
      let paramString = ''

      for (let param in params) {
        if (Array.isArray(params[param])) {
          const join = `&${param}=`
          paramString += `${param}=${params[param].join(join)}`
          paramString.slice(0, -(join.length))
        }
      }

      return await this.api(`streams?${paramString}`)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Make a /streams API request.
   *
   * @param {ClipsApiEndPointOptions} params The API parameters.
   * @returns The response JSON data, unaltered from Twitch.
   * @memberof TwitchOnlineTracker
   */
  async clips (params: ClipsApiEndPointOptions) {
    try {
      let paramString = ''

      paramString = Object.keys(params).map((e) => {
        if (Array.isArray(params[e])) {
            return params[e].map((i) => `${e}=${i}`)
        } else {
          return `${e}=${params[e]}`;
        }
      }).join("&")

      return await this.api(`clips?${paramString}`)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Begin tracking a stream
   *
   * @param {string[]} loginNames An array of login names of streamers
   * @memberof TwitchOnlineTracker
   */
  track (loginNames: string[]) {
    this.log(`tracking ${loginNames.join(', ')}`)
    loginNames.forEach(login => {
      this.tracked.add(login.toLowerCase())
    })
  }

  /**
   * Stop tracking a stream
   *
   * @param {string[]} loginNames An array of login names of streamers
   * @memberof TwitchOnlineTracker
   */
  untrack (loginNames: string[]) {
    this.log(`untracking ${loginNames.join(', ')}`)
    loginNames.forEach(login => {
      this.tracked.delete(login.toLowerCase())
    })
  }

  /**
   * Start making requests.
   *
   * @memberof TwitchOnlineTracker
   */
   start () {
    this.log(`starting to poll at ${this.options.pollInterval}s intervals`)
    this.getTwitchBearerToken(this.options.client_id, this.options.client_secret).then(res => {
      this.bearer = res;
      this._loopIntervalId = setInterval(() => {
        this._loop()
      }, this.options.pollInterval * 1000)
      return this
    })
  }

  /**
   * Get a Twitch Auth Bearer for App-Auth
   *
   * @param {string} clientId Your App-Client-Id
   * @param {string} clientSecrect Your App-Client-Secret
   * @memberof TwitchOnlineTracker
   */
  async getTwitchBearerToken (clientId: string, clientSecrect: string) {
    this.log(`getting a Twitch bearer token`)
      return new Promise<string>((resolve, reject) => {
        axios.post('https://id.twitch.tv/oauth2/token', null, { params: {
            "client_id": clientId,
            "client_secret": clientSecrect,
            "grant_type": "client_credentials"
        }})
        .then(res => {
            if(res.status === 200) {
              this.log(`got a bearer token`)
              resolve(res.data.access_token);
            } else {
              this.log(`Error while getting a bearer token`)
              reject(res.status);
            }
        })
        .catch(error => {
          this.emit('error', error)
          reject(error);
        })
    });
  }

  /**
   * Stops polling.
   *
   * @memberof TwitchOnlineTracker
   */
  stop () {
    this.log('forcefully stopping polling')
    clearInterval(this._loopIntervalId)
    this._loopIntervalId = 0
  }

  /**
   * The internal loop.
   *
   * @memberof TwitchOnlineTracker
   */
  async _loop () {
    try {
      if (this.tracked.size) {
        const _streamDataJson = await this.streams({user_login: Array.from(this.tracked)})
        let broadcaster_ids = (await this.users({login: Array.from(this.tracked)})).data.map((e) => e.id);
        const _clipDataJson = await this.clips({broadcaster_id: broadcaster_ids, started_at: this._start.toISOString()})
        const streamRequestData: StreamRequestData = _streamDataJson
        const clipRequestData: ClipRequestData = _clipDataJson

        const started = streamRequestData.data
          .filter((current) => {
              return this._cachedStreamData.filter((other) => {
                return other.user_name === current.user_name
              }).length == 0;
            })

        const stopped = this._cachedStreamData
          .filter((current) => {
              return streamRequestData.data.filter((other) => {
                return other.user_name === current.user_name
              }).length == 0;
            })

        if (started.length) {
          this.log(`${started.length} new streams`);
          started.forEach(startedStream => this._announce(startedStream));
        }

        if (stopped.length) {
          this.log(`${stopped.length} stopped streams`);
          stopped.forEach(stoppedStream => this._offline(stoppedStream));
        }

        if (clipRequestData.data.length > 0 && this.options.clips) {
          let diff = clipRequestData.data.length - this._cachedClipData.length;
          if (diff > 0) {
            this.log(`${diff} new clips found`);
            clipRequestData.data.forEach(clip => {
              if (!this._cachedClipData.some((e) => e.id === clip.id)) {
                this._newClip(clip);
                this._cachedClipData = clipRequestData.data;
              }
            });
          } else {
            this._cachedClipData = clipRequestData.data;
          }
        }

        this._cachedStreamData = streamRequestData.data

        return started
      }
    } catch (e) {
      // unauthorized
      if (e.message.includes('401')) {
        this.log(`unauthorized... trying to get a new bearer token`)
        this.getTwitchBearerToken(this.options.client_id, this.options.client_secret)
        .then(res => {
          // refreshing the token
          this.log(`got a bearer token`)
          this.bearer = res
        })
        .catch(e => {
          this.log(e)
          this.emit('error', Error('Twitch returned with an Unauthorized response. Your client_id probably wrong. Stopping.'))
          this.stop()
        })
      } else {
        this.emit('error', e)
        this.stop()
      }
    }
  }

  /**
   * Emit an event when a stream starts
   * @fires TwitchOnlineTracker#started
   * @memberof TwitchOnlineTracker
   */
  _announce (streamData: StreamData) {
    /**
     * @event TwitchOnlineTracker#live
     * @param {StreamData} The stream that has started
     */
    this.emit('live', streamData)
  }

  /**
   * Emit an event when a stream stops
   * @fires TwitchOnlineTracker#offline
   * @param {string} channelName the channel name of the stream that has stopped
   * @memberof TwitchOnlineTracker
   */
  _offline (streamData: StreamData) {
    /**
     * @event TwitchOnlineTracker#offline
     * @param {string} The stream that has stopped
     */
    this.emit('offline', streamData)
  }

  /**
   * Emit an event when a stream stops
   * @fires TwitchOnlineTracker#newClip
   * @param {string} channelName the channel name of the stream that has stopped
   * @memberof TwitchOnlineTracker
   */
  _newClip (clipData: ClipData) {
    /**
     * @event TwitchOnlineTracker#newClip
     * @param {string} The stream has a new clip
     */
    this.emit('clip', clipData)
  }
}
