import { ErrorHandler, color, formatPackageName } from './utils.js'
import { $ } from 'execa'
import { rimraf } from 'rimraf'
import fs from 'fs-extra'
import {
    spinner,
    text,
    isCancel,
    cancel,
    select,
    confirm,
} from '@clack/prompts'
import {
    ConfigSchema,
    DATABASES,
    JS_GITHUB_URL,
    JS_GITHUB_URL_PRISMA,
    TS_GITHUB_URL,
    TS_GITHUB_URL_PRISMA,
} from '../constants/Links.js'

export const GetConfigFromUser = async (
    defaultConfig: ConfigSchema
): Promise<Required<ConfigSchema>> => {
    let config = defaultConfig
    // ----------- App Name -----------------

    if (!config.AppName) {
        const AppName = await text({
            message: `What is the ${color.blue('Name')} of your app?`,
            validate(value) {
                if (value.length === 0) return `Value is required!`
            },
            placeholder: 'my-app',
        })

        if (isCancel(AppName)) {
            cancel('Operation cancelled.')
            process.exit(1)
        }
        config.AppName = AppName
    }

    if (config.typescript === undefined) {
        const typescript = await confirm({
            message: `Are you using ${color.green('Typescript')}?`,
        })

        if (isCancel(typescript)) {
            cancel('Operation cancelled.')
            process.exit(1)
        }
        config.typescript = typescript
    }
    // ------------ ORM ---------------
    if (!config.ORM) {
        const ORM = await select({
            message: `Pick a ${color.blue('Project type.')}`,
            options: [
                { value: 'prisma', label: 'Prisma' },
                {
                    value: 'without_prisma',
                    label: 'Without Prisma',
                    hint: 'only support Mongodb for now',
                },
            ],
        })
        if (isCancel(ORM)) {
            cancel('Operation cancelled.')
            process.exit(1)
        }

        config.ORM = ORM as ConfigSchema['ORM']
    }

    // --------- Database --------------
    if (!config.database && config.ORM !== 'without_prisma') {
        const Database = await select({
            message: `Pick a Suitable ${color.yellow('Database')}`,
            options: [
                ...DATABASES.map((item) => ({
                    value: item.key,
                    label: item.label,
                })),
            ],
        })
        if (isCancel(Database)) {
            cancel('Operation cancelled.')
            process.exit(1)
        }

        config.database = Database as ConfigSchema['database']
    }

    // App Only support Mongo Db without prisma for now
    if (config.ORM === 'without_prisma') {
        config.database === 'mongodb'
    }

    return config as Required<ConfigSchema>
}

export const GetGithubLink = (config: ConfigSchema) => {
    const isTypescript = config.typescript
    const isPrisma = config.ORM === 'prisma'
    let link
    if (isTypescript && isPrisma) {
        link = TS_GITHUB_URL_PRISMA
    } else if (isTypescript) {
        link = TS_GITHUB_URL
    } else if (isPrisma) {
        link = JS_GITHUB_URL_PRISMA
    } else {
        link = JS_GITHUB_URL
    }
    return link
}

export const CloneFromGithub = async (
    repositoryUrl: string,
    appName: string
) => {
    try {
        const spin = spinner()
        spin.start('Initializing The  Application...')
        await $`git clone --depth 1 ${repositoryUrl} ${appName}`
        const gitFolderPath = `${appName}/.git`
        await rimraf(gitFolderPath)
        spin.stop('Successfully Initialized the App')
    } catch (error) {
        ErrorHandler(error, 'Error While Cloning To Github', true)
    }
}

export const ADD_DATABASE_MODEL = async () => {
    try {
    } catch (error) {
        ErrorHandler(error, 'Failed to add database model')
    }
}

export const FixPackageJsonName = async (AppName: string) => {
    const spin = spinner()
    try {
        spin.start('Making Config Changes.....')
        const filePath = 'package.json'
        const currentContent = await fs.promises.readFile(filePath, 'utf-8')
        const updatedContent = currentContent.replace(
            /\[APP_NAME\]/g,
            formatPackageName(AppName)
        )
        await fs.promises.writeFile(filePath, updatedContent)

        spin.stop('Successfully Config Changes are Done')
    } catch (err) {
        ErrorHandler(
            err,
            `Error While Replacing Content in Package.json:`,
            false
        )
        spin.stop()
    }
}

export const FIX_ENV_FILE = async (AppName: string, ENV_PATH: string) => {
    const spin = spinner()
    try {
        spin.start('Finalizing The App')
        const currentContent = await fs.promises.readFile(ENV_PATH, 'utf-8')
        const updatedContent = currentContent.replace(
            /\[APP_NAME\]/g,
            formatPackageName(AppName)
        )
        await fs.promises.writeFile(ENV_PATH, updatedContent)

        spin.stop('Successfully Finalized the App')
    } catch (err) {
        ErrorHandler(
            err,
            `Error While Replacing Content in Package.json:`,
            false
        )
        spin.stop()
    }
}
