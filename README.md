Got it — if you want to store **all core entities** in **MongoDB** (either as the main store or as a cache in the Node.js BFF), here’s a **MongoDB schema design** using Mongoose-style definitions.

---

## **1. User Collection**

```ts
{
  _id: ObjectId,
  authId: String, // From Auth0/Clerk
  email: { type: String, unique: true, required: true },
  fullName: String,
  role: { type: String, enum: ["customer", "businessAdmin"], default: "customer" },
  profile: ObjectId, // Reference to Profile
  createdAt: Date,
  updatedAt: Date
}
```

---

## **2. Profile Collection**

```ts
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  phoneNumber: String,
  addresses: [ObjectId], // References to Address
  profileImage: String, // URL
  createdAt: Date,
  updatedAt: Date
}
```

---

## **3. Address Collection**

```ts
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## **4. Product Collection**

```ts
{
  _id: ObjectId,
  name: String,
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  inventory: Number,
  category: ObjectId, // Reference to Category
  images: [String], // URLs
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## **5. Category Collection**

```ts
{
  _id: ObjectId,
  name: String,
  slug: { type: String, unique: true },
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## **6. Order Collection**

```ts
{
  _id: ObjectId,
  orderNumber: String,
  user: ObjectId, // Reference to User
  items: [
    {
      product: ObjectId, // Reference to Product
      quantity: Number,
      price: Number // Price at purchase time
    }
  ],
  totalAmount: Number,
  status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
  payment: ObjectId, // Reference to Payment
  tracking: ObjectId, // Reference to Tracking
  createdAt: Date,
  updatedAt: Date
}
```

---

## **7. Payment Collection**

```ts
{
  _id: ObjectId,
  order: ObjectId, // Reference to Order
  method: { type: String, enum: ["creditCard", "debitCard", "upi", "netBanking", "wallet"] },
  transactionId: String,
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  amount: Number,
  currency: String,
  paidAt: Date,
  createdAt: Date
}
```

---

## **8. Tracking Collection**

```ts
{
  _id: ObjectId,
  order: ObjectId, // Reference to Order
  trackingNumber: String,
  carrier: String,
  status: { type: String, enum: ["processing", "shipped", "inTransit", "delivered"], default: "processing" },
  estimatedDelivery: Date,
  history: [
    {
      status: String,
      date: Date,
      location: String
    }
  ],
  createdAt: Date
}
```

---

## **9. Banner / Offer Collection**

```ts
{
  _id: ObjectId,
  title: String,
  image: String, // URL
  link: String,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date
}
```

---

## **Relationship Overview**

```
User → Profile (1:1)
User → Address (1:N)
User → Order (1:N)
Order → OrderItem (Embedded in Order)
Order → Payment (1:1)
Order → Tracking (1:1)
Product → Category (N:1)
```

---

If we use MongoDB **with Strapi**, then MongoDB would store **the same schema inside Strapi**, and your Node.js BFF would just query it via Strapi’s REST/GraphQL API.
If we use MongoDB **outside Strapi**, then your BFF would store products here (e.g., caching from Strapi) and serve them directly.

---

If you want, I can now create a **MongoDB + Strapi hybrid model** where products live in Strapi but orders/payments live in MongoDB for better control and performance.
That’s the architecture most B2B e-comms use.

Do you want me to make that hybrid version?
