"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  path: string;
}
export async function createThread({
  text,
  author,
  path,
}: Params) {
  try {
    connectToDB();
    const createThread = await Thread.create({
      text,
      author,
    });

    //update user model

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.error(`ERROR CREATING THREAD:  ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();
  const skipAmount = (pageNumber - 1) * pageSize;
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })

  const totalPostCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          { path: "author", model: User, select: "_id id name parentId image" },
          {
            path: "children",
            model: User,
            select: "_id id name parentId image",
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    console.log(`Error fetching thread : ${error.message}`);
  }
}

export async function addComments(
  threadId: String,
  commentText: String,
  userId: String,
  path: string
) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thead not found...");
    }
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    console.log(`Error Posting comment ${error.message}..`);
  }
}
