import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/lib/supabase/component';
import { Profile } from '@/types';

const AccountSection: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data as Profile);
          setFullName(data.full_name ?? '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setSaving(true);
    const filePath = `${profile.id}/${file.name}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      const avatar_url = urlData.publicUrl;
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url })
        .eq('id', profile.id)
        .select()
        .single();
      if (!updateError && updated) {
        setProfile(updated as Profile);
      }
    } else {
      console.error('Error uploading avatar:', error);
    }
    setSaving(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)
      .select()
      .single();
    if (!error && updated) {
      setProfile(updated as Profile);
    } else if (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    router.push('/login');
  };

  if (loading) {
    return <div className="py-10 text-center">Cargando...</div>;
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-3">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border bg-surface hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Email
        </label>
        <input
          type="text"
          value={profile?.email || ''}
          readOnly
          className="w-full px-4 py-2 rounded-lg border bg-gray-100 text-gray-500"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2"
        >
          Guardar
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AccountSection;
