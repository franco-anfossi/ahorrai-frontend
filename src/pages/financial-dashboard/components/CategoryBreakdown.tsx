import React, { useState } from "react";
import { useRouter } from "next/router";
import Icon from "components/AppIcon";

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
        {data.map((category, index) => (
          <div key={index} className="group">
            <button
              onClick={() => toggleCategory(index)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
            >
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover spring-transition">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Category Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon
                      name={category.icon}
                      size={20}
                      style={{ color: category.color }}
                    />
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {category.name}
                      </h4>
                      <span className="text-sm font-semibold text-text-primary ml-2">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-text-secondary font-medium min-w-[40px] text-right">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <Icon
                  name={
                    expandedCategory === index ? "ChevronUp" : "ChevronDown"
                  }
                  size={16}
                  className="text-text-secondary ml-2 group-hover:text-text-primary spring-transition"
                />
              </div>
            </button>

            {/* Expanded Content */}
            {expandedCategory === index && (
              <div className="mt-2 ml-13 p-3 bg-surface-hover rounded-lg animate-fade-in">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Transacciones:</span>
                    <span className="text-text-primary font-medium ml-2">
                      {category.transactions ?? "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Promedio:</span>
                    <span className="text-text-primary font-medium ml-2">
                      {category.average != null
                        ? formatCurrency(category.average)
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">
                      vs Mes Anterior:
                    </span>
                    {category.vsLastMonth != null ? (
                      <span
                        className={`font-medium ml-2 ${category.vsLastMonth < 0 ? "text-success" : "text-error"}`}
                      >
                        {category.vsLastMonth > 0 ? "+" : ""}
                        {category.vsLastMonth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="font-medium ml-2 text-text-primary">
                        N/A
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-text-secondary">Presupuesto:</span>
                    <span className="text-text-primary font-medium ml-2">
                      {category.budget != null
                        ? formatCurrency(category.budget)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
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
