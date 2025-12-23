-- Add profile picture columns and developer info

-- Add profile_picture column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS profile_picture LONGBLOB;

-- Add profile_picture column to admins table
ALTER TABLE admins ADD COLUMN IF NOT EXISTS profile_picture LONGBLOB;

-- Update admin with developer info
UPDATE admins SET 
  full_name = 'John Ron Paul Almia',
  profile_picture = NULL
WHERE username = 'admin';

-- Add developer info as a comment/note
-- Developer: John Ron Paul Almia
-- Contact: jrpalmia@gmail.com
-- Role: Lead Developer & Architect
