
-- Crear las tablas sin las claves foráneas
   CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   email VARCHAR(255),
   accountNumber VARCHAR(20)
   );

   CREATE TABLE instruments (
   id SERIAL PRIMARY KEY,
   ticker VARCHAR(10),
   name VARCHAR(255),
   type VARCHAR(10)
   );

   CREATE TABLE orders (
   id SERIAL PRIMARY KEY,
   instrumentId INT,
   userId INT,
   size INT,
   price NUMERIC(10, 2),
   type VARCHAR(10),
   side VARCHAR(10),
   status VARCHAR(20),
   datetime TIMESTAMP
   );

   CREATE TABLE marketdata (
   id SERIAL PRIMARY KEY,
   instrumentId INT,
   high NUMERIC(10, 2),
   low NUMERIC(10, 2),
   open NUMERIC(10, 2),
   close NUMERIC(10, 2),
   previousClose NUMERIC(10, 2),
   date DATE
   );

-- Agregar las claves foráneas con ALTER TABLE
ALTER TABLE orders
ADD CONSTRAINT fk_instrument
FOREIGN KEY (instrumentId) REFERENCES instruments(id);

ALTER TABLE orders
ADD CONSTRAINT fk_user
FOREIGN KEY (userId) REFERENCES users(id);

ALTER TABLE marketdata
ADD CONSTRAINT fk_instrument_marketdata
FOREIGN KEY (instrumentId) REFERENCES instruments(id);


INSERT INTO users (email,accountNumber) VALUES
   ('emiliano@test.com','10001'),
   ('jose@test.com','10002'),
   ('francisco@test.com','10003'),
   ('juan@test.com','10004');

