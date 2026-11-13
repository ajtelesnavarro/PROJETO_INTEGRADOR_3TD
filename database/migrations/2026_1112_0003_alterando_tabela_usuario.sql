ALTER TABLE usuario
MODIFY COLUMN perfil ENUM(
        'administrador',
        'manutencao',
        'porteiro',
        'locador'
    ) NOT NULL DEFAULT 'locador',