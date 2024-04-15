const { response } = require("../app");
const client = require("../db/connection");
const dbString = process.env.NODE_ENV || "production";
const db = client.db(`${dbString}`);
const rescues = db.collection("rescues");
const fs = require("fs/promises");

const postRescue = async (data) => {
  try {
    if (
      typeof data.email !== "string" ||
      typeof data.injury !== "string" ||
      typeof data.animal !== "string" ||
      typeof data.name !== "string" ||
      !data.hasOwnProperty("location")
    ) {
      return Promise.reject({ msg: "details required not completed" });
    }
    if (data.animal === "Mammal") {
      data.img =
        "https://images.pexels.com/photos/3616232/pexels-photo-3616232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    }
    if (data.animal === "Reptile") {
      data.img =
        "https://images.pexels.com/photos/33321/iguana-white-background-reptile.jpg?auto=compress&cs=tinysrgb&w=600";
    }
    if (data.animal === "Bird") {
      data.img =
        "https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    }
    await rescues.insertOne(data);
  } catch (error) {
    console.log(error);
  }
};

const fetchRescues = async (name) => {
  try {
    let response;
    if (name) {
      response = await rescues.find({ name: name }).toArray();
    }
    if (!name) {
      response = await rescues.find({}).toArray();
    }
    if (response === null) return Promise.reject({ msg: "Not found" });
    if (response.length === 0)
      return Promise.reject({ msg: "there are no rescues under this name" });

    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postRescue, fetchRescues };
