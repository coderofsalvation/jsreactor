module.exports = (engine) => {
    engine.addOperator('exist', (a, b) => a != undefined )
}