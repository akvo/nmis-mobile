CREATE TABLE nodes (
  id INTEGER PRIMARY KEY,
  code VARCHAR(10),
  name VARCHAR(100) NOT NULL,
  parent INTEGER
);

INSERT INTO nodes (id, code, name, parent) VALUES
(1, 'HH001', 'Kamau House', 0),
(2, 'HH002', 'Wanjiku House', 0),
(3, 'HH003', 'Wangari House', 0),
(4, 'HH004', 'Anyango House', 0),
(5, 'HH005', 'Nyokabi House', 0),
(6, 'HH006', 'Njoroge House', 0),
(7, 'HH007', 'Mutiso House', 0),
(8, 'HH008', 'Omondi House', 0),
(9, 'HH009', 'Akinyi House', 0),
(10, 'HH010', 'Njeri House', 0);
