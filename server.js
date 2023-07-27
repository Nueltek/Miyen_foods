import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import  dotenv  from "dotenv"
import stripe from "stripe"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc,  updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARIm3oun3kA__y5c9Tof7VZ8072JFov5g",
  authDomain: "miyenfoodsblog.firebaseapp.com",
  databaseURL: "https://miyenfoodsblog-default-rtdb.firebaseio.com",
  projectId: "miyenfoodsblog",
  storageBucket: "miyenfoodsblog.appspot.com",
  messagingSenderId: "956097013175",
  appId: "1:956097013175:web:ab9b03253142878c393432"
};

// load dotenv variable
dotenv.config()
console.log('process env', process.env['STRIPE_SECRET'])  


const validateEmail = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};
const __dirname = process.cwd();


const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const firebaseApp = initializeApp(firebaseConfig); // Initialize the Firebase app
const db = getFirestore(firebaseApp); // Access Firestore using the initialized app

// success and cancel routes
app.get("/success", (req, res) => {
  res.sendFile("success.html", { root: "public" });
});
app.get("/cancel", (req, res) => {
  res.sendFile("cancel.html", { root: "public" });
});

// integrating stripe payment gateway
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

// create stripe post request
app.post('/stripe-checkout', async function(req, res) {
  const items = req.body.items;
  const shippingFee = req.body.shippingFee; // Additional shipping fee to be added

  // Calculate total amount including shipping fees
  const totalAmount = items.reduce((total, item) => (total + (item.price * 100 * item.qty)), 0) + (shippingFee * 100);

  const lineItems = items.map((item) => {
    const unitAmount = item.price * 100;
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.img]
        },
        unit_amount: unitAmount,
      },
      quantity: item.qty,
    }
  });

  // Add shipping fee as a line item
  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Shipping Fee',
      },
      unit_amount: shippingFee * 100,
    },
    quantity: 1,
  });

  try {
    // Create checkout session
    const session = await stripeGateway.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
      line_items: lineItems,
      billing_address_collection: "required"
    });

    res.json( session.url );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the Checkout session." });
  }
});





app.get("/products", (req, res) => {
  res.sendFile("products.html", { root: "public" });
});
app.get("/about", (req, res) => {
  res.sendFile("about.html", { root: "public" });
});
app.get("/contact", (req, res) => {
  res.sendFile("contactpage.html", { root: "public" });
});
app.get("/blog", (req, res) => {
  res.sendFile("blogpage.html", { root: "public" });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: __dirname + "/public" });
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: __dirname + "/public" });
});

app.get("/cart", (req, res) => {
  res.sendFile("viewCart.html", { root: __dirname + "/public" });
});

app.get("/admin", (req, res) => {
  res.sendFile("admin.html", { root: "public" });
});

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, termsCheckbox } = req.body;

  // form validation
  if (!firstName) {
    res.json({ alert: "First name is required" }); 
  } else if (!lastName) {
    res.json({ alert: "Last name is required" });
  } else if (!email) {
    res.json({ alert: "Email is required" });
  } else if (!validateEmail(email)) {
    res.json({ alert: "Invalid email address" });
  } else if (!password) {
    res.json({ alert: "Password is required" });
  } else if (password !== confirmPassword) {
    res.json({ alert: "Passwords do not match" });
  } else if (!termsCheckbox) {
    res.json({ alert: "Please agree to the terms and conditions" });
  } else {
    const responseData = {
      message: "Signup successful",
      firstName,
      lastName,
      email,
    };
    const users = collection(db, "users")
    getDoc(doc(users, responseData.email)).then(user => {
        if(user.exists()){
            return res.json({ alert: "Sorry, but that email is already associated with an account." })
        } else {
            // encrypt the password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(confirmPassword, salt, function(error, hash){
                req.body.confirmPassword = hash;

                // encrypt the original password
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(password, salt, function(error, hash){
                    req.body.password = hash;

                    // set the doc
                    setDoc(doc(users, email), req.body).then(data => {
                      res.json({
                        name: req.body.firstName,
                        email: req.body.email
                      });
                    });
                  });
                });
              });
            });
        }
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  const users = collection(db, "users");
  getDoc(doc(users, email))
    .then((user) => {
      if (!user.exists()) {
        return res.json({
          alert: "Email does not exist. Please check your email and try again.",
        });
      }

      return bcrypt.compare(password, user.data().password)
        .then((passwordMatch) => {
          if (passwordMatch) {
            const data = user.data();
            return res.json({
              name: data.firstName,
              email: data.email,
            });
          } else {
            return res.json({ alert: "Password is incorrect." });
          }
        });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ alert: "An error occurred. Please try again later." });
    });
});  



app.get("*", (req, res) => {
  res.sendFile("404.html", { root: "public" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));