export const JS_GITHUB_URL = 'https://github.com/shishiro26/node-auth-kit/'
export const JS_GITHUB_URL_PRISMA =
    'https://github.com/shishiro26/nodgen-prisma-js'
export const TS_GITHUB_URL = 'https://github.com/shishiro26/node-gen-ts'
export const TS_GITHUB_URL_PRISMA =
    'https://github.com/shishiro26/nodgen-prisma-ts'

export const DATABASES = [
    { label: 'MongoDB', key: 'mongodb', blob: 'mongo_schema.prisma' },
    { label: 'Postgres', key: 'postgres', blob: 'postgres_schema.prisma' },
] as const

export const PRISMA_SCHEMA_FILE_PATH = 'prisma/schema.prisma'

export type TDATABASES = (typeof DATABASES)[number]['key']

export type ConfigSchema = {
    typescript?: boolean
    database?: TDATABASES
    ORM?: 'prisma' | 'without_prisma'
    AppName?: string
}
