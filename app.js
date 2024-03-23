const express = require('express');
const sequelize = require('./config/database'); // Ajustado para importar Sequelize
const routes = require('./routes');
const setupAssociations = require('./models/common/associations');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos con Sequelize');
        
        // Establecer las asociaciones entre las tablas
        setupAssociations();

        // Opcional: Sincroniza todos los modelos
        return sequelize.sync({ force: false }); // `force: true` para reiniciar las tablas
    })
    .then(() => {
        console.log('Modelos sincronizados con la base de datos');
        
        app.get('/', (req, res) => {
            res.send('DB connection working on port 3000!');
        });

        // Inicia el servidor solo si la conexión y sincronización son exitosas
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch(err => console.error('Error al conectar o sincronizar con la base de datos con Sequelize:', err));

