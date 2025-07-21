const db = require("../db/queries");


const getMembersOnlyPage = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.redirect('/login');
        }

        // Get all messages
        const messages = await db.getAllMessages();
        
        res.render('members-only', {
            title: 'Members Only Area',
            user: req.user,
            messages: messages,
            
            error: null
        });
    } catch (error) {
        console.error('Error loading members page:', error);
        res.status(500).send('Internal Server Error');
    }
};

const addMessage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!title || !content) {
           const messages = await db.getAllMessages();
            return res.render('members-only', {
                title: 'Members Only Area',
                user: req.user,
                messages: messages,
                error: 'Title and content are required'
            });
        }

        // Add message to the database
        await db.createMessage( title, content, userId );

        // Redirect to the members-only page
        res.redirect('/members-only');
    } catch (error) {
        console.error('Error adding message:', error);
        const messages = await db.getAllMessages();
        res.render('members-only', {
            title: 'Members Only Area',
            user: req.user,
            messages: messages,
            error: 'Failed to add message'
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;
        const isAdmin = req.user.admin;
        const message = await db.getMessageById(messageId);

        if( isAdmin || message.author_id === userId ) {
            await db.deleteMessage(messageId);
        }
        res.redirect('/members-only');
    } catch (error) {
        console.error('Error deleting message:', error);
        const messages = await db.getAllMessages();
        res.render('members-only', {
            title: 'Members Only Area',
            user: req.user,
            messages: messages,
            error: 'Failed to delete message'
        });
    }
};

module.exports = {
  getMembersOnlyPage,
  addMessage,
    deleteMessage
};