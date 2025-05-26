import { user } from "./user/user";

export const table = {
	user
} as const

export type Table = typeof table

