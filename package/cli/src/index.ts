#!/usr/bin/env node
import { program } from 'commander'
import { ErrorHandler, color, createFile } from './lib/utils.js'
import { CloneFromGithub, FixPackageJsonName } from './lib/init.js'
import { JS_GITHUB_URL_MONGO } from './constants/Links.js'
import { cwd } from 'process'

async function InitCommand() {
    try {
        const path = 'temp/AppName'
        // await CloneFromGithub(JS_GITHUB_URL_MONGO, path)
        process.chdir(path)
        await FixPackageJsonName('AppName')
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
