import React, { useState } from "react";
import { useRouter } from "next/router";
import Icon from "components/AppIcon";
import CategoryCard from "../../categories-budget-management/components/CategoryCard";

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  transactions?: number | null;
  average?: number | null;
  vsLastMonth?: number | null;
  budget?: number | null;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
  currency?: string;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  currency,
}) => {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "CLP",
    }).format(amount);
  };

  const toggleCategory = (categoryIndex: number): void => {
    setExpandedCategory(
      expandedCategory === categoryIndex ? null : categoryIndex,
    );
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-surface rounded-xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Desglose por Categorías
          </h3>
          <p className="text-sm text-text-secondary">
            Total: {formatCurrency(totalAmount)}
          </p>
        </div>

      </div>


      {/* Category List */}
      <div className="space-y-4">
        {data.map((category, index) => {
          const pct = category.percentage <= 1 ? category.percentage * 100 : category.percentage;
          return (
            <CategoryCard
              key={index}
              category={{
                id: String(index),
                name: category.name,
                icon: category.icon,
                color: category.color,
                description: '',
              }}
              progress={pct}
              amount={category.amount}
              transactions={category.transactions}
              average={category.average}
              vsLastMonth={category.vsLastMonth}
              budget={category.budget}
              showActions={false}
            />
          );
        })}
      </div>
      {/* View All Categories Button */}
      <button
        onClick={() => router.push("/categories-budget-management")}
        className="w-full mt-6 py-3 text-center text-primary font-medium hover:bg-primary-50 rounded-lg spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Ver Todas las Categorías
      </button>
    </div>
  );
};

export default CategoryBreakdown;
