import ManualExpenseRegister from '../src/pages/manual-expense-register'
import { createClient } from '@/lib/supabase/server-props'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

interface PageProps {
  categories: any[]
}

export default function ManualExpenseRegisterPage({ categories }: PageProps) {
  return <ManualExpenseRegister categories={categories} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ categories: any[] }>> {
  const supabase = createClient(context)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)

  return {
    props: {
      categories: categories || [],
    },
  }
}
