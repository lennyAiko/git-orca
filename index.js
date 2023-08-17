import minimist from 'minimist'
import { Octokit } from '@octokit/rest'
import { CLI } from './helpers/index.js'

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

CLI(octokit)