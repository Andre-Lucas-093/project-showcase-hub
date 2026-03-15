import { createPool } from 'mysql2/promise';

async function run() {
  const pool = createPool({ host: 'localhost', port: 3306, user: 'app_user', password: 'app_pass', database: 'project_case' });
  try {
    await pool.query(`
      INSERT INTO cursos (nome, categoria, modalidade) VALUES
        ('Administração', 'graduacao', 'ead'),
        ('Ciências Contábeis', 'graduacao', 'ead'),
        ('Tecnologia em Análise e Desenvolvimento de Sistemas', 'graduacao', 'ead'),
        ('Tecnologia em Gestão Ambiental', 'graduacao', 'ead'),
        ('Tecnologia em Gestão de Recursos Humanos', 'graduacao', 'ead'),
        ('Tecnologia em Marketing', 'graduacao', 'ead');
    `);
    console.log('EAD courses inserted successfully');
  } catch (err) {
    console.error('Error inserting courses:', err);
  }
  process.exit();
}
run();
