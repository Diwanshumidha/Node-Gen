import { ErrorHandler, formatPackageName } from './utils.js'
import { $ } from 'execa'
import { rimraf } from 'rimraf'
import fs from 'fs-extra'
import path from 'path'

export const GetConfigFromUser = () => {
    // TODO: Implement Js Ts etc
}

export const CloneFromGithub = async (
    repositoryUrl: string,
    appName: string
) => {
    try {
        await $`git clone --depth 1 ${repositoryUrl} ${appName}`
        const gitFolderPath = `${appName}/.git`
        console.log('Removing .git')
        await rimraf(gitFolderPath)
    } catch (error) {
        ErrorHandler(error, 'Error While Cloning To Github', true)
    }
}

export const FixPackageJsonName = async (AppName: string) => {
    try {
        const filePath = 'package.json'
        const currentContent = await fs.promises.readFile(filePath, 'utf-8')
        const updatedContent = currentContent.replace(
            /\[APP_NAME\]/g,
            formatPackageName(AppName)
        )
        await fs.promises.writeFile(filePath, updatedContent)
    } catch (err) {
        ErrorHandler(err, `Error While Replacing Content in Package.json:`)
    }
}
