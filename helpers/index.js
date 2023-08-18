import fs from 'fs'
import color from 'picocolors'
import { confirm, intro, isCancel, outro, select, spinner, text, cancel } from '@clack/prompts'
import dotenv from 'dotenv'
dotenv.config()

var message = ""

export function writeToFileIssues(data) {
    let store = []
    try {
        data.map(item => {
            store.push({
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

        fs.writeFile('./data.json', 
        JSON.stringify(store, null, 2), 
        err => {
            if(err) console.log('Could not store')
        })
        message = 'Check data.json for results'
    } catch (err) {
        message = 'There was an error storing your result'
    }
    return message
}

export function writeToFilePR(data) {
    try {
        fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
            if(err) console.log(err)
        })
        message = 'Check data.json for results'
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
        var repo_owner = await text({
            message: 'Who is the owner of the repo?',
            placeholder: 'lennyaiko',
            defaultValue: 'lennyaiko'
        })
        
        close(repo_owner)
    }

    if (!argv.name) {
        var repo_name = await text({
            message: 'What is the name of the repo?',
            placeholder: 'git-orca',
            defaultValue: 'git-orca'
        })

        close(repo_name)
    }

    if (!argv.issues && !argv.pr) {
        var selection = await select({
            message: 'Do you want to view issues or PR?',
            options: [
                {value: 'issues', label: 'issues', hint: 'to contribute'},
                {value: 'PR', label: 'pull requests'}
            ]
        })
        close(repo_owner)
    }

    if (!argv.open && !argv.closed) {
        var repo_state = await select({ 
            message: 'Do you want open or closed?',
            options: [
                {value: 'open', label: 'open'},
                {value: 'closed', label: 'closed'}
            ]
        })
        close(repo_owner)
    }

    if (!argv.p) {
        var page_number = await text({
            message: 'What page do you want to view?',
            placeholder: '>= 1',
            defaultValue: '1'
        })
        close(repo_owner)
    }

    if (!argv.pp) {
        var per_page = await text({
            message: 'How many per page?',
            placeholder: '<= 100',
            defaultValue: '30'
        })
        close(repo_owner)
    }

    const s = spinner()

    s.start(color.yellow('Fetching...'))

    const git = await octokit.issues.listForRepo({
        owner: argv.owner ? argv.owner : repo_owner,
        repo: argv.name ? argv.name : repo_name,
        per_page: argv.pp ? argv.pp : per_page,
        page: argv.p ? argv.p : page_number,
        state: (function () {
            if (!repo_state) {
                if (argv.open) return 'open'
                if (argv.closed) return 'closed'
            }
            return repo_state
        })()
    })

    s.stop(color.green('Done fetching...'))

    if (git.data.length < 1) {
        outro(color.red(`Found no ${selection}s here`))
    } else {
        s.start(color.yellow('Writing to file...'))
        switch(
            (function () {
                if (!selection) {
                    if (argv.issues) return 'issues'
                    if (argv.pr) return 'pr'
                }
            })()
        )
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