import minimist from 'minimist'
import { Octokit } from '@octokit/rest'
import { CLI } from './helpers/commands.js'
import { fileURLToPath } from 'url'

export function main(token = null) {
  const octokit = new Octokit({ auth: token || process.env.GITHUB_ACCESS_TOKEN })

  const argv = minimist(process.argv.slice(2))

  CLI(octokit, argv)
}

const __filename = fileURLToPath(import.meta.url)

let entryFile = process.argv?.[1];

if (entryFile === __filename) {
  main();
}