import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Goal } from './GoalsDialog';

interface GoalsCardProps {
  goals: Goal[];
  totalIncome: number;
  expensesByCategory: Record<string, number>;
}

export default function GoalsCard({ goals, totalIncome, expensesByCategory }: GoalsCardProps) {
  const incomeGoals = goals.filter(g => g.type === 'income');
  const expenseGoals = goals.filter(g => g.type === 'expense');

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number, isExpense: boolean) => {
    if (isExpense) {
      // For expenses, red means over budget, green means under budget
      return percentage >= 100 ? 'bg-expense' : percentage >= 80 ? 'bg-warning' : 'bg-success';
    } else {
      // For income, green means meeting goal, yellow/red means under goal
      return percentage >= 100 ? 'bg-success' : percentage >= 70 ? 'bg-warning' : 'bg-expense';
    }
  };

  const getStatusIcon = (percentage: number, isExpense: boolean) => {
    if (isExpense) {
      return percentage >= 100 ? (
        <AlertTriangle className="w-4 h-4 text-expense" />
      ) : (
        <TrendingDown className="w-4 h-4 text-success" />
      );
    } else {
      return percentage >= 100 ? (
        <TrendingUp className="w-4 h-4 text-success" />
      ) : (
        <Target className="w-4 h-4 text-warning" />
      );
    }
  };

  if (goals.length === 0) {
    return (
      <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progresso das Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Configure suas metas para acompanhar o progresso
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Progresso das Metas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Income Goals */}
        {incomeGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-success mb-3">Metas de Receita</h4>
            {incomeGoals.map((goal) => {
              const percentage = getProgressPercentage(totalIncome, goal.amount);
              const progressColor = getProgressColor(percentage, false);
              const statusIcon = getStatusIcon(percentage, false);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {statusIcon}
                      <span className="text-sm font-medium">Receita Mensal</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Meta: R$ {goal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Expense Goals */}
        {expenseGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-expense mb-3">Limites de Despesa</h4>
            <div className="space-y-4">
              {expenseGoals.map((goal) => {
                const current = expensesByCategory[goal.category!] || 0;
                const percentage = getProgressPercentage(current, goal.amount);
                const progressColor = getProgressColor(percentage, true);
                const statusIcon = getStatusIcon(percentage, true);
                
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {statusIcon}
                        <span className="text-sm font-medium">{goal.category}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span>Limite: R$ {goal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {percentage >= 100 && (
                      <div className="text-xs text-expense font-medium">
                        ⚠️ Limite excedido em R$ {(current - goal.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}