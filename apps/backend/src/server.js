import express from 'express';
import cors from 'cors';

// Route imports
import venuesRoutes from './routes/venues.js';
import bandsRouter from './routes/bands.js';
import showsRouter from './routes/shows.js';
import peopleRouter from './routes/people.js';
import usersRouter from './routes/users/users.js';
import favoritesRouter from './routes/users/favorites.js';
import authRoutes from './routes/auth.js';
import sessionMusiciansRouter from './routes/sessionmusicians.js';
import postsRouter from './routes/chat/posts.js';
import tagsRouter from './routes/tags.js';
import pledgesRouter from './routes/pledges.js';
import flyeringRouter from './routes/flyering.js';
import imagesRouter from './routes/images.js';
import notificationsRouter from './routes/notifications.js';
import updatesRouter from './routes/updates.js';
import contactRouter from './routes/contact.js';
import uploadRouter from './routes/upload.js';
import readStatusRouter from './routes/chat/read-status.js'
import directMessagesRouter from './routes/direct-messages.js'
import scrapersRouter from './routes/admin/run-scrapers.js'
import sseRouter from './routes/sseRoutes.js';
import adminShowsRouter from './routes/admin/shows-admin.js'

import compression from 'compression';

// 4) Create the Express app
const app = express();
const PORT = process.env.PORT || 3001;

app.use(compression());


// 5) Define allowed origins per environment
const allowedOriginsMap = {
  development: [
    'http://localhost:3003',
    'http://localhost:5173'
  ],
  staging: [
    'https://staging.tcupboard.org'
  ],
  production: [
    'https://tcupboard.org',
    'https://tcupmn.org'
  ]
};

// 6) Figure out which environment we’re in
const currentEnv = process.env.NODE_ENV || 'development';

const allowedOrigins = allowedOriginsMap[currentEnv]

// 7) Configure CORS
//    If you need credentials (cookies, etc.), you must set credentials: true
//    and cannot use a wildcard (*) for origin.
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));

// 8) Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 9) Debug request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// 10) Mount your routes (make sure these come after the CORS and body-parser middleware)
app.use('/api/venues', venuesRoutes);
app.use('/api/bands', bandsRouter);
app.use('/api/shows', showsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/users', usersRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/sessionmusicians', sessionMusiciansRouter);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/pledges', pledgesRouter);
app.use('/api/flyering', flyeringRouter);
app.use('/api/images', imagesRouter);
app.use('/api/notifications', notificationsRouter)
app.use('/api/updates', updatesRouter)
app.use('/api/contact', contactRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/read-status', readStatusRouter);
app.use('/api/direct-messages', directMessagesRouter)
app.use('/api/scrapers', scrapersRouter)
app.use('/api/sseroutes', sseRouter)
app.use('/api/adminshows', adminShowsRouter)

app.get('/api/bands/simple-test', (req, res) => {
  res.json({ message: 'Simple test route works' });
});

// Print out routes (for debugging)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.path}`);
  } });

// 11) Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, environment: ${currentEnv}`);
});
