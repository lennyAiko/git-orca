import fs from 'fs'

var message = ""
let store = []

export function writeToFile(data) {
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

        fs.writeFile('./data/data.json', JSON.stringify(store, null, 2), err => {
            if(err) console.log(err)
        })
        message = 'Check `data/data.json` for results'
    } catch (err) {
        console.log(err)
        message = 'There was an error storing your result'
    }
    return message
}
