const Post = require("../models/Post");
asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");



//add comment
exports.addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    //find the post
    const post = await Post.findById(postId);
    //validation
    if (!post){
        return res.render("postDetail", {
            title: "Post",
            user: req.user,
            post,
            error: "Post not found",
            success: "",
        });
    }
    
    if (!content) {
        return res.render("postDetail", {
            title: "Post",
            user: req.user,
            post,
            error: "Please add comment",
            success: "",
        });
    }

    //save comment
    const comment = new Comment({
        content,
        post: postId,
        author: req.user._id,
    });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    console.log(post);
    
    //redirect
    res.redirect(`/posts/${postId}`);
});

//get comment form
exports.getCommentForm = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetail", {
            title: "Comment",
            user: req.user,
            comment,
            error: "Comment not found",
            success: "",
        });
    }
    res.render("editComment", {
        title: "Comment",
        user: req.user,
        comment,
        error: "",
        success: "",
    });
});

//update comment
exports.updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetail", {
            title: "Comment",
            user: req.user,
            comment,
            error: "Comment not found",
            success: "",
        });
    }
    if (comment.author.toString() !== req.user._id.toString()){
        return res.render("postDetail", {
            title: "Comment",
            user: req.user,
            comment,
            error: "You are not authorized to edit this comment",
            success: "",
        });
    }
    comment.content = content || comment.content;
    await comment.save();
    res.redirect(`/posts/${comment.post}`);
});

//delete comment
exports.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.render("postDetail", {
            title: "Comment",
            user: req.user,
            comment,
            error: "Comment not found",
            success: "",
        });
    }
    if (comment.author.toString() !== req.user._id.toString()){
        return res.render("postDetail", {
            title: "Comment",
            user: req.user,
            comment,
            error: "You are not authorized to delete this comment",
            success: "",
        });
    }   
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/posts/${comment.post}`);
});