CREATE TABLE node (
  id INTEGER PRIMARY KEY,
  code VARCHAR(10),
  name VARCHAR(100) NOT NULL,
  parent INTEGER
);

INSERT INTO node (id, code, name, parent) VALUES
(1, 'KO001', 'Kenya National Government', 0),
(2, 'KO002', 'Nairobi County Government', 1),
(3, 'KO003', 'Mombasa County Government', 1),
(4, 'KO004', 'Ministry of Education', 1),
(5, 'KO005', 'Ministry of Health', 1),
(6, 'KO006', 'Public Service Commission', 1),
(7, 'KO007', 'Nairobi Education Department', 2),
(8, 'KO008', 'Nairobi Health Department', 2),
(9, 'KO009', 'Mombasa Education Department', 3),
(10, 'KO010', 'Mombasa Health Department', 3),
(11, 'KO011', 'Ministry of Finance', 1),
(12, 'KO012', 'Ministry of Interior', 1),
(13, 'KO013', 'Kisumu County Government', 1),
(14, 'KO014', 'Kisumu Education Department', 13),
(15, 'KO015', 'Kisumu Health Department', 13),
(16, 'KO016', 'Machakos County Government', 1),
(17, 'KO017', 'Machakos Education Department', 16),
(18, 'KO018', 'Machakos Health Department', 16),
(19, 'KO019', 'Eldoret County Government', 1),
(20, 'KO020', 'Eldoret Education Department', 19),
(21, 'KO021', 'Kisii County Government', 0),
(22, 'KO022', 'Kisii Education Department', 21);
