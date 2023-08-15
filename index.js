import { confirm, intro, outro, select, spinner, text } from '@clack/prompts'
import minimist from 'minimist'
import color from 'picocolors'
import { Octokit } from '@octokit/rest'

intro(color.inverse('todo-list CLI'))

const repo_name = await text({
    message: 'Enter name of the repo',
    placeholder: 'clacky'
})

const s = spinner()

s.start("Loading...")
s.stop("Done!...")

// const choice = await confirm({
//     message: 'Are you done?'
// })

outro('You are all set')