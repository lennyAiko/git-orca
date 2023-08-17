import { confirm, intro, outro, select, spinner, text } from '@clack/prompts'
import minimist from 'minimist'
import color from 'picocolors'
import { Octokit } from '@octokit/rest'
import { writeToFilePR, writeToFileIssues } from './helpers/index.js'
import dotenv from 'dotenv'
dotenv.config()

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

intro(color.inverse('todo-list CLI'))

const repo_owner = await text({
    message: 'Who is the owner of the repo?',
    placeholder: 'lennyaiko'
})

const repo_name = await text({
    message: 'What is the name of the repo?',
    placeholder: 'clacky'
})

const selection = await select({
    message: 'Do you want to view issues or PR?',
    options: [
        {value: 'issue', label: 'issues', hint: 'to contribute'},
        {value: 'pr', label: 'pull requests'}
    ]
})

const repo_state = await select({ 
    messagse: 'Do you want open or closed?',
    options: [
        {value: 'open', label: 'open'},
        {value: 'closed', label: 'closed'}
    ]
})

const page_number = await text({
    message: 'What page do you want to view?',
    placeholder: '>= 1'
})

const per_page = await text({
    message: 'How many per page?',
    placeholder: '<= 100'
})

const s = spinner()

s.start(`Fetching...`)

const git = await octokit.issues.listForRepo({
    owner: repo_owner,
    repo: repo_name,
    per_page: per_page,
    page: page_number,
    state: repo_state
})

s.stop(`Done fetching...`)

if (git.data.length < 1) {
    outro(`Found no ${selection} here`)
} else {
    s.start('Writing to file...')
    switch(selection){
        case('issue'):
            s.stop('Done writing to file...')
            outro(writeToFileIssues(
                git.data
                .map((item) => (item.pull_request ? null : item))
                .filter((item) => item)
            ))
            break
        case('pr'):
            s.stop('Done writing to file...')
            outro(writeToFilePR(
                git.data
                .map((item) => item.pull_request)
                .filter((item) => item)
            ))
            break
        default: `Found ${git.data.length} here`
    }
}
