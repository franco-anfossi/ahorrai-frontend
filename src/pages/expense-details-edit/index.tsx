import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import ExpenseDetailsSection from './components/ExpenseDetailsSection';
import ActivityLog from './components/ActivityLog';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SplitExpenseModal from './components/SplitExpenseModal';
import ShareExpenseModal from './components/ShareExpenseModal';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import { Expense } from '../../types';
import { fetchExpense } from '@/lib/supabase/expenses';
import { fetchCategoryById, CategoryRecord } from '@/lib/supabase/categories';

interface ExpenseDetailsEditProps {}

const ExpenseDetailsEdit: React.FC<ExpenseDetailsEditProps> = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showSplitModal, setShowSplitModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showActivityLog, setShowActivityLog] = useState<boolean>(false);
  const [expenseData, setExpenseData] = useState<Expense | null>(null);

  useEffect(() => {
    const loadExpenseData = async () => {
      const { id } = router.query;
      if (id && typeof id === 'string') {
        try {
          const record = await fetchExpense(id);
          if (!record) {
            router.push('/financial-dashboard');
            return;
          }
          const category: CategoryRecord | null = record.category_id
            ? await fetchCategoryById(record.category_id)
            : null;
          const expense: Expense = {
            id: record.id,
            amount: record.amount,
            currency: 'CLP',
            category: category
              ? { id: category.id as unknown as number, name: category.name, icon: category.icon, color: category.color }
              : { id: 0, name: 'Sin categoría', icon: 'Tag', color: '#ccc' },
            merchant: record.merchant || '',
            date: record.date,
            paymentMethod: record.payment_method || '',
            cardLast4: null,
            description: record.description || '',
            notes: record.description || '',
            status: 'completed'
          };
          setExpenseData(expense);
        } catch (e) {
          console.error(e);
          router.push('/financial-dashboard');
        }
      }
      setIsLoading(false);
    };

    if (router.isReady) {
      loadExpenseData();
    }
  }, [router.isReady, router.query]);

  const handleBack = (): void => {
    router.back();
  };

  const handleEdit = (): void => {
    // Toggle edit mode
  };

  const handleSaveEdit = (updatedData: Partial<Expense>): void => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      if (expenseData) {
        setExpenseData({ ...expenseData, ...updatedData });
      }
      setIsSaving(false);
    }, 1000);
  };

  const handleCancelEdit = (): void => {
    // Cancel edit mode
  };

  const handleDelete = (): void => {
    setShowDeleteModal(true);
  };

  const confirmDelete = (): void => {
    // Simulate API call
    setTimeout(() => {
      router.push('/financial-dashboard');
    }, 500);
  };

  const handleDuplicate = (): void => {
    if (expenseData) {
      const newExpense = {
        ...expenseData,
        id: Date.now(),
        date: new Date().toISOString(),
        description: `${expenseData.description} (copia)`
      };
      // Navigate to manual expense register with pre-filled data
      router.push({
        pathname: '/manual-expense-register',
        query: { duplicate: JSON.stringify(newExpense) }
      });
    }
  };

  const handleSplit = (): void => {
    setShowSplitModal(true);
  };

  const handleShare = (): void => {
    setShowShareModal(true);
  };

  const handleViewActivityLog = (): void => {
    setShowActivityLog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del gasto...</p>
        </div>
      </div>
    );
  }

  if (!expenseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Gasto no encontrado</h2>
          <p className="mt-2 text-gray-600">El gasto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar
        title="Detalles del Gasto"
        onBack={handleBack}
        actions={[
          {
            icon: "Edit",
            label: "Editar",
            onClick: handleEdit
          },
          {
            icon: "Copy",
            label: "Duplicar",
            onClick: handleDuplicate
          },
          {
            icon: "Share",
            label: "Compartir",
            onClick: handleShare
          },
          {
            icon: "Trash2",
            label: "Eliminar",
            onClick: handleDelete
          }
        ]}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ExpenseSummaryCard expense={expenseData} />
            <ExpenseDetailsSection expense={expenseData} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas (proximamente)</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSplit}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Users" className="h-5 w-5 mr-2" />
                  Dividir Gasto
                </button>
                <button
                  onClick={handleViewActivityLog}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Clock" className="h-5 w-5 mr-2" />
                  Ver Historial
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Copy" className="h-5 w-5 mr-2" />
                  Duplicar Gasto
                </button>
              </div>
            </div>

            {/* Receipt Image */}
            {expenseData.receiptImage && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recibo</h3>
                <div className="relative">
                  <Image
                    src={expenseData.receiptImage}
                    alt="Recibo del gasto"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Icon name="Maximize" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          expense={expenseData}
        />
      )}

      {showSplitModal && (
        <SplitExpenseModal
          onClose={() => setShowSplitModal(false)}
          expense={expenseData}
        />
      )}

      {showShareModal && (
        <ShareExpenseModal
          onClose={() => setShowShareModal(false)}
          expense={expenseData}
        />
      )}

      {showActivityLog && (
        <ActivityLog
          isOpen={showActivityLog}
          onClose={() => setShowActivityLog(false)}
          activityLog={expenseData.activityLog}
        />
      )}

      <BottomTabNavigation />
    </div>
  );
};

export default ExpenseDetailsEdit; 