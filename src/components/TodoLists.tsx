import type { TodoList as TodoListType, TodoItem } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronUp, ChevronDown, Trash2, Plus, X } from 'lucide-react';

interface TodoListsProps {
  lists: TodoListType[];
  isEditing: boolean;
  onUpdate: (lists: TodoListType[]) => void;
}

export function TodoLists({ lists, isEditing, onUpdate }: TodoListsProps) {
  const updateLists = (updater: (prev: TodoListType[]) => TodoListType[]) => {
    onUpdate(updater([...lists]));
  };

  const addList = () => {
    const newList: TodoListType = {
      id: Date.now().toString(),
      name: 'New List',
      items: [],
    };
    updateLists((prev) => [...prev, newList]);
  };

  const removeList = (listId: string) => {
    updateLists((prev) => prev.filter((l) => l.id !== listId));
  };

  const updateListName = (listId: string, name: string) => {
    updateLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, name } : l))
    );
  };

  const addItem = (listId: string) => {
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: 'New item',
      done: false,
    };
    updateLists((prev) =>
      prev.map((l) =>
        l.id === listId ? { ...l, items: [...l.items, newItem] } : l
      )
    );
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<TodoItem>) => {
    updateLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
            }
          : l
      )
    );
  };

  const removeItem = (listId: string, itemId: string) => {
    updateLists((prev) =>
      prev.map((l) =>
        l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l
      )
    );
  };

  const moveItem = (listId: string, itemId: string, direction: 'up' | 'down') => {
    updateLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const index = l.items.findIndex((i) => i.id === itemId);
        if (index === -1) return l;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= l.items.length) return l;
        const newItems = [...l.items];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        return { ...l, items: newItems };
      })
    );
  };

  return (
    <div className="space-y-4">
      {lists.map((list) => (
        <div key={list.id} className="space-y-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            {isEditing ? (
              <Input
                value={list.name}
                onChange={(e) => updateListName(list.id, e.target.value)}
                className="flex-1 text-xs font-bold"
              />
            ) : (
              <h4 className="text-xs font-bold text-gray-900 font-sans tracking-tight">{list.name}</h4>
            )}
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeList(list.id)}
                className="ml-2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ul className="space-y-1">
            {list.items.map((item, index) => (
              <li key={item.id} className="flex items-start gap-2">
                {isEditing && (
                  <div className="flex flex-col gap-0.5 pt-1">
                    <button
                      onClick={() => moveItem(list.id, item.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveItem(list.id, item.id, 'down')}
                      disabled={index === list.items.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) =>
                    updateItem(list.id, item.id, { done: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
                />
                {isEditing ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={item.text}
                      onChange={(e) => updateItem(list.id, item.id, { text: e.target.value })}
                      className="flex-1 text-xs font-medium"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(list.id, item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span
                    className={`flex-1 text-xs font-medium font-sans ${
                      item.done ? 'text-gray-400 line-through' : 'text-gray-600'
                    }`}
                  >
                    {item.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addItem(list.id)}
              className="mt-2 text-[10px]"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add item
            </Button>
          )}
        </div>
      ))}
      {isEditing && (
        <Button variant="outline" size="sm" onClick={addList} className="w-full text-xs">
          <Plus className="mr-2 h-4 w-4" />
          Add list
        </Button>
      )}
    </div>
  );
}

