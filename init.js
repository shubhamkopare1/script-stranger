require('dotenv').config();
let Book =require("./models/book")
let mongoose = require("mongoose");
const StudentData = require("./models/studentData");
const dbUrl = process.env.MONGO_URL;
// "mongodb://127.0.0.1:27017/books"
async function main(){
    await mongoose.connect(dbUrl)
}
main().then(()=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
})
const booksData = [
    {
      title: ["Engineering Physics By M. N. Avadhanulu", "First year books"],
      book: "10",
      location: "Rack 1, Shelf 4",
      description: "A Textbook of Engineering Physics...",
      image: "https://m.media-amazon.com/images/I/516tWnCK01L._SY342_.jpg",
      author: "M N Avadhanulu, TVS Arun Murthy & P G Kshirsagar",
      language: "English",
      blockNumber: 9,  
      rackNumber: 4,    
      shelfNumber: 9,   
      info: "This book provides a detailed introduction to engineering physics.\n"
            + "It covers topics like optics, waves, and modern physics applications.\n"
            + "Includes solved examples and numerical problems for practice.\n"
            + "Recommended for first-year engineering students."
    },
    {
      title: ["Engineering Mathematics", "First year books"],
      book: "10",
      location: "Rack 2, Shelf 4",
      description: "A comprehensive book on Engineering Mathematics...",
      image: "https://m.media-amazon.com/images/I/41LaegfnWnL._SY445_SX342_.jpg",
      author: "K.A. Stroud",
      language: "English",
      blockNumber: 1,  
      rackNumber: 4,    
      shelfNumber: 9,   
      info: "This book provides step-by-step explanations of math concepts.\n"
            + "Topics include calculus, algebra, and differential equations.\n"
            + "It is designed with self-assessment exercises for learning.\n"
            + "Highly recommended for engineering students."
    },
    {
      title: ["Programming in C", "First year books"],
      book: "10",
      location: "Rack 3, Shelf 4",
      description: "A comprehensive textbook on programming in C...",
      author: "Stephen G. Kochan",
      image: "https://m.media-amazon.com/images/I/51CxmVYKYsL._SY445_SX342_.jpg",
      blockNumber: -9,  
      rackNumber: 4,   
      shelfNumber: 9,  
      info: "C Programming book for beginners with real-world examples.\n"
            + "Covers data types, functions, pointers, and file handling.\n"
            + "Includes practice problems and debugging techniques.\n"
            + "Perfect for first-year computer science students."
    },
    {
      title: ["Operating System Concepts", "Second year books"],
      book: "10",
      location: "Rack 5, Shelf 4",
      description: "A textbook on operating system concepts...",
      image: "https://m.media-amazon.com/images/I/41+TH+OFZCL._SY445_SX342_.jpg",
      author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne",
      blockNumber: 1,  
      rackNumber: 4,   
      shelfNumber: 1,  
      info: "Explains core OS concepts like memory management & scheduling.\n"
            + "Detailed study of process synchronization and file systems.\n"
            + "Includes real-world case studies and UNIX examples.\n"
            + "Recommended for second-year CS & IT students."
    },
  
  
  {
    title: ["Introduction to Machine Learning", "Third year books"],
    book: "10",
    location: " Rack 7, Shelf 4",
    description: "A textbook on machine learning...",
    image: "https://m.media-amazon.com/images/I/41WlwEGIkEL._SY445_SX342_.jpg",
    author: "Ethem Alpaydin",
    blockNumber: 9,  // ✅ Block 3
    rackNumber: 4,   // ✅ Rack 2
    shelfNumber: -6,  // ✅ Shelf 1
    info: "This book covers fundamental machine learning concepts..."
  }
];

   


  const studentsData = [
    {
      studentId: "c",
      name: "Shubham Kopare",
      branch: "Information Technology",
      contact: "8485029672",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"shubhamkopare2004@gmail.com"
    },
    {
      studentId: "TBT22110",
      name: "tannu goswami",
      branch: "Information Technology",
      contact: "9665675747",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"kopareshubham60@gmail.com"
      
    },
    {
      studentId: "TBT22208",
      name: "yash gaidhane",
      branch: "Information Technology",
      contact: "8485029672",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"gaidhaneyash9@gmail.com"
    },
    {
      studentId: "TBT22110",
      name: "vebv rakhde",
      branch: "Information Technology",
      contact: "8485029673",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"vaibhaokopare45@gmail.com"
    },
    
  ];
  
 
  
// Clear and insert books data
Book.deleteMany({})
  .then(() => {
    return Book.insertMany(booksData);
  })
  .then(insertedDocuments => {
    console.log("Books data cleared and new documents inserted:", insertedDocuments.length);
    console.log("Books data saved successfully.");
  })
  .catch(error => {
    console.error("Error inserting book documents:", error);
  });

// Clear and insert student data
StudentData.deleteMany({})
  .then(() => {
    return StudentData.insertMany(studentsData);
  })
  .then(insertedDocuments => {
    console.log("Student data cleared and new documents inserted:", insertedDocuments.length);
    console.log("Student data saved successfully.");
  })
  .catch(error => {
    console.error("Error inserting student documents:", error);
  });




  