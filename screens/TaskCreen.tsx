import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/Index';
import { getTasks, createTask, updateTask, deleteTask } from '../store/taskSlide';
import type { Task } from '../store/taskSlide';

export default function TaskScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((s: RootState) => s.tasks);

  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const save = () => {
    if (!title.trim()) return;

    if (editId !== null) {
      const old = tasks.find(t => t.id === editId);
      if (old) dispatch(updateTask({ ...old, title: title.trim() }));
      setEditId(null);
    } else {
      dispatch(createTask(title.trim()));
    }
    setTitle('');
  };

  const edit = (task: Task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={s.card}>
      <Text style={s.task}>{item.title}</Text>
      <View style={s.buttons}>
        <TouchableOpacity style={s.edit} onPress={() => edit(item)}>
          <Text style={s.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.delete}
          onPress={() => dispatch(deleteTask(item.id))}
        >
          <Text style={s.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.heading}>Quản lý công việc</Text>

      <View style={s.form}>
        <TextInput
          style={s.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập công việc..."
        />
        <TouchableOpacity style={s.add} onPress={save}>
          <Text style={s.btnText}>{editId !== null ? 'Lưu' : 'Thêm'}</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={s.error}>{error}</Text>}

      <FlatList
        data={tasks}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={() => dispatch(getTasks())}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f5f5f5' },
  heading: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center',
    color: '#303f9f', marginBottom: 20
  },
  form: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 12, backgroundColor: 'white'
  },
  add: {
    backgroundColor: '#303fdb', padding: 12,
    borderRadius: 8, justifyContent: 'center'
  },
  card: {
backgroundColor: 'white', padding: 15,
    borderRadius: 8, marginBottom: 12
  },
  task: { fontSize: 17, marginBottom: 12 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  edit: { backgroundColor: '#f0a020', padding: 8, borderRadius: 6 },
  delete: { backgroundColor: '#e53935', padding: 8, borderRadius: 6 },
  btnText: { color: 'white', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 }
});