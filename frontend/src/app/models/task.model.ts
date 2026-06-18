export interface Task {
  id?: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'Low' | 'Medium' | 'High';
  is_done?: boolean;
  created_at?: string;
}