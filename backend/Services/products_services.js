const db = require('../config/db');
const filters={
  'price_asc':"ORDER BY price ASC",
  'price_desc':"ORDER BY price DESC"
}

async function get_products(offset, category = null, search = null, filter = "default") {
  let where = "";
  let order = "";
  order =  filters[filter] || "ORDER BY id ASC";

  if (category) where += ` WHERE category = ?`;
  if (search) where += category ? ` AND description LIKE ?` : ` WHERE description LIKE ?`;

  const values = [];
  if (category) values.push(category);
  if (search) values.push(`${search}%`);

  const countQuery = `SELECT COUNT(id) AS count FROM products ${where}`;
  const [countRows] = await db.execute(countQuery, values);

  const total = countRows[0].count;
  if (offset > total) throw new Error("PAGE NOT FOUND");

  const dataQuery = `SELECT * FROM products ${where} ${order} LIMIT 6 OFFSET ?`;
  const [products] = await db.execute(dataQuery, [...values, offset]);

  return { products, count: total };
}
async function get_product_data(id) {
  const [rows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
  return rows[0];
}
//(description, price, discounted_price, image_url, quantity, category) 
async function save_product(product){
  console.log(Object.values(product))
const [result]=await db.execute(`INSERT INTO products (description,category, discounted_price, price, image_url, quantity) VALUES(?,?,?,?,?,?)`, Object.values(product))
return result?.insertId;
}

module.exports = {
  get_products,
  get_product_data,save_product
};
