import fs from 'fs'

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
