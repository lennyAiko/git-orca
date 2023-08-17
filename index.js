import minimist from 'minimist'
import { Octokit } from '@octokit/rest'
import { CLI } from './helpers/index.js'

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

const argv = minimist(process.argv.slice(2))

CLI(octokit, argv)