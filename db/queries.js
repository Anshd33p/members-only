const pool = require('./pool');

exports.createUser = async (firstName,lastName,username,password) => {
    const query = `
        INSERT INTO users (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const values = [firstName, lastName, username, password];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0].id; // Return the newly created user's ID
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
}

exports.membershipStatus = async (userId) => {
    const query = `
        SELECT member FROM users WHERE id = $1;
    `;
    const values = [userId];
    
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0].member; // Return the membership status
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
}

exports.updateMembershipStatus = async (userId, status) => {
    const query = `
        UPDATE users SET member = $1 WHERE id = $2;
    `;
    const values = [status, userId];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
}

exports.updateAdminStatus = async (userId, status) => {
    const query = `
        UPDATE users SET admin = $1 WHERE id = $2;
    `;
    const values = [status, userId];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
}

exports.getAllMessages = async () => {
   const query = `
        SELECT posts.*, users.first_name, users.last_name 
        FROM posts 
        JOIN users ON posts.author_id = users.id 
        ORDER BY posts.created_at DESC
    `;

    try {
        const result = await pool.query(query);
        return result.rows; // Return all messages
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
};
exports.getMessages = async () => {
   const query = `
        SELECT *
        FROM posts 
        ORDER BY posts.created_at DESC
    `;

    try {
        const result = await pool.query(query);
        return result.rows; // Return all messages
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
};

exports.createMessage = async (title, content, authorId) => {
    const query = `
        INSERT INTO posts (title, content, author_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;
    `;
    const values = [title, content, authorId];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the complete newly created post
    } catch (error) {
        throw error;
    }
};

exports.getMessageById = async (messageId) => {
    const query = `
        SELECT * FROM posts WHERE id = $1;
    `;
    const values = [messageId];
    
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0]; // Return the message if found
        } else {
            throw new Error('Message not found');
        }
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
}

exports.deleteMessage = async (messageId) => {
    const query = `
        DELETE FROM posts WHERE id = $1;
    `;
    const values = [messageId];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        throw error; // Propagate the error to be handled by the controller
    }
};