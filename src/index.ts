import express from 'express';
import { sequelize } from './models';
import { identify } from './controllers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/identify', identify);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
