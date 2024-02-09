import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

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

    console.error(color.error(StringifiedError))
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

export function formatPackageName(input: string): string {
    const sanitized = input.replace(/[^a-zA-Z0-9-]/g, '-')
    const lowercase = sanitized.toLowerCase()
    const validName = lowercase.match(
        /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/
    )
    return validName ? validName[0] : input
}
