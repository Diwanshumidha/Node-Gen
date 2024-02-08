#!/usr/bin/env node
import { program } from 'commander'

function AddCommand() {}

program
    .name('add')
    .description('For adding functions and utilities for node')
    .command('add')
    .action(AddCommand)

program.parse(process.argv)
