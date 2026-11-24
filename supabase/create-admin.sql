-- Admin user registration template with permissions assignment
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_email text := 'YOUR_ADMIN_EMAIL@example.com';
  v_password text := 'YOUR_SECURE_ADMIN_PASSWORD';
  v_encrypted_password text := extensions.crypt(v_password, extensions.gen_salt('bf'));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      v_encrypted_password,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Muhammad Raynar Hammam"}'::jsonb,
      now(),
      now()
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      v_email,
      json_build_object('sub', v_user_id::text, 'email', v_email)::jsonb,
      'email',
      now(),
      now(),
      now()
    );

    INSERT INTO public.admins (id, email)
    VALUES (v_user_id, v_email);
  ELSE
    -- If user already exists in auth.users, ensure admin record exists
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
    INSERT INTO public.admins (id, email)
    VALUES (v_user_id, v_email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
