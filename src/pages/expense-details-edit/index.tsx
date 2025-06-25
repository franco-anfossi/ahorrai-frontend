import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import ExpenseDetailsSection from './components/ExpenseDetailsSection';
import EditExpenseForm from './components/EditExpenseForm';
import ActivityLog from './components/ActivityLog';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SplitExpenseModal from './components/SplitExpenseModal';
import ShareExpenseModal from './components/ShareExpenseModal';
import HeaderBar from 'components/ui/HeaderBar';
import BottomTabNavigation from '@/components/ui/BottomTabNavigation';
import { Expense } from '../../types';

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

  // Mock expense data that matches dashboard transactions
  const mockExpenseDataMap: Record<string, Expense> = {
    '1d94fa0c-a350-40d8-84b5-895c30fb055d': {
      id: '1d94fa0c-a350-40d8-84b5-895c30fb055d',
      amount: 12.45,
      currency: "USD",
      category: {
        id: 1,
        name: "Comida y Restaurantes",
        icon: "Coffee",
        color: "#EF4444"
      },
      merchant: "Starbucks Coffee",
      date: "2024-01-15T19:30:00Z",
      paymentMethod: "Tarjeta de Crédito",
      cardLast4: "4532",
      description: "Café de la mañana y pastel",
      tags: ["café", "desayuno", "mañana"],
      location: {
        address: "Centro Comercial Plaza Mayor",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      receiptImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
      notes: "Café americano grande y pastel de chocolate. El café estaba perfecto y el pastel muy fresco.",
      status: "completed",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-15T19:45:00Z",
          details: "Gasto creado mediante escaneo de recibo"
        },
        {
          id: "log_002",
          action: "edited",
          timestamp: "2024-01-15T20:15:00Z",
          details: "Agregadas notas y etiquetas"
        }
      ]
    },
    'e6c1d1a3-2985-4c40-9d63-2f57f6aea2fa': {
      id: 'e6c1d1a3-2985-4c40-9d63-2f57f6aea2fa',
      amount: 18.75,
      currency: "USD",
      category: {
        id: 2,
        name: "Transporte",
        icon: "Car",
        color: "#3B82F6"
      },
      merchant: "Uber Ride",
      date: "2024-01-15T14:30:00Z",
      paymentMethod: "Tarjeta de Débito",
      cardLast4: "1234",
      description: "Viaje a la oficina del centro",
      tags: ["transporte", "trabajo", "oficina"],
      location: {
        address: "Centro de la ciudad",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      receiptImage: null,
      notes: "Viaje en Uber desde casa hasta la oficina. El conductor fue muy amable y el viaje fue rápido.",
      status: "completed",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-15T14:45:00Z",
          details: "Gasto creado automáticamente desde Uber"
        }
      ]
    },
    'b1a9371e-d1a9-462b-93d3-1a80f04f0b44': {
      id: 'b1a9371e-d1a9-462b-93d3-1a80f04f0b44',
      amount: 89.99,
      currency: "USD",
      category: {
        id: 3,
        name: "Compras",
        icon: "Package",
        color: "#10B981"
      },
      merchant: "Amazon Purchase",
      date: "2024-01-14T10:30:00Z",
      paymentMethod: "Tarjeta de Crédito",
      cardLast4: "5678",
      description: "Auriculares inalámbricos",
      tags: ["tecnología", "audio", "compras online"],
      location: {
        address: "Compra online",
        coordinates: null
      },
      receiptImage: null,
      notes: "Auriculares Sony WH-1000XM4. Excelente calidad de sonido y cancelación de ruido.",
      status: "pending",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-14T10:45:00Z",
          details: "Gasto creado desde Amazon"
        },
        {
          id: "log_002",
          action: "status_changed",
          timestamp: "2024-01-14T11:00:00Z",
          details: "Estado cambiado a pendiente"
        }
      ]
    },
    '5457205a-bf9a-420c-b3d9-0b4059ed10e9': {
      id: '5457205a-bf9a-420c-b3d9-0b4059ed10e9',
      amount: 15.99,
      currency: "USD",
      category: {
        id: 4,
        name: "Entretenimiento",
        icon: "Film",
        color: "#F59E0B"
      },
      merchant: "Netflix Subscription",
      date: "2024-01-13T00:00:00Z",
      paymentMethod: "Tarjeta de Crédito",
      cardLast4: "9012",
      description: "Servicio de streaming mensual",
      tags: ["entretenimiento", "streaming", "suscripción"],
      location: {
        address: "Servicio online",
        coordinates: null
      },
      receiptImage: null,
      notes: "Suscripción mensual de Netflix. Plan estándar con 2 pantallas.",
      status: "completed",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-13T00:05:00Z",
          details: "Cargo automático mensual"
        }
      ]
    },
    'd0022dd0-7ee5-4bf1-bf5e-d0b7b9e2b86c': {
      id: 'd0022dd0-7ee5-4bf1-bf5e-d0b7b9e2b86c',
      amount: 127.83,
      currency: "USD",
      category: {
        id: 1,
        name: "Comida y Restaurantes",
        icon: "ShoppingCart",
        color: "#EF4444"
      },
      merchant: "Whole Foods Market",
      date: "2024-01-12T16:30:00Z",
      paymentMethod: "Tarjeta de Débito",
      cardLast4: "3456",
      description: "Compras semanales de comestibles",
      tags: ["comida", "comestibles", "semanal"],
      location: {
        address: "Whole Foods Market - Downtown",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      receiptImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
      notes: "Compras semanales incluyendo frutas, verduras, carnes y productos orgánicos.",
      status: "completed",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-12T16:45:00Z",
          details: "Gasto creado mediante escaneo de recibo"
        }
      ]
    },
    '16cb8653-1307-43e0-b0e2-fc3d9a94b3c9': {
      id: '16cb8653-1307-43e0-b0e2-fc3d9a94b3c9',
      amount: 45.20,
      currency: "USD",
      category: {
        id: 5,
        name: "Salud y Bienestar",
        icon: "Heart",
        color: "#EC4899"
      },
      merchant: "CVS Pharmacy",
      date: "2024-01-11T12:00:00Z",
      paymentMethod: "Efectivo",
      cardLast4: null,
      description: "Medicamentos y productos de cuidado personal",
      tags: ["salud", "medicamentos", "farmacia"],
      location: {
        address: "CVS Pharmacy - Main Street",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      receiptImage: null,
      notes: "Compra de medicamentos recetados y productos de cuidado personal.",
      status: "completed",
      activityLog: [
        {
          id: "log_001",
          action: "created",
          timestamp: "2024-01-11T12:15:00Z",
          details: "Gasto registrado manualmente"
        }
      ]
    }
  };

  useEffect(() => {
    const loadExpenseData = () => {
      const { id } = router.query;
      if (id && typeof id === 'string') {
        const data = mockExpenseDataMap[id];
        if (data) {
          setExpenseData(data);
        } else {
          // Handle expense not found
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
        id: `dup-${Date.now()}`,
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
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

      <EditExpenseForm
        isOpen={false}
        onClose={() => {}}
        expense={expenseData}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <BottomTabNavigation />
    </div>
  );
};

export default ExpenseDetailsEdit; 