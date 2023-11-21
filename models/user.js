/** User class for message.ly */



/** User of the site. */

class User {

  constructor(username,password,first_name, last_name, phone) {
    this.username = username ;
    this.password = password;
    this.first_name= first_name;
    this.last_name= last_name;
    this.phone = phone;
  }

  // newUser = new User(this.username,this.password,this.first_name,this.last_name,this.phone);
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {                                                    
        let hashedPassword = await bcrypt.hash(
          password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
          `INSERT INTO users (username, password,first_name,last_name,phone,join_at,
            last_login_at)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING username,password, first_name, last_name, phone`,current_timestamp, current_timestamp)
          [username,password,first_name,last_name, hashedPassword,phone];
        return res.json(result.rows[0]);
        }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try {
      const { username, password } = req.body;
      const result = await db.query(
        "SELECT password FROM users WHERE username = $1",
        [username]);
      let user = result.rows[0];
  
      if (user) {
        if (await bcrypt.compare(password, user.password) === true) {
          let token = jwt.sign({ username }, SECRET_KEY);
          return res.json({ token });
        }
      }
      throw new ExpressError("Invalid user/password", 400);
    } catch (err) {
      return next(err);
    }
  }

  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) {
    const result = await db.query(
        `UPDATE users
           SET last_login_at = current_timestamp
           WHERE username = $1
           RETURNING username`,
        [username]);

    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
  }


  static async all() {
    const result = await db.query(
        `SELECT username,
                first_name,
                last_name,
                phone
            FROM users
            ORDER BY username`);

    return result.rows;
  }

  static async get(username) {
    const result = await db.query(
        `SELECT username,
                first_name,
                last_name,
                phone,
                join_at,
                last_login_at
            FROM users
            WHERE username = $1`,
        [username]);

    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return result.rows[0];
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async messagesFrom(username) {
    const result = await db.query(   
        `SELECT m.id,
                m.to_username,
                u.first_name,
                u.last_name,
                u.phone,
                m.body,
                m.sent_at,
                m.read_at
          FROM messages AS m
            JOIN users AS u ON m.to_username = u.username
          WHERE from_username = $1`,
        [username]);

    return result.rows.map(m => ({
      id: m.id,
      to_user: {
        username: m.to_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at
    }));
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(
        `SELECT m.id,
                m.from_username,
                u.first_name,
                u.last_name,
                u.phone,
                m.body,
                m.sent_at,
                m.read_at
          FROM messages AS m
           JOIN users AS u ON m.from_username = u.username
          WHERE to_username = $1`,
        [username]);

    return result.rows.map(m => ({
      id: m.id,
      from_user: {
        username: m.from_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at
    }));
  }
}


module.exports = User;

