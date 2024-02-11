#!/usr/bin/env node
import { program } from 'commander'
import { ErrorHandler, color, createFile } from './lib/utils.js'
import {
    CloneFromGithub,
    FixPackageJsonName,
    GetConfigFromUser,
    GetGithubLink,
} from './lib/init.js'
import { ConfigSchema } from './constants/Links.js'
import { cwd } from 'process'
import { intro } from '@clack/prompts'

async function InitCommand() {
    try {
        const OptionConfig: ConfigSchema = {}
        intro('Node Gen Cli')
        const config = await GetConfigFromUser(OptionConfig)
        const GithubLink = GetGithubLink(config)
        await CloneFromGithub(GithubLink, config.AppName)
        process.chdir(config.AppName)
        await FixPackageJsonName(config.AppName)
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
