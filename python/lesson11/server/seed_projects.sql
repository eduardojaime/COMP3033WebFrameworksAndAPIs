-- Seed up to 1,000 deterministic Lesson 07 projects.
-- Requires the projects table to have name, due_date, course, and status columns.
-- Existing records are preserved; rerunning this script does not duplicate its seed names.

WITH sample_projects AS (
    SELECT
        series.n,
        lpad(series.n::text, 4, '0') || ' - Lesson 07 Sample Project' AS name,
        CURRENT_DATE + (series.n % 365) AS due_date,
        (ARRAY[
            'WebAPIs',
            'JS Frameworks',
            'Java',
            'ASP.NET',
            'Python',
            'C++'
        ])[((series.n - 1) % 6) + 1] AS course,
        (ARRAY[
            'TO DO',
            'IN PROGRESS',
            'DONE'
        ])[((series.n - 1) % 3) + 1] AS status
    FROM generate_series(1, 1000) AS series(n)
)
INSERT INTO projects (name, due_date, course, status)
SELECT sample_projects.name,
       sample_projects.due_date,
       sample_projects.course,
       sample_projects.status
FROM sample_projects
WHERE NOT EXISTS (
    SELECT 1
    FROM projects
    WHERE projects.name = sample_projects.name
);
