const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
	try {
		const { title, content, author } = req.body;
		const newPost = new Post({ title, content, author });
		await newPost.save();
		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


router.get('/before/:timestamp', auth, async (req, res) => {
	try {
		const { timestamp } = req.params;
		const limit = 10;

		const posts = await Post.find({ createdAt: { $lt: timestamp } })
			.sort({ createdAt: -1 })
			.limit(limit);

		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});



router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 });
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: 'Post non trouvé' });
		res.json(post);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id);
		if (!post) return res.status(404).json({ message: 'Post non trouvé' });
		res.json({ message: 'Post supprimé' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
