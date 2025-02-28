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
  //first year
  {
    title: ["Engineering Physics By M. N. Avadhanulu","First year books"],
    book:"10",
   location : "block 1  top row starting ",
    description: "A Textbook of Engineering Physics has been written primarily for the first year undergraduate students of engineering and also those of bachelors in sciences while also serving as a reference text for technologies and practitioners.",
    image: "https://m.media-amazon.com/images/I/516tWnCK01L._SY342_.jpg",
  
    author: "M N Avadhanulu, TVS Arun Murthy & P G Kshirsagar",
    language: "English",
    latitude: 28.618, 
    longitude: 77.108,

    info: "A Textbook of Engineering Physics' has been written primarily for the first year undergraduate students of engineering and also those of bachelors in sciences while also serving as a reference text for technologies and practitioners. The book explains all the relevant and important topics related to physics in an easy-to-understand manner. Fifty chapters, beginning with a detailed discussion on oscillation and waves, the book goes on to discuss semiconductors, optical fibers, lasers, nanotechnology, and liquid crystals. A book which has seen, foreseen and incorporated changes in the subject for more than 25 years, it continues to be one of the most sought-after texts by the students."
  },
  {
    title: ["Engineering Mathematics","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    category: "First year books",
    description: "A comprehensive book on Engineering Mathematics suitable for first-year students. It covers topics such as calculus, differential equations, linear algebra, and more.",
    image: "https://m.media-amazon.com/images/I/41LaegfnWnL._SY445_SX342_.jpg",

    author: "K.A. Stroud",
   
    language: "English",
    latitude: 28.619, 
    longitude: 77.109,
   
    info: "This book is designed to provide a solid foundation in engineering mathematics for first-year students. It offers clear explanations of mathematical concepts and includes numerous examples and exercises to reinforce learning."
  },
  {
    title: ["Programming in C","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A comprehensive textbook on programming in the C language covering topics such as variables, control structures, functions, arrays, pointers, and file handling.",
    author: "Stephen G. Kochan",
    latitude: 28.611, 
    longitude: 77.101,
    image: "https://m.media-amazon.com/images/I/51CxmVYKYsL._SY445_SX342_.jpg",
   
    info: "This book offers a thorough introduction to programming in the C language. It covers basic to advanced concepts, with practical examples and exercises to reinforce learning."
  },
  {
    title: ["Chemistry for Engineers","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    category: "First year books",
    description: "An introductory textbook on chemistry tailored for engineering students. It covers basic concepts such as atomic structure, chemical bonding, and reactions.",
    image: "https://m.media-amazon.com/images/I/61krAkI101L._SY466_.jpg",
  
    author: "John T. Moore",
    latitude: 28.612, 
    longitude: 77.102,
    language: "English",
    
    info: "This book provides a fundamental understanding of chemistry concepts essential for engineering students. It emphasizes the practical applications of chemistry in engineering disciplines."
  },


  {
    title: ["Engineering Drawing","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A comprehensive guide to engineering drawing covering topics such as orthographic projection, isometric projection, and CAD software.",
    image: "https://m.media-amazon.com/images/I/5141vAW5lrL._SY445_SX342_.jpg",

    author: "N.D. Bhatt",
    latitude: 28.613, 
    longitude: 77.103,
    language: "English",
  
    info: "This book is designed to develop the drawing skills of engineering students. It covers both manual drafting techniques and computer-aided design (CAD) software."
  },
  {
    title: ["Introduction to Programming","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    description: "An introductory textbook on programming suitable for first-year students. It covers basic programming concepts using a popular programming language.",
    image: "https://m.media-amazon.com/images/I/81V-itCvcQL._SY466_.jpg",

    author: "John Doe",
    latitude: 28.614, 
    longitude: 77.104,
    language: "English",
   
    info: "This book introduces students to programming concepts such as variables, control structures, functions, and data types. It uses a step-by-step approach to teach programming principles."
  },
  {
    title: ["Introduction to Electrical Engineering","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    description: "An introductory textbook on electrical engineering covering topics such as circuits, electromagnetism, and electrical machines.",
    image: "https://m.media-amazon.com/images/I/41qm5I91LFL._SY445_SX342_.jpg",
  
    author: "Vincent Del Toro",
  
    language: "English",
   
    info: "This book provides a solid foundation in electrical engineering principles for first-year students. It includes practical examples and exercises to reinforce learning."
  },
  {
    title: ["Fundamentals of Materials Science and Engineering","First year books"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A comprehensive textbook on materials science and engineering covering topics such as atomic structure, phase diagrams, and mechanical properties.",
    image: "	https://m.media-amazon.com/images/I/91yoBgwCkML._SY466_.jpg",
    
    author: "William D. Callister Jr.",
    latitude: 28.615, 
    longitude: 77.105,
    language: "English",
 
    info: "This book introduces students to the fundamentals of materials science and engineering. It emphasizes the relationship between structure, properties, processing, and performance of materials."
  },
  // secod year books 
  {
    title: ["Introduction to Algorithms","Second year books CSE, IT,DS"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A comprehensive textbook on algorithms covering topics such as sorting, searching, and graph algorithms.",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
   
    latitude: 28.616, 
    longitude: 77.106,
    image: "https://m.media-amazon.com/images/I/61O5SsbL8HL._SY466_.jpg",
 
    info: "This book provides a thorough introduction to algorithms commonly used in computer science. It covers both theoretical concepts and practical implementations with numerous examples and exercises."
  },
  {
    title: ["Database Management Systems","Second year books CSE, IT ,DS"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A textbook on database management systems covering topics such as relational databases, SQL, and database design.",
    author: "Raghu Ramakrishnan, Johannes Gehrke",
    latitude: 28.617, 
    longitude: 77.107,
    image: "https://m.media-amazon.com/images/I/61CUat-cJJL._SY466_.jpg",
  
    info: "This book offers a comprehensive introduction to database management systems. It covers both fundamental and advanced concepts, with a focus on practical applications and real-world scenarios."
  },
  {
    title: ["Operating System Concepts","Second year books CSE, IT ,DS"],
    book:"10",
    location : "block 1  top row starting ",
    description: "An introductory textbook on operating system concepts covering topics such as process management, memory management, and file systems.",
    author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne",
    latitude: 28.621, 
    longitude: 77.111,
    image: "https://m.media-amazon.com/images/I/41+TH+OFZCL._SY445_SX342_.jpg",
 
    info: "This book provides a solid foundation in the principles of operating systems. It covers both theoretical concepts and practical aspects, with numerous examples and exercises to reinforce learning."
  },
  {
    title: ["Introduction to Programming with Python","Second year books CSE, IT ,DS"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A beginner's textbook on programming using Python covering topics such as variables, control flow, functions, and data structures.",
    author: "John Zelle",
    latitude: 28.618, 
    longitude: 77.108,
    image: "https://m.media-amazon.com/images/I/419NS17nPKL._SY445_SX342_.jpg",
   
    info: "This book provides a gentle introduction to programming concepts using Python. It covers basic programming constructs and problem-solving techniques, with hands-on exercises and examples."
  },
  {
    title: ["Discrete Mathematics and Its Applications","Second year books CSE, IT ,DS"],
    book:"10",
    location : "block 1  top row starting ",
    description: "A textbook on discrete mathematics covering topics such as logic, set theory, combinatorics, and graph theory.",
    author: "Kenneth H. Rosen",
    latitude: 28.622, 
    longitude: 77.112,
    image: "https://m.media-amazon.com/images/I/51E75M0Rm5L._SY445_SX342_.jpg",
   

    info: "This book offers a comprehensive introduction to discrete mathematics concepts and their applications. It covers both theoretical foundations and practical problem-solving techniques, with numerous examples and exercises."
  },
  

  ];
   


  const studentsData = [
    {
      studentId: "TBT22385",
      name: "Shubham Kopare",
      branch: "Information Technology",
      contact: "8485029672",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"shubhamkopare2004@gmail.com"
    },
    {
      studentId: "TBT22110",
      name: "chagan rakhde",
      branch: "Information Technology",
      contact: "9665675747",
      college: "Tulsiram Gaikwad Patil College Of Engineering Nagpur",
      email:"chhaganrakhade7@gmail.com"
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




  