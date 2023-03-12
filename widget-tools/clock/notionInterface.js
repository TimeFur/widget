
const getDBFormat = (dbKey = "") => {
    return new Promise((resolve) => {
        request = { dbKey: dbKey }
        fetch('/getDBFormat', {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(request)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            resolve(data.data)
        })
    })
}

const getDBContent = (dbKey = "") => {
    return new Promise((resolve) => {
        request = { dbKey: dbKey }
        fetch('/getDB', {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(request)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            resolve(data.data)
        })
    })
}