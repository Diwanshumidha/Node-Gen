import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { ConfigSchema, DATABASES } from '../constants/Links.js'

export const color = {
    error: (string: string) => chalk.red(`✘ ${string}`),
    success: (string: string) => chalk.green(`✔ ${string}`),
    heading: (string: string) => chalk.bold.underline.cyan(`=== ${string} ===`),
    yellow: (string: string) => chalk.yellow(string),
    blue: (string: string) => chalk.blue(string),
    green: (string: string) => chalk.green(string),
}

export function ErrorHandler(error: unknown, fallback?: string, doExit = true) {
    let StringifiedError: string =
        fallback || 'Error: There Was an Unknown Error!'
    if (typeof error === 'string') {
        StringifiedError = error
    } else if (error instanceof Error) {
        StringifiedError = error.message
    } else if (typeof error === 'object' && error && 'message' in error) {
        StringifiedError = String(error.message)
    }

    doExit && console.error(color.error(StringifiedError))
    // Cleanup Function Goes Here
    doExit && process.exit(1)
}

export async function createFile(
    directoryPath: string,
    fileName: string,
    content = ''
) {
    const filePath = path.join(directoryPath, fileName)

    await fs.mkdir(directoryPath, { recursive: true })

    try {
        fs.writeFileSync(filePath, content)
    } catch (err) {
        ErrorHandler(err, `Error While Creating ${fileName}:`)
    }
}

export async function replaceFileContent(filePath: string, newContent: string) {
    try {
        // Ensure that the file exists, creating it if it doesn't
        await fs.ensureFile(filePath)

        // Write the new content to the file
        await fs.writeFile(filePath, newContent, 'utf8')
    } catch (err) {
        console.error(err)
    }
}

export function formatPackageName(input: string): string {
    const sanitized = input.replace(/[^a-zA-Z0-9-]/g, '-')
    const lowercase = sanitized.toLowerCase()
    const validName = lowercase.match(
        /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/
    )
    return validName ? validName[0] : input
}

export const Fetch_Github_Template = async (
    database: ConfigSchema['database']
) => {
    try {
        if (!database) return
        const blob = DATABASES.find((e) => e.key === database)?.blob
        const path = `https://raw.githubusercontent.com/Diwanshumidha/Node-Gen/main/templates/${blob}`
        // Fetch data from GitHub
        const res = await fetch(path)

        if (!res.ok) {
            throw new Error(
                `Failed to fetch Model. Please Get Model Manually from the Docs`
            )
        }

        // Read the fetched data
        const data = await res.text()
        return data
    } catch (error) {
        console.log(
            color.error(
                `Failed to fetch Model. Please Get Model Manually from the Docs`
            )
        )
        ErrorHandler(error, 'Unable To get Database Model', false)
    }
}

export function detectPackageManager() {
    if (process.env.npm_execpath && process.env.npm_execpath.includes('yarn')) {
        return 'yarn'
    } else if (
        process.env.npm_execpath &&
        process.env.npm_execpath.includes('pnpm')
    ) {
        return 'pnpm'
    } else if (
        process.env.npm_execpath &&
        process.env.npm_execpath.includes('npm')
    ) {
        return 'npx'
    } else if (
        process.env.npm_execpath &&
        process.env.npm_execpath.includes('npx')
    ) {
        return 'npx'
    } else {
        return 'npx'
    }
}

export const Get_Installation_Command = (
    package_manager: ReturnType<typeof detectPackageManager>
) => {
    switch (package_manager) {
        case 'yarn':
            return 'yarn install'
        case 'pnpm':
            return 'pnpm install'
        default:
            return 'npm install'
    }
}
