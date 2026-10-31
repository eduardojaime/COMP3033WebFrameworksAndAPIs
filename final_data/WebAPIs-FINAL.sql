-- Seed data for Final Exam
CREATE TABLE businesses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email_address TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10)
);

INSERT INTO businesses (name, address, phone_number, email_address, rating)
VALUES
    ('McGlynn, Armstrong and Shanahan', '23088 Saint Paul Circle', '(348) 4403918', 'nbeetham0@twitpic.com', 4),
    ('Aufderhar-Wisozk', '915 Chive Pass', '(949) 4962075', 'bmunford1@samsung.com', 8),
    ('Hammes-Jacobson', '67676 Hoepker Point', '(149) 2834895', 'yhamblen2@noaa.gov', 4),
    ('Dach-Pouros', '5834 Montana Terrace', '(376) 5404361', 'sfellgate3@reference.com', 4),
    ('Jerde, Homenick and King', '61027 Kensington Junction', '(757) 1562468', 'aspellard4@ebay.com', 1),
    ('Howe, Schaden and Conn', '68803 Jackson Court', '(926) 9251022', 'mlucus5@epa.gov', 8),
    ('Bernhard LLC', '5073 Loeprich Drive', '(534) 3091686', 'jphilpott6@microsoft.com', 6),
    ('Larkin-Welch', '2 Springview Park', '(217) 7728127', 'mrayman7@newyorker.com', 7),
    ('Renner, Lesch and Kunde', '337 Gulseth Trail', '(936) 2301795', 'gcarder8@blog.com', 4),
    ('Cormier and Sons', '685 Kenwood Pass', '(203) 9851583', 'ijarvis9@a8.net', 5);
