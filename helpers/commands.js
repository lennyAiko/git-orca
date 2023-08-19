import fs from 'fs'
import color from 'picocolors'
import { confirm, intro, isCancel, outro, select, spinner, text, cancel } from '@clack/prompts'
import dotenv from 'dotenv'
dotenv.config()

var message

function writeToFileIssues(data) {
    let store = []
    let count = 1
    try {
        data.map(item => {
            store.push({
                count: count++,
                url: item.url,
                title: item.title,
                state: item.state,
                number: item.number,
                user: item.user.login,
                user_url: item.user.url,
                created_at: item.created_at,
                updated_at: item.updated_at,
                body: item.body
            })
        })

        fs.writeFile('./git-orca.json', 
        JSON.stringify({
            total: store.length, 
            data: store
        }, null, 2), 
        err => {
            if(err) console.log('Could not store')
        })
        message = 'Check git-orca.json for result'
    } catch (err) {
        message = 'There was an error storing your result'
    }
    return message
}

function writeToFilePR(data) {
    try {
        fs.writeFile('./git-orca.json', 
        JSON.stringify({
            total: data.length, 
            data
        }, null, 2), 
        err => {
            if(err) console.log(err)
        })
        message = 'Check git-orca.json for results'
    } catch (err) {
        message = 'There was an error storing your result'
    }
    return message
}

function close(value) {
    if(isCancel(value)) {
        cancel('Thanks for trying Clack, see you later!')
        process.exit(0)
    }
}

export async function CLI(octokit, argv) { 
    
    intro('git-orca')

    if (!argv.owner) {
        var repoOwner = await text({
            message: 'Who is the owner of the repo?',
            placeholder: 'lennyaiko',
            defaultValue: 'lennyaiko'
        })
        
        close(repoOwner)
    }

    if (!argv.name) {
        var repoName = await text({
            message: 'What is the name of the repo?',
            placeholder: 'git-orca',
            defaultValue: 'git-orca'
        })

        close(repoName)
    }

    if (!argv.issues && !argv.pr) {
        var selection = await select({
            message: 'Do you want to view issues or PR?',
            options: [
                {value: 'issues', label: 'issues'},
                {value: 'PR', label: 'pull requests'}
            ]
        })
        close(selection)
    }

    if (argv.issues) selection = 'issues'
    if (argv.pr) selection = 'pr'

    if (!argv.open && !argv.closed) {
        var repoState = await select({ 
            message: 'Do you want open or closed?',
            options: [
                {value: 'open', label: 'open'},
                {value: 'closed', label: 'closed'}
            ]
        })
        close(repoState)
    }

    if (!argv.p) {
        var pageNumber = await text({
            message: 'What page do you want to view?',
            placeholder: '>= 1',
            defaultValue: '1'
        })
        close(pageNumber)
    }

    if (!argv.pp) {
        var perPage = await text({
            message: 'How many per page?',
            placeholder: '<= 100',
            defaultValue: '30'
        })
        close(perPage)
    }

    const s = spinner()

    s.start(color.yellow('Fetching...'))

    const git = await octokit.issues.listForRepo({
        owner: argv.owner ? argv.owner : repoOwner,
        repo: argv.name ? argv.name : repoName,
        per_page: argv.pp ? argv.pp : perPage,
        page: argv.p ? argv.p : pageNumber,
        state: (function () {
            if (!repoState) {
                if (argv.open) return 'open'
                if (argv.closed) return 'closed'
            }
            return repo_state
        })()
    })

    s.stop(color.green('Done fetching...'))

    if (git.data.length < 1) {
        outro(color.red(`Found no ${selection}(s) here`))
    } else {
        s.start(color.yellow('Writing to file...'))
        switch(selection)
        {
            case('issues'):
                s.stop(color.green('Done writing to file...'))
                outro(color.green(writeToFileIssues(
                    git.data
                    .map((item) => (item.pull_request ? null : item))
                    .filter((item) => item))
                ))
                break
            case('pr'):
                s.stop(color.green('Done writing to file...'))
                outro(color.green(writeToFilePR(
                    git.data
                    .map((item) => item.pull_request)
                    .filter((item) => item))
                ))
                break
            default: color.green(`Found ${git.data.length} issues / PRs here`)
        }
    }
}