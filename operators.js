module.exports = (engine) => {
    engine.addOperator('exist',    (a, b) => a != undefined )
    engine.addOperator('notexist', (a, b) => a == undefined )
    engine.addOperator('empty',    (a, b) => a == undefined || a == '' )
}