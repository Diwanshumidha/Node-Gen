#!/usr/bin/env node
import { program } from 'commander'
import {
    ErrorHandler,
    Get_Installation_Command,
    color,
    createFile,
    detectPackageManager,
} from './lib/utils.js'
import {
    ADD_DATABASE_MODEL,
    CloneFromGithub,
    FIX_ENV_FILE,
    FixPackageJsonName,
    GetConfigFromUser,
    GetGithubLink,
} from './lib/init.js'
import { ConfigSchema } from './constants/Links.js'
import { cwd } from 'process'
import { intro, outro, log } from '@clack/prompts'

async function InitCommand() {
    try {
        const OptionConfig: ConfigSchema = {}
        const packageManager = detectPackageManager()

        intro('Node Gen Cli')
        const config = await GetConfigFromUser(OptionConfig)
        const GithubLink = GetGithubLink(config)
        await CloneFromGithub(GithubLink, config.AppName)
        process.chdir(config.AppName)
        await ADD_DATABASE_MODEL(config)
        await FixPackageJsonName(config.AppName)
        await FIX_ENV_FILE(config.AppName, '.env.example')
        outro(
            `Done! You can now\n\nRun:\n  => ${color.green(`cd ${config.AppName}`)}\n  => ${color.green(Get_Installation_Command(packageManager))}`
        )
        console.log(process.env.npm_execpath)
    } catch (error) {
        ErrorHandler(error)
    }
}

program
    .name('init')
    .description('For Initializing a Node App')
    .command('init')
    .action(InitCommand)

program.parse(process.argv)
