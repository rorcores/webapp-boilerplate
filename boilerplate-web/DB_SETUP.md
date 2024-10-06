#### Please follow these steps to generate a fresh supabase web app project.

#### How to Generate MyProject project and Run:

# Initial Setup:

## Sign up for Supabase.

- Then, create the necessary tables with the following SQL commands:

```sql
-- Create the first table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  username TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
);
```

```sql
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

ALTER TABLE users
ALTER COLUMN id SET DATA TYPE UUID USING gen_random_uuid();

ALTER TABLE users
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE users ADD COLUMN supabase_user_id UUID;

ALTER TABLE users
ADD CONSTRAINT unique_supabase_user_id UNIQUE (supabase_user_id);
```

---NEW SQL REGARDING LETTING USERS CHANGE THEIR EMAIL AND THEN LOGGING IT ON THE DB AS EMAIL HISTORY

CREATE TABLE public.users_email_history (
id BIGSERIAL PRIMARY KEY,
supabase_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
old_email TEXT NOT NULL,
new_email TEXT NOT NULL,
changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--this whole thing below here is one big function
CREATE OR REPLACE FUNCTION public.handle_auth_user_email_change()
RETURNS TRIGGER AS $$
BEGIN
-- Update the email in your custom 'users' table
UPDATE public.users
SET email = NEW.email
WHERE supabase_user_id = NEW.id;

-- Insert a record into the 'users_email_history' table
INSERT INTO public.users_email_history (supabase_user_id, old_email, new_email)
VALUES (NEW.id, OLD.email, NEW.email);

RETURN NEW;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;





CREATE TRIGGER on_auth_user_email_change
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE PROCEDURE public.handle_auth_user_email_change();
$$
