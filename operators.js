module.exports = (engine) => {
    engine.addOperator('exist', (a, b) => {
        console.log("ExIST")
        console.dir({a,b})
        return a != undefined
    })
}