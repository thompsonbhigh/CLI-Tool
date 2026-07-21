import express from 'express';
import 'dotenv/config';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server here!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});