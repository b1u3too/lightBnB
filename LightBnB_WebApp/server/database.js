const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const user = pool
  .query(`SELECT * 
    FROM users
    WHERE users.email = $1`, [ email ])
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
  return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const user = pool
  .query(`SELECT * 
    FROM users
    WHERE users.id = $1`, [ id ])
  .then((result) => {
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
  return Promise.resolve(user);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const newUser = pool
    .query(`INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [user.name, user.email, user.password])
    .then(result => {
      return result.rows[0];
    })
    .catch(err => {
      console.log(err.message)
    });

  return Promise.resolve(newUser);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
      FROM reservations
      JOIN properties ON properties.id = reservations.property_id
      JOIN property_reviews ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY start_date
      LIMIT $2;`, 
      [ guest_id, limit ])
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `SELECT properties.*, avg(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON property_reviews.property_id = properties.id
  `
  //collect the WHERE clause query components in an array
  const whereParts = [];

  if (options.city) {
    queryParams.push(`%${options.city.slice(1,-1)}%`);
    whereParts.push(`(city LIKE $${queryParams.length})`);
  }  
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereParts.push(`(properties.owner_id = $${queryParams.length})`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    whereParts.push(`(properties.cost_per_night >= $${queryParams.length})`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    whereParts.push(`(properties.cost_per_night <= $${queryParams.length})`);
  }

  //join any whereParts, if specified, into a where clause
  if (whereParts.length > 0) {
    queryString += 'WHERE ' + whereParts.join(' AND ') + ' ';
  }

  //add GROUP BY clause standalone
  queryString += `GROUP BY properties.id `;

  //check for the lone HAVING clause aggregate function
  if (options.minimum_rating) { 
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propKeys = Object.keys(property);
  let workingString = 'INSERT INTO properties (' + propKeys.join(', ') + ') \n VALUES (';
  const queryParams = [];

  for (const key of propKeys) {
    queryParams.push(property[key]);
    workingString += `$${queryParams.length}, `;
  }

  const queryString = workingString.slice(0, -2) + ') RETURNING *';

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
}
exports.addProperty = addProperty;
