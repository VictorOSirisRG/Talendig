IF OBJECT_ID('productos') IS NULL
BEGIN 
    CREATE TABLE productos(
                id INT IDENTITY(1,1) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL,
                precio DECIMAL(10,2) NOT NULL,
                stock INT NOT NULL DEFAULT 0
    );

    INSERT INTO productos(nombre,precio,stock)VALUES
     (N'Teclado mecánico', 2500, 10),
    (N'Mouse inalámbrico', 900, 5),
    (N'Monitor 24 pulgadas', 9500, 2);
    END