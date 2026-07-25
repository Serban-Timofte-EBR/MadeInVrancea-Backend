export interface JwtPayload {
  /** User identifier (subject). */
  sub: string;
  email: string;
  role: string;
}
