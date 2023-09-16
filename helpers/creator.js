import fs from 'fs'

const cleaner = (file) => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file)
    }
}

var message

export function writeTxtIssues(data) {
    cleaner("git-orca.txt")
    let count = 1
    var fileStream = fs.createWriteStream('./git-orca.txt', { flags: 'a' })
    fileStream.write("ISSUES\n")
    try {
        data.map(
            item => {
                fileStream.write
(`${count++}. ${item.title}
Url = ${item.url}
State = ${item.state}
Issue number = ${item.number}
User = ${item.user.login}
User url = ${item.user.url}
Created at = ${item.created_at}
Updated at = ${item.updated_at}
Closed at = ${item.closed_at}
Body  = ${item.body ? item.body : "empty"}
\n`)
            }
        )
        fileStream.write("\nGenerated with git-orca") 
        fileStream.end()
        message = 'Check git-orca.txt for result'
    } catch (err) {
        message = 'There was an error storing your result'
    }
    return message
}

export function writeTxtPR(data) {
    cleaner("git-orca.txt")
    let count = 1
    var fileStream = fs.createWriteStream('./git-orca.txt', { flags: 'a' })
    fileStream.write("PRs\n")
    try {
        data.map(
            item => {
                fileStream.write(
`${count++}. Url = ${item.title}
Url = ${item.url}
State = ${item.state}
Pull request = ${item.pull_request.url}
Pull request number = ${item.number}
User = ${item.user.login}
User url = ${item.user.url}
Created at = ${item.created_at}
Updated at = ${item.updated_at}
Closed at = ${item.closed_at}
Body  = ${item.body ? item.body : "empty"}
\n`
                )
            }
        )
        fileStream.write("\nGenerated with git-orca")
        fileStream.end() 
        message = 'Check git-orca.txt for results'
    } catch (err) {
        message = 'There was an error storing your result'
    }
    return message
}

export function writeJSONIssues(data) {
    cleaner("git-orca.json")
    let store = []
    let count = 1
    try {
        data.map(item => {
            store.push({
                count: count++,
                url: item.url,
                title: item.title,
                state: item.state,
                issueNumber: item.number,
                user: item.user.login,
                userUrl: item.user.url,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                closedAt: item.closed_at,
                body: item.body ? item.body : "empty"
            })
        })

        fs.writeFile('./git-orca.json', 
        JSON.stringify({
            requested: "issues",
            total: store.length, 
            data: store,
            watermark: "Generated with git-orca"
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

export function writeJSONPR(data) {
    cleaner("git-orca.json")
    try {
        let store = []
        let count = 1
        data.map(item => {
            store.push({
                count: count++,
                url: item.url,
                title: item.title,
                state: item.state,
                pullRequest: item.pull_request.url,
                pullRequestNumber: item.number,
                user: item.user.login,
                userUrl: item.user.url,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                closedAt: item.closed_at,
                body: item.body ? item.body : "empty"
            })
        })
        fs.writeFile('./git-orca.json', 
        JSON.stringify({
            requested: "PRs",
            total: store.length, 
            data: store,
            watermark: "Generated with git-orca"
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