INSERT INTO instruments (ticker,name,type) VALUES
   ('DYCA','Dycasa S.A.','ACCIONES'),
   ('CAPX','Capex S.A.','ACCIONES'),
   ('PGR','Phoenix Global Resources','ACCIONES'),
   ('MOLA','Molinos Agro S.A.','ACCIONES'),
   ('MIRG','Mirgor','ACCIONES'),
   ('PATA','Importadora y Exportadora de la Patagonia','ACCIONES'),
   ('TECO2','Telecom','ACCIONES'),
   ('FERR','Ferrum S.A.','ACCIONES'),
   ('SAMI','S.A San Miguel','ACCIONES'),
   ('IRCP','IRSA Propiedades Comerciales S.A.','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('GAMI','Boldt Gaming S.A.','ACCIONES'),
   ('DOME','Domec','ACCIONES'),
   ('INTR','Compañía Introductora de Buenos Aires S.A.','ACCIONES'),
   ('MTR','Matba Rofex S.A.','ACCIONES'),
   ('FIPL','Fiplasto','ACCIONES'),
   ('GARO','Garovaglio Y Zorraquín','ACCIONES'),
   ('SEMI','Molinos Juan Semino','ACCIONES'),
   ('HARG','Holcim (Argentina) S.A.','ACCIONES'),
   ('BPAT','Banco Patagonia','ACCIONES'),
   ('RIGO','Rigolleau S.A.','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('CVH','Cablevision Holding','ACCIONES'),
   ('BBAR','Banco Frances','ACCIONES'),
   ('LEDE','Ledesma','ACCIONES'),
   ('CELU','Celulosa Argentina S.A.','ACCIONES'),
   ('CECO2','Central Costanera','ACCIONES'),
   ('AGRO','Agrometal','ACCIONES'),
   ('AUSO','Autopistas del Sol','ACCIONES'),
   ('BHIP','Banco Hipotecario S.A.','ACCIONES'),
   ('BOLT','Boldt S.A.','ACCIONES'),
   ('CARC','Carboclor S.A.','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('BMA','Banco Macro S.A.','ACCIONES'),
   ('CRES','Cresud S.A.','ACCIONES'),
   ('EDN','Edenor S.A.','ACCIONES'),
   ('GGAL','Grupo Financiero Galicia','ACCIONES'),
   ('DGCU2','Distribuidora De Gas Cuyano S.A.','ACCIONES'),
   ('GBAN','Gas Natural Ban S.A.','ACCIONES'),
   ('CGPA2','Camuzzi Gas del Sur','ACCIONES'),
   ('CADO','Carlos Casado','ACCIONES'),
   ('GCLA','Grupo Clarin S.A.','ACCIONES'),
   ('GRIM','Grimoldi','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('RICH','Laboratorios Richmond','ACCIONES'),
   ('MOLI','Molinos Río de la Plata','ACCIONES'),
   ('VALO','BCO DE VALORES ACCIONES ORD.','ACCIONES'),
   ('TGNO4','Transportadora de Gas del Norte','ACCIONES'),
   ('LOMA','Loma Negra S.A.','ACCIONES'),
   ('IRSA','IRSA Inversiones y Representaciones S.A.','ACCIONES'),
   ('PAMP','Pampa Holding S.A.','ACCIONES'),
   ('TGSU2','Transportadora de Gas del Sur','ACCIONES'),
   ('TXAR','Ternium Argentina S.A','ACCIONES'),
   ('YPFD','Y.P.F. S.A.','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('MORI','Morixe Hermanos S.A.C.I.','ACCIONES'),
   ('INVJ','Inversora Juramento S.A.','ACCIONES'),
   ('POLL','Polledo S.A.','ACCIONES'),
   ('METR','MetroGAS S.A.','ACCIONES'),
   ('LONG','Longvie','ACCIONES'),
   ('SUPV','Grupo Supervielle S.A.','ACCIONES'),
   ('ROSE','Instituto Rosenbusch','ACCIONES'),
   ('OEST','Oeste Grupo Concesionario','ACCIONES'),
   ('COME','Sociedad Comercial Del Plata','ACCIONES'),
   ('CEPU','Central Puerto','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('ALUA','Aluar Aluminio Argentino S.A.I.C.','ACCIONES'),
   ('CTIO','Consultatio S.A.','ACCIONES'),
   ('TRAN','Transener S.A.','ACCIONES'),
   ('HAVA','Havanna Holding','ACCIONES'),
   ('BYMA','Bolsas y Mercados Argentinos S.A.','ACCIONES');
INSERT INTO instruments (ticker,name,type) VALUES
   ('ARS','PESOS','MONEDA');

INSERT INTO marketdata (instrumentId,date,open,high,low,close,previousclose) VALUES
   (12,'2023-07-13',NULL,NULL,NULL,20.50000000,20.50000000),
   (35,'2023-07-13',337.50000000,342.50000000,328.50000000,341.50000000,335.00000000),
   (54,'2023-07-13',232.00000000,232.00000000,222.50000000,232.00000000,229.00000000),
   (51,'2023-07-13',35.90000000,36.55000000,35.75000000,35.95000000,35.90000000),
   (52,'2023-07-13',105.00000000,105.00000000,98.50000000,99.70000000,103.00000000),
   (60,'2023-07-13',358.00000000,365.95000000,354.45000000,364.80000000,353.45000000),
   (31,'2023-07-13',1425.00000000,1541.00000000,1415.00000000,1520.25000000,1413.50000000),
   (40,'2023-07-13',400.00000000,400.00000000,395.00000000,397.50000000,400.00000000),
   (4,'2023-07-13',6940.00000000,7044.00000000,6561.00000000,6621.50000000,6659.50000000),
   (37,'2023-07-13',407.00000000,409.00000000,388.50000000,400.50000000,408.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (44,'2023-07-13',668.00000000,669.50000000,655.00000000,668.00000000,658.00000000),
   (63,'2023-07-13',367.50000000,378.00000000,366.00000000,373.00000000,367.50000000),
   (18,'2023-07-13',500.00000000,525.00000000,494.00000000,515.50000000,498.00000000),
   (30,'2023-07-13',6.70000000,6.80000000,6.66000000,6.75000000,6.64000000),
   (25,'2023-07-13',188.00000000,195.00000000,187.00000000,192.75000000,187.50000000),
   (19,'2023-07-13',273.00000000,295.00000000,266.00000000,289.00000000,273.00000000),
   (6,'2023-07-13',245.00000000,256.00000000,241.25000000,251.50000000,247.25000000),
   (11,'2023-07-13',86.50000000,86.50000000,84.00000000,86.00000000,86.40000000),
   (17,'2023-07-13',53.00000000,54.00000000,51.50000000,53.20000000,52.00000000),
   (64,'2023-07-13',1107.00000000,1170.00000000,1107.00000000,1163.00000000,1122.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (21,'2023-07-13',1567.00000000,1660.00000000,1562.00000000,1656.00000000,1562.00000000),
   (23,'2023-07-13',307.00000000,348.00000000,298.00000000,337.00000000,304.00000000),
   (39,'2023-07-13',450.00000000,460.00000000,433.00000000,449.65000000,447.75000000),
   (1,'2023-07-13',268.00000000,268.00000000,255.00000000,260.00000000,264.00000000),
   (8,'2023-07-13',38.15000000,38.50000000,37.00000000,37.55000000,38.15000000),
   (58,'2023-07-13',217.00000000,220.50000000,217.00000000,220.00000000,217.50000000),
   (14,'2023-07-13',617.00000000,617.00000000,612.50000000,615.00000000,612.50000000),
   (2,'2023-07-13',1850.00000000,1930.00000000,1850.00000000,1918.00000000,1885.50000000),
   (29,'2023-07-13',8.80000000,8.90000000,8.72000000,8.79000000,8.76000000),
   (36,'2023-07-13',330.00000000,330.00000000,311.00000000,323.00000000,325.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (27,'2023-07-13',640.00000000,640.00000000,615.00000000,623.00000000,631.50000000),
   (62,'2023-07-13',535.00000000,535.00000000,495.00000000,519.00000000,530.00000000),
   (15,'2023-07-13',64.00000000,66.00000000,64.00000000,66.00000000,65.00000000),
   (13,'2023-07-13',75.00000000,75.00000000,75.00000000,75.00000000,72.30000000),
   (26,'2023-07-13',134.25000000,140.00000000,132.00000000,138.00000000,136.75000000),
   (24,'2023-07-13',309.00000000,313.50000000,302.00000000,310.00000000,306.50000000),
   (32,'2023-07-13',415.00000000,430.00000000,408.30000000,429.45000000,405.10000000),
   (22,'2023-07-13',1039.00000000,1076.90000000,1031.00000000,1062.20000000,1020.90000000),
   (57,'2023-07-13',21.40000000,21.40000000,21.40000000,21.40000000,21.40000000),
   (9,'2023-07-13',313.00000000,315.00000000,305.00000000,310.00000000,313.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (65,'2023-07-13',363.50000000,368.00000000,360.00000000,362.00000000,360.00000000),
   (59,'2023-07-13',40.45000000,43.20000000,40.20000000,42.90000000,39.90000000),
   (41,'2023-07-13',508.50000000,546.00000000,502.00000000,543.00000000,500.50000000),
   (38,'2023-07-13',162.25000000,163.50000000,160.00000000,163.25000000,162.00000000),
   (5,'2023-07-13',9150.00000000,9297.50000000,9121.00000000,9278.00000000,9114.00000000),
   (61,'2023-07-13',391.00000000,412.00000000,391.00000000,412.00000000,391.00000000),
   (55,'2023-07-13',18.90000000,19.40000000,18.70000000,19.05000000,19.00000000),
   (42,'2023-07-13',663.00000000,682.00000000,646.00000000,657.50000000,661.50000000),
   (20,'2023-07-13',540.00000000,565.00000000,540.00000000,565.00000000,580.00000000),
   (34,'2023-07-13',875.00000000,925.85000000,875.00000000,917.75000000,864.90000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (46,'2023-07-13',428.35000000,439.00000000,421.00000000,431.90000000,428.60000000),
   (45,'2023-07-13',701.80000000,746.00000000,701.80000000,734.35000000,696.60000000),
   (47,'2023-07-13',900.00000000,924.60000000,896.00000000,921.80000000,893.65000000),
   (56,'2023-07-13',311.60000000,340.25000000,311.60000000,338.85000000,311.60000000),
   (7,'2023-07-13',670.00000000,684.50000000,665.70000000,672.65000000,664.25000000),
   (48,'2023-07-13',1410.50000000,1440.00000000,1403.65000000,1437.55000000,1394.20000000),
   (49,'2023-07-13',428.00000000,458.00000000,425.50000000,448.00000000,428.00000000),
   (43,'2023-07-13',107.00000000,110.00000000,106.00000000,108.50000000,106.50000000),
   (50,'2023-07-13',7746.55000000,8035.00000000,7746.55000000,7975.05000000,7673.65000000),
   (16,'2023-07-13',56.00000000,58.50000000,56.00000000,56.10000000,56.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (53,'2023-07-13',NULL,NULL,NULL,62.00000000,62.00000000),
   (28,'2023-07-13',33.00000000,35.00000000,31.90000000,34.60000000,33.15000000),
   (33,'2023-07-13',394.00000000,421.30000000,382.00000000,418.50000000,381.65000000),
   (62,'2023-07-14',520.00000000,523.00000000,510.00000000,520.00000000,519.00000000),
   (12,'2023-07-14',20.50000000,20.50000000,20.50000000,20.50000000,20.50000000),
   (42,'2023-07-14',657.50000000,669.00000000,638.00000000,648.50000000,657.50000000),
   (35,'2023-07-14',336.00000000,340.00000000,333.00000000,338.00000000,341.50000000),
   (15,'2023-07-14',69.00000000,93.00000000,68.50000000,88.70000000,66.00000000),
   (54,'2023-07-14',232.00000000,233.00000000,225.25000000,229.50000000,232.00000000),
   (48,'2023-07-14',1434.05000000,1435.55000000,1380.00000000,1397.70000000,1437.55000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (51,'2023-07-14',35.80000000,36.70000000,34.60000000,36.00000000,35.95000000),
   (13,'2023-07-14',74.90000000,77.00000000,74.80000000,77.00000000,75.00000000),
   (52,'2023-07-14',101.00000000,103.00000000,98.00000000,102.00000000,99.70000000),
   (20,'2023-07-14',565.00000000,565.00000000,565.00000000,565.00000000,565.00000000),
   (60,'2023-07-14',369.65000000,369.65000000,356.25000000,363.00000000,364.80000000),
   (26,'2023-07-14',138.00000000,140.00000000,134.25000000,138.00000000,138.00000000),
   (31,'2023-07-14',1525.00000000,1560.00000000,1470.00000000,1502.80000000,1520.25000000),
   (16,'2023-07-14',55.00000000,57.00000000,55.00000000,56.10000000,56.10000000),
   (40,'2023-07-14',395.00000000,395.00000000,390.00000000,392.50000000,397.50000000),
   (24,'2023-07-14',295.00000000,322.50000000,295.00000000,322.00000000,310.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (4,'2023-07-14',6650.00000000,6840.00000000,6500.00000000,6640.00000000,6621.50000000),
   (34,'2023-07-14',915.80000000,918.90000000,870.00000000,885.80000000,917.75000000),
   (37,'2023-07-14',390.00000000,412.00000000,388.00000000,400.50000000,400.50000000),
   (32,'2023-07-14',421.50000000,429.50000000,410.00000000,424.25000000,429.45000000),
   (44,'2023-07-14',668.00000000,668.50000000,640.50000000,650.00000000,668.00000000),
   (49,'2023-07-14',455.00000000,455.00000000,426.00000000,429.00000000,448.00000000),
   (63,'2023-07-14',373.00000000,373.00000000,360.00000000,369.50000000,373.00000000),
   (22,'2023-07-14',1047.00000000,1062.00000000,1002.00000000,1038.10000000,1047.16600000),
   (18,'2023-07-14',515.00000000,516.00000000,500.50000000,505.50000000,515.50000000),
   (46,'2023-07-14',431.80000000,431.80000000,419.30000000,420.10000000,431.90000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (30,'2023-07-14',6.80000000,7.02000000,6.80000000,7.00000000,6.75000000),
   (57,'2023-07-14',21.40000000,21.40000000,21.40000000,21.40000000,21.40000000),
   (25,'2023-07-14',190.00000000,196.00000000,189.00000000,195.00000000,192.75000000),
   (28,'2023-07-14',35.40000000,35.50000000,32.60000000,33.40000000,34.60000000),
   (19,'2023-07-14',291.00000000,291.00000000,275.00000000,279.00000000,289.00000000),
   (9,'2023-07-14',312.00000000,317.00000000,305.50000000,309.50000000,310.00000000),
   (6,'2023-07-14',252.50000000,257.00000000,244.00000000,251.00000000,251.50000000),
   (45,'2023-07-14',730.00000000,744.45000000,724.00000000,734.65000000,734.35000000),
   (11,'2023-07-14',86.90000000,86.90000000,84.00000000,84.30000000,86.00000000),
   (65,'2023-07-14',363.00000000,370.50000000,361.00000000,369.50000000,362.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (17,'2023-07-14',53.50000000,58.00000000,53.00000000,57.20000000,53.20000000),
   (43,'2023-07-14',106.50000000,110.00000000,106.00000000,107.50000000,108.50000000),
   (64,'2023-07-14',1170.00000000,1190.00000000,1150.00000000,1180.00000000,1163.00000000),
   (59,'2023-07-14',43.00000000,43.30000000,41.75000000,42.75000000,42.90000000),
   (21,'2023-07-14',1659.50000000,1680.00000000,1580.00000000,1660.00000000,1656.00000000),
   (47,'2023-07-14',920.15000000,927.70000000,902.05000000,925.85000000,921.80000000),
   (23,'2023-07-14',338.50000000,350.00000000,320.00000000,341.50000000,337.00000000),
   (41,'2023-07-14',546.00000000,579.00000000,525.00000000,550.00000000,543.00000000),
   (39,'2023-07-14',455.00000000,455.00000000,437.00000000,450.60000000,449.65000000),
   (53,'2023-07-14',60.00000000,60.00000000,60.00000000,60.00000000,62.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (1,'2023-07-14',260.00000000,278.00000000,240.00000000,259.00000000,260.00000000),
   (38,'2023-07-14',165.00000000,167.00000000,161.50000000,166.50000000,163.25000000),
   (8,'2023-07-14',38.80000000,39.00000000,37.80000000,38.80000000,37.55000000),
   (56,'2023-07-14',335.15000000,335.55000000,322.00000000,328.10000000,338.85000000),
   (58,'2023-07-14',219.50000000,220.25000000,214.00000000,220.25000000,220.00000000),
   (5,'2023-07-14',9299.50000000,9299.50000000,8899.50000000,9163.00000000,9278.00000000),
   (14,'2023-07-14',615.00000000,615.00000000,614.50000000,615.00000000,615.00000000),
   (50,'2023-07-14',7901.25000000,7901.25000000,7752.00000000,7837.50000000,7975.05000000),
   (2,'2023-07-14',1850.00000000,1920.00000000,1850.00000000,1865.00000000,1918.00000000),
   (61,'2023-07-14',411.50000000,413.00000000,395.00000000,410.00000000,412.00000000);
INSERT INTO "marketdata" (instrumentId,date,open,high,low,close,previousclose) VALUES
   (29,'2023-07-14',8.84000000,8.94000000,8.80000000,8.93000000,8.79000000),
   (7,'2023-07-14',674.00000000,675.00000000,647.00000000,651.85000000,672.65000000),
   (36,'2023-07-14',311.00000000,316.00000000,311.00000000,315.00000000,323.00000000),
   (55,'2023-07-14',19.10000000,19.30000000,18.75000000,19.00000000,19.05000000),
   (27,'2023-07-14',636.00000000,636.00000000,620.00000000,624.00000000,623.00000000),
   (33,'2023-07-14',418.00000000,418.50000000,407.20000000,414.70000000,418.50000000);

INSERT INTO orders (instrumentId,userId,size,price,side,status,type,datetime) VALUES
  (66,1,1000000,1,'CASH_IN','FILLED','MARKET','2023-07-12 12:11:20'),
  (47,1,50,930,'BUY','FILLED','MARKET','2023-07-12 12:31:20'),
  (47,1,50,920,'BUY','CANCELLED','LIMIT','2023-07-12 14:21:20'),
  (47,1,10,940,'SELL','FILLED','MARKET','2023-07-12 14:51:20'),
  (45,1,50,710,'BUY','NEW','LIMIT','2023-07-12 15:14:20'),
  (47,1,100,950,'SELL','REJECTED','MARKET','2023-07-12 16:11:20'),
  (31,1,60,1500,'BUY','NEW','LIMIT','2023-07-13 11:13:20'),
  (66,1,100000,1,'CASH_OUT','FILLED','MARKET','2023-07-13 12:31:20'),
  (31,1,20,1540,'BUY','FILLED','LIMIT','2023-07-13 12:51:20'),
  (54,1,500,250,'BUY','FILLED','MARKET','2023-07-13 14:11:20'),
  (31,1,30,1530,'SELL','FILLED','MARKET','2023-07-13 15:13:20');