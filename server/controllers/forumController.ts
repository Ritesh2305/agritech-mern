import { Request, Response, NextFunction } from 'express';
import { PostModel, ActivityLogModel, isMongoConnected } from '../models/index.ts';
import { fallbackStore } from '../state.ts';

// @desc    Get all forum posts with search/tag filter
// @route   GET /api/v1/forum
// @access  Public (or Authenticated)
export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, tag } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (tag) {
        query.tags = tag;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }
      const posts = await PostModel.find(query)
        .populate('author', 'name role')
        .populate('comments.author', 'name role')
        .sort({ createdAt: -1 });

      res.json({ success: true, count: posts.length, data: posts });
      return;
    }

    let posts = [...fallbackStore.posts];
    if (category && category !== 'all') {
      posts = posts.filter((p: any) => p.category === category);
    }
    if (tag) {
      posts = posts.filter((p: any) => p.tags?.includes(String(tag)));
    }
    if (search) {
      const s = String(search).toLowerCase();
      posts = posts.filter((p: any) => p.title?.toLowerCase().includes(s) || p.content?.toLowerCase().includes(s));
    }
    posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single forum post by ID
// @route   GET /api/v1/forum/:id
// @access  Public (or Authenticated)
export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const post = await PostModel.findById(id)
        .populate('author', 'name role')
        .populate('comments.author', 'name role');
      if (!post) {
        res.status(404).json({ success: false, message: 'Forum post not found' });
        return;
      }
      res.json({ success: true, data: post });
      return;
    }

    const post = fallbackStore.posts.find((p: any) => p._id === id || p.id === id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Forum post not found' });
      return;
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new forum post
// @route   POST /api/v1/forum
// @access  Private
export const createPost = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category, tags } = req.body;
    const authorId = req.user?.id || req.user?._id;
    const authorName = req.user?.name || 'Farmer';
    const authorRole = req.user?.role || 'farmer';

    if (isMongoConnected()) {
      const newPost = await PostModel.create({
        author: authorId,
        title,
        content,
        category: category || 'General Discussion',
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
        likes: [],
        comments: [],
      });
      const populated = await newPost.populate('author', 'name role');

      await ActivityLogModel.create({
        user: authorId,
        action: 'FORUM_POST_CREATED',
        details: `Created forum post: "${title}"`,
      });

      res.status(201).json({ success: true, data: populated });
      return;
    }

    const newPost = {
      _id: 'post-' + Date.now(),
      id: 'post-' + Date.now(),
      author: {
        _id: authorId,
        name: authorName,
        role: authorRole,
      },
      title,
      content,
      category: category || 'General Discussion',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackStore.posts.unshift(newPost);
    fallbackStore.activityLogs.unshift({
      _id: 'log-' + Date.now(),
      id: 'log-' + Date.now(),
      user: { _id: authorId, name: authorName, email: req.user?.email || '' },
      userName: authorName,
      userRole: authorRole,
      action: 'FORUM_POST_CREATED',
      details: `Created forum post: "${title}"`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to forum post
// @route   POST /api/v1/forum/:id/comments
// @access  Private
export const addComment = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user?.id || req.user?._id;
    const authorName = req.user?.name || 'Farmer';
    const authorRole = req.user?.role || 'farmer';

    if (isMongoConnected()) {
      const post = await PostModel.findById(id);
      if (!post) {
        res.status(404).json({ success: false, message: 'Forum post not found' });
        return;
      }

      post.comments.push({
        author: authorId,
        content,
        createdAt: new Date(),
      } as any);

      await post.save();
      const populated = await PostModel.findById(id)
        .populate('author', 'name role')
        .populate('comments.author', 'name role');

      res.status(201).json({ success: true, data: populated });
      return;
    }

    const post = fallbackStore.posts.find((p: any) => p._id === id || p.id === id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Forum post not found' });
      return;
    }

    const comment = {
      _id: 'comm-' + Date.now(),
      id: 'comm-' + Date.now(),
      author: {
        _id: authorId,
        name: authorName,
        role: authorRole,
      },
      content,
      createdAt: new Date().toISOString(),
    };

    if (!post.comments) post.comments = [];
    post.comments.push(comment);

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on forum post
// @route   PUT /api/v1/forum/:id/like
// @access  Private
export const likePost = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (isMongoConnected()) {
      const post = await PostModel.findById(id);
      if (!post) {
        res.status(404).json({ success: false, message: 'Forum post not found' });
        return;
      }

      const stringLikes = post.likes.map((l: any) => l.toString());
      const hasLiked = stringLikes.includes(userId.toString());

      if (hasLiked) {
        post.likes = post.likes.filter((l: any) => l.toString() !== userId.toString());
      } else {
        post.likes.push(userId);
      }

      await post.save();
      const populated = await PostModel.findById(id)
        .populate('author', 'name role')
        .populate('comments.author', 'name role');

      res.json({
        success: true,
        liked: !hasLiked,
        likesCount: post.likes.length,
        data: populated,
      });
      return;
    }

    const post = fallbackStore.posts.find((p: any) => p._id === id || p.id === id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Forum post not found' });
      return;
    }

    if (!post.likes) post.likes = [];
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((l: any) => l !== userId);
    } else {
      post.likes.push(userId);
    }

    res.json({
      success: true,
      liked: !hasLiked,
      likesCount: post.likes.length,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate / delete post (Admin or Author)
// @route   DELETE /api/v1/forum/:id
// @access  Private (Admin or Post Author)
export const moderatePost = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;
    const role = req.user?.role;

    if (isMongoConnected()) {
      const post = await PostModel.findById(id);
      if (!post) {
        res.status(404).json({ success: false, message: 'Post not found' });
        return;
      }

      if (role !== 'admin' && post.author.toString() !== userId.toString()) {
        res.status(403).json({ success: false, message: 'Not authorized to moderate this post' });
        return;
      }

      await PostModel.findByIdAndDelete(id);

      await ActivityLogModel.create({
        user: userId,
        action: 'FORUM_POST_DELETED',
        details: `Deleted forum post ID ${id} (${role === 'admin' ? 'by Admin moderation' : 'by Author'})`,
      });

      res.json({ success: true, message: 'Post deleted successfully' });
      return;
    }

    const postIndex = fallbackStore.posts.findIndex((p: any) => p._id === id || p.id === id);
    if (postIndex === -1) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const post = fallbackStore.posts[postIndex];
    const postAuthorId = post.author?._id || post.author?.id || post.author;
    if (role !== 'admin' && postAuthorId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to moderate this post' });
      return;
    }

    fallbackStore.posts.splice(postIndex, 1);
    fallbackStore.activityLogs.unshift({
      _id: 'log-' + Date.now(),
      id: 'log-' + Date.now(),
      user: { _id: userId, name: req.user?.name || 'User', email: req.user?.email || '' },
      userName: req.user?.name || 'User',
      userRole: role,
      action: 'FORUM_POST_DELETED',
      details: `Deleted forum post ID ${id} (${role === 'admin' ? 'by Admin moderation' : 'by Author'})`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
