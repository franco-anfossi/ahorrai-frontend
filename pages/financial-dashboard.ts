import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import FinancialDashboard from '../src/pages/financial-dashboard'
import { createClient } from '@/lib/supabase/server-props'

export default FinancialDashboard

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: any
    categories: any[]
    budgets: any[]
    expenses: any[]
  }>
> {
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

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(20)

  return {
    props: {
      user,
      categories: categories || [],
      budgets: budgets || [],
      expenses: expenses || [],
    },
  }
}
