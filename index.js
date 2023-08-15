import { confirm, intro, outro, select, spinner, text } from '@clack/prompts'
import minimist from 'minimist'
import color from 'picocolors'
import { Octokit } from '@octokit/rest'

intro(color.inverse('todo-list CLI'))

const repo_name = await text({
    message: 'What is the name of the repo?',
    placeholder: 'clacky'
})

const selection = await select({
    message: 'Do you want to view issues or PR?',
    options: [
        {value: 'is', label: 'issues', hint: 'to contribute'},
        {value: 'pr', label: 'pull requests'}
    ]
})

const type = await select({
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
    placeholder: '< 100'
})

const s = spinner()

s.start(`Fetching...`)
s.stop(`Done fetching...`)

outro('You are all set')