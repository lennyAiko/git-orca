import minimist from 'minimist'
import { Octokit } from '@octokit/rest'
import { CLI, flagCLI } from './helpers/index.js'

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

const argv = minimist(process.argv.slice(2))

const argvLength = Object.keys(argv).length

if (argvLength === 1) CLI(octokit)

else flagCLI(octokit, argv)