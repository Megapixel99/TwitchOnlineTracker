/**
 * Maps to a user JSON from /users endpoint
 *
 * @export
 * @interface UserData
 */
export interface UserData {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email: string
}

/**
 * Maps to an api request from /users endpoint
 *
 * @export
 * @interface UserRequestData
 */
export interface UserRequestData {
  data: UserData[]
}

/**
 * Maps to a stream JSON from the /streams endpoint
 *
 * @export
 * @interface StreamData
 */
export interface StreamData {
  id: string,
  user_id: string,
  user_name: string,
  game_id: string,
  community_ids: string[],
  type: string,
  title: string,
  viewer_count: number,
  started_at: string,
  language: string,
  thumbnail_url: string
}

/**
 * Maps to a clip JSON from the /clips endpoint
 *
 * @export
 * @interface ClipData
 */
export interface ClipData {
  id: string,
  url: string,
  embed_url: string,
  broadcaster_id: string,
  broadcaster_name: string,
  creator_id: string,
  creator_name: string,
  video_id: string,
  game_id: string,
  language: string,
  title: string,
  view_count: number,
  created_at: string,
  thumbnail_url: string,
  duration: number
}

/**
 * Maps to an api request from /streams endpoint
 *
 * @export
 * @interface StreamRequestData
 */
export interface StreamRequestData {
  data: StreamData[]
}

/**
 * Maps to an api request from /clips endpoint
 *
 * @export
 * @interface StreamRequestData
 */
export interface ClipRequestData {
  data: ClipData[]
}

/**
 * Options for the TwitchOnlineTracker class
 *
 * @export
 * @interface TwitchOnlineTrackerOptions
 */
export interface TwitchOnlineTrackerOptions {
  client_id: string,
  client_secret: string,
  track?: string[],
  pollInterval?: number,
  debug?: boolean,
  start?: boolean,
  clips?: boolean
}

/**
 * Options for the /users api endpoint for Twitch
 *
 * @export
 * @interface UsersApiEndpointOptions
 */
export interface UsersApiEndpointOptions {
  id?: string[],
  login?: string[]
}

/**
 * Options for the /streams api endpoint for Twitch
 *
 * @export
 * @interface StreamsApiEndPointOptions
 */
export interface StreamsApiEndPointOptions {
  after?:  string,
  before?: string,
  community_id?: string[],
  first?:  number,
  game_id?:  string,
  language?: string[],
  user_id?:  string[],
  user_login?: string[]
}

/**
 * Options for the /clips api endpoint for Twitch
 *
 * @export
 * @interface StreamsApiEndPointOptions
 */
export interface ClipsApiEndPointOptions {
  broadcaster_id?: string,
  game_id?: string,
  started_at?: string,
  ended_at?: string,
  id?: string
}
