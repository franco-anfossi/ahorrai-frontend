import type { GetServerSidePropsContext } from 'next'
import type { Profile } from '@/types'

import { createClient } from '@/lib/supabase/server-props'

export default function PrivatePage({ profile }: { profile: Profile }) {
  return <h1>Hello, {profile.full_name || profile.email}!</h1>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    props: {
      profile,
    },
  }
}