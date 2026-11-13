INSERT INTO equipe_usuario
    (id_equipe_usuario, id_equipe, id_usuario, data_entrada, data_saida)
SELECT
    3, 2, 3, '2024-02-10', NULL
WHERE NOT EXISTS (
    SELECT 1
    FROM equipe_usuario
    WHERE id_equipe = 2
      AND id_usuario = 3
);

COMMIT;
