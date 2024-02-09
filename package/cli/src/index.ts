#!/usr/bin/env node
import { program } from 'commander'
import { ErrorHandler, color, createFile } from './lib/utils.js'

async function AddCommand() {
    try {
        console.log('hello')
    } catch (error) {
        ErrorHandler(error)
    }
}

program
    .name('add')
    .description('For adding functions and utilities for node')
    .command('add')
    .action(AddCommand)

program.parse(process.argv)
