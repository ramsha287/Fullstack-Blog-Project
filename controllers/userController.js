const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Post = require("../models/Post");
const { post } = require("../routes/authRoutes");
const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");

//get user profile
exports.getUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.render("login", {
            title: "Login",
            user,
            error: "User not found",
            success: "",
        });
    }
    //fetch user's posts
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.render("profile", {
        title: "Profile",
        user,
        posts,
        error: "",
        success: "",
        postCount: post.length,
    });

});

//get edit profile form
exports.getEditProfileForm = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.render("login", {
            title: "Login",
            user,
            error: "User not found",
            success: "",
        });
    }
    res.render("editProfile", {
        title: "Edit Profile",
        user,
        error: "",
        success: "",
    });
}); 


//update profile
exports.updateUserProfile = expressAsyncHandler(async (req, res) => {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
        return res.status(404).render("login", {
            title: "Login",
            error: "User not found",
            success: "",
        });
    }

    // Update basic fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    // Handle profile picture upload
    if (req.file) {
        try {
            // Delete old image if exists
            if (user.profilePicture?.public_id) {
                await cloudinary.uploader.destroy(user.profilePicture.public_id);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_pictures',
                width: 500,
                height: 500,
                crop: 'fill'
            });

            // Update user profile picture
            user.profilePicture = {
                url: result.secure_url,
                public_id: result.public_id
            };

        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).render("editProfile", {
                title: "Edit Profile",
                user,
                error: "Error uploading image",
                success: "",
            });
        }
    }

    await user.save();
    res.render("editProfile", {
        title: "Edit Profile",
        user,
        error: "",
        success: "Profile updated successfully",
    });
});

//delete user account
exports.deleteUserAccount = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).render("login", {
            title: "Login",
            error: "User not found",
            success: "",
        });
    }

    // Delete user profile picture
    if (user.profilePicture && user.profilePicture.public_id) {
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    // Delete all posts created by the user along with their associated images and comments
    const posts = await Post.find({ author: req.user._id });

    for (const post of posts) {
        for (const image of post.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }
        await Comment.deleteMany({ post: post._id });
        await Post.findByIdAndDelete(post._id);
    }

    // Delete files uploaded by the user
    const files = await File.find({ uploaded_by: req.user._id });
    for (const file of files) {
        await cloudinary.uploader.destroy(file.public_id);
        await File.findByIdAndDelete(file._id);
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    // Redirect to registration page
    res.redirect("/auth/register");
});
