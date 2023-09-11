import fs from 'fs'

const cleaner = () => {
    if (fs.existsSync("git-orca.txt")) {
        fs.unlinkSync("git-orca.txt")
    }
}

var message

export function writeTxtIssues(data) {
    cleaner()
    let count = 1
    var fileStream = fs.createWriteStream('./git-orca.txt', { flags: 'a' })
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
    cleaner()
    let count = 1
    var fileStream = fs.createWriteStream('./git-orca.txt', { flags: 'a' })
    try {
        data.map(
            item => {
                fileStream.write(
`${count++}. Url = ${item.url}\nHTML url =${item.html_url}\nDiff url = ${item.diff_url}\nPatch url = ${item.patch_url}\nMerged at = ${item.merged_at ? item.merged_at : "Not merged"}\n`
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
    let store = []
    let count = 1
    try {
        data.map(item => {
            store.push({
                count: count++,
                url: item.url,
                title: item.title,
                state: item.state,
                issue_number: item.number,
                user: item.user.login,
                user_url: item.user.url,
                created_at: item.created_at,
                updated_at: item.updated_at,
                body: item.body ? item.body : "empty"
            })
        })

        fs.writeFile('./git-orca.json', 
        JSON.stringify({
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
    try {
        fs.writeFile('./git-orca.json', 
        JSON.stringify({
            total: data.length, 
            data,
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