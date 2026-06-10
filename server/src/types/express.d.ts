import type { User as IUser } from '../types.js'

declare module 'passport-steam' {
  import type { Strategy } from 'passport'
  export { Strategy }
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export {}
