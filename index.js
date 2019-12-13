const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbConfig')
const app = express()
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

// Handle employee GET route for all coupons
app.get('/employees/', (req, res) => {
  const query = 'SELECT * FROM employees'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    const coupon = [...results]
    const response = {
      data: coupon,
      message: 'All employees successfully retrieved.',
    }
    res.send(response)
  })
})

// Handle employee GET route for a specific coupon
app.get('/employees/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId
  const query = `SELECT * FROM employees WHERE employeeId =${employeeId}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const employee = results[0]
    const response = {
      data: employee,
      message: `Employee ${employee.employeeName} successfully retrieved.`,
    }
    res.status(200).send(response)
  })
})

// Handle employee POST route
app.post('/employees/', (req, res) => {
  const { password, title, employeeName,employeeAddress,employeePhone,employeeEmail } = req.body
  const query = `INSERT INTO employees (password, title, employeeName, employeeAddress, employeePhone, employeeEmail) 
  VALUES ('${password}', '${title}', '${employeeName}', '${employeeAddress}','${employeePhone}', '${employeeEmail}')`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { insertId } = results
    const employee = {  employeeId: insertId,password, title, employeeName, employeeAddress,employeePhone,employeeEmail }
    const response = {
      data: employee,
      message: `Employee ${employeeName} successfully added.`,
    }
    res.status(201).send(response)
  })
})




// Handle employee PUT route
app.put('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params
  const query = `SELECT * FROM employees WHERE employeeId=${employeeId} LIMIT 1`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { employeeId, password, title, employeeName, employeeAddress,employeePhone,employeeEmail } = { ...results[0], ...req.body }
   
    const query = `UPDATE employees SET password='${password}', title='${title}', employeeName='${employeeName}', 
    employeeAddress='${employeeAddress}', employeePhone='${employeePhone}', employeeEmail='${employeeEmail}' WHERE employeeId='${employeeId}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }
      else{
        const employee = {
          employeeId, password, title, employeeName, employeeAddress,employeePhone,employeeEmail
        }
        const response = {
          data: employee,
          message: `Employee ${employeeName} is successfully updated.`,
        }
        res.send(response)
      }

    })
  })
})

// Handler employee DELETE route
app.delete('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const query = `DELETE FROM employees WHERE employeeId=${employeeId}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message }
      res.send(response)
    }

    const response = {
      data: null,
      message: `Employee with id: ${employeeId} successfully deleted.`,
    }
    res.send(response)
  })
})

// Handle in-valid route
app.all('*', function(req, res) {
  const response = { data: null, message: 'Route not found!!' }
  res.status(400).send(response)
})

// wrap express app instance with serverless http function
module.exports.handler = serverless(app)
