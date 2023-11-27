const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// const port = 3000; 
const port = 12455;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_2455", // PostgreSQLのユーザー名
  host: "db",//localhostから変更しました
  database: "crm_2455", // PostgreSQLのデータベース名
  password: "pass_2455", // PostgreSQLのパスワード
  port: 5432,
  // port: 2455,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/customer/:customerId", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [req.params.customerId]);
    res.send(customerData.rows[0]);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.delete("/customer/:customerId", async (req, res) => {
  try {
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [req.params.customerId]);
    res.send(`Customer with ID ${req.params.customerId} deleted successfully.`);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",//company_nam →　company_name に修正しました
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));
