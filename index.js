import minimist from 'minimist'
import { Octokit } from '@octokit/rest'
import { CLI } from './helpers/commands.js'

export function main(token=null) {
    const octokit = new Octokit({ auth: token })

    const argv = minimist(process.argv.slice(2))

    CLI(octokit, argv)
}
