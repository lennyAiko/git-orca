import fs from 'fs'
import color from 'picocolors'
import { confirm, intro, outro, select, spinner, text } from '@clack/prompts'
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
            if(err) console.log(err)
        })
        message = 'Check `data.json` for results'
    } catch (err) {
        console.log(err)
        message = 'There was an error storing your result'
    }
    return message
}

export function writeToFilePR(data) {
        try {
        console.log(data) 
        fs.writeFile('./data/data.json', JSON.stringify(data, null, 2), err => {
            if(err) console.log(err)
        })
        message = 'Check `data.json` for results'
    } catch (err) {
        console.log(err)
        message = 'There was an error storing your result'
    }
    return message
}

export async function CLI(octokit) {
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
        message: 'Do you want open or closed?',
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

}
