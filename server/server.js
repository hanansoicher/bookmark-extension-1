import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bookmarkRoutes from 'bookmarkRoutes';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

const dbURI = 'mongodb+srv://hanansoicher:8dtexzzQ76xJAo2o@research-trails.iiphcag.mongodb.net/';

connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use('/api/bookmarks', bookmarkRoutes);
