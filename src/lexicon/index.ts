/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type Auth,
  type Options as XrpcOptions,
  Server as XrpcServer,
  type StreamConfigOrHandler,
  type MethodConfigOrHandler,
  createServer as createXrpcServer,
} from '@atproto/xrpc-server'
import { schemas } from './lexicons.js'

export function createServer(options?: XrpcOptions): Server {
  return new Server(options)
}

export class Server {
  xrpc: XrpcServer
  app: AppNS

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer(schemas, options)
    this.app = new AppNS(this)
  }
}

export class AppNS {
  _server: Server
  pocketfeed: AppPocketfeedNS

  constructor(server: Server) {
    this._server = server
    this.pocketfeed = new AppPocketfeedNS(server)
  }
}

export class AppPocketfeedNS {
  _server: Server
  feed: AppPocketfeedFeedNS

  constructor(server: Server) {
    this._server = server
    this.feed = new AppPocketfeedFeedNS(server)
  }
}

export class AppPocketfeedFeedNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }
}
