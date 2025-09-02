import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  type: 'income' | 'expense';
  category?: string;
  amount: number;
  period: 'monthly';
}

interface GoalsDialogProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  categories: {
    income: string[];
    expense: string[];
  };
}

export default function GoalsDialog({ goals, onGoalsUpdate, categories }: GoalsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalType, setGoalType] = useState<'income' | 'expense'>('expense');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (!goalAmount || (goalType === 'expense' && !goalCategory)) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Check if goal already exists for this category
    const existingGoal = goals.find(g => 
      g.type === goalType && 
      (goalType === 'income' ? true : g.category === goalCategory)
    );

    if (existingGoal) {
      toast({
        title: "Erro",
        description: "Já existe uma meta para esta categoria.",
        variant: "destructive",
      });
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      type: goalType,
      category: goalType === 'expense' ? goalCategory : undefined,
      amount: parseFloat(goalAmount),
      period: 'monthly'
    };

    onGoalsUpdate([...goals, newGoal]);
    setGoalAmount('');
    setGoalCategory('');
    
    toast({
      title: "Meta adicionada!",
      description: `Meta de ${goalType === 'income' ? 'receita' : 'despesa'} configurada.`,
    });
  };

  const handleRemoveGoal = (goalId: string) => {
    onGoalsUpdate(goals.filter(g => g.id !== goalId));
    toast({
      title: "Meta removida",
      description: "Meta foi removida com sucesso.",
    });
  };

  const incomeGoals = goals.filter(g => g.type === 'income');
  const expenseGoals = goals.filter(g => g.type === 'expense');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
          <Target className="w-4 h-4 mr-2" />
          Configurar Metas
        </Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-md bg-card/80 border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas Orçamentárias
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Goal */}
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Nova Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={goalType} onValueChange={(value: 'income' | 'expense') => setGoalType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Meta de Receita</SelectItem>
                      <SelectItem value="expense">Limite de Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {goalType === 'expense' && (
                  <div>
                    <Label>Categoria</Label>
                    <Select value={goalCategory} onValueChange={setGoalCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.expense.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div>
                <Label>Valor Mensal (R$)</Label>
                <Input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <Button onClick={handleAddGoal} className="w-full bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Meta
              </Button>
            </CardContent>
          </Card>

          {/* Existing Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Metas Configuradas</h3>
            
            {/* Income Goals */}
            {incomeGoals.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-success mb-2">Metas de Receita</h4>
                {incomeGoals.map((goal) => (
                  <div key={goal.id} className="flex justify-between items-center p-3 bg-success/10 rounded-lg mb-2">
                    <div>
                      <p className="font-medium text-success">Meta de Receita Mensal</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {goal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Expense Goals */}
            {expenseGoals.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-expense mb-2">Limites de Despesa</h4>
                {expenseGoals.map((goal) => (
                  <div key={goal.id} className="flex justify-between items-center p-3 bg-expense/10 rounded-lg mb-2">
                    <div>
                      <p className="font-medium text-expense">{goal.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Limite: R$ {goal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {goals.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma meta configurada ainda
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
