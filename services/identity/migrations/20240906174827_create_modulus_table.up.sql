CREATE TABLE modulus (
    id BIGINT PRIMARY KEY,
    modulus TEXT NOT NULL
);

CREATE INDEX idx_modulus_id ON modulus(id);
