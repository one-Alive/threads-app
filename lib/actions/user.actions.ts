"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import mongoose, { FilterQuery, model, SortOrder } from "mongoose";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
  } catch (error: any) {
    console.log(error);
  }
  if (path === "/profile/edit") {
    revalidatePath(path);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`FAILED TO FETCH USER : ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    const thread = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      })
      .sort({ createdAt: "desc" });
    return thread;
  } catch (error: any) {
    console.log(`ERROR FETCHING POSTSSSS ${error.message}`);
  }
}

export async function fecthUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };
    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);
    const users = await userQuery.exec();
    const isNext = totalUserCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    console.log(`ERROR ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThread = await Thread.find({ author: userId });

    const childThreadIds = userThread.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image userId",
    });

    return replies
  } catch (e: any) {
    throw new Error(`ERROR : ${e.message}`);
  }
}